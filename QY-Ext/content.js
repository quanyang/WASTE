
function escapeHtml(text) {
    return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

$(document).ready(function(){ 

    chrome.extension.sendMessage({ type: 'tabID' }, function(res) {
        tabID = res.tabID;
        checkIfShouldScan(tabID);
    });

});


function checkIfShouldScan(tabId){

    chrome.storage.local.get("scanning", function(obj){
        var scanStatus = obj.scanning.status;
        var attackUrl = obj.scanning.url;
        //make sure the scan is on correct tab
        if (scanStatus && obj.scanning.tab == tabId) {

            //scan for signature
            //console.log(document.documentElement.outerHTML);
            var index2;
            var vulnerability;

            for(index2=0;index2<obj.scanning.payload[4].length;index2++) {
                //depending on signature, do different stuff
                //payload[4] = signature to detect ( differential detection : @save[1] and @compare[1] ) 
                if (obj.scanning.payload[4][index2].match(/^@XSS,/)){

                    //XSS
                    var toScan=obj.scanning.payload[4][index2].split(",");
                    if($("#"+toScan[1])&&$("#"+toScan[1]).length){
                        if(toScan.length>2){
                            var x=2;
                            var vuln=true;
                            for(;x<toScan.length;x++){
                                if($("#"+toScan[1]).attr(toScan[x])){
                                    chrome.runtime.sendMessage(
                                        {
                                            result: [
                                                obj.scanning.scanId,
                                                attackUrl,
                                                obj.scanning.payload[0].toUpperCase()+"-"+obj.scanning.payload[1],
                                                obj.scanning.input,
                                                escapeHtml(obj.scanning.payload[3][obj.scanning.payloadId][1]),
                                                "ID: "+toScan[1]+" and "+toScan[x]+" attributes detected",
                                                "Yes"]
                                        }
                                        , function(response) {
                                        });
                                }
                            }
                            location = attackUrl;

                        }

                    } else {
                        location = attackUrl;
                    }
                    //END OF XSS


                } else if (obj.scanning.payload[4][index2].match(/^@XSRF,/)&&obj.scanning.index<2&&obj.scanning.status) {
                    //START OF XSRF
                    if (obj.scanning.payload[4][index2].match(/^@XSRF,compare/)) {
                        chrome.storage.local.get("xsrfstore", function(objz){
                            if(objz.xsrfstore.html!=$('form').innerHTML){

                                chrome.runtime.sendMessage(
                                    {
                                        result: [
                                            obj.scanning.scanId,
                                            attackUrl,
                                            obj.scanning.payload[0].toUpperCase()+"-"+obj.scanning.payload[1],
                                            "Comparison with no inputs",
                                            "None",
                                            "Comparison test - Possible Token",
                                            "Fail - Difference detected"]
                                    }
                                    , function(response) {
                                    });  

                            } 
                        });

                        chrome.storage.local.remove('xsrfstore');
                    } else if (obj.scanning.payload[4][index2].match(/^@XSRF,tokencaptcha/)){

                        inputs = $("input,select option:selected,textarea").not("input[type='submit']").not("input[type='button']").not("input[type='reset']");

                        var tokenRegex = [
                            ".*token.*",".*captcha.*",".*turing.*",".*nonce.*"
                        ];
                        $.each(inputs,function(key,val){
                            tokenRegex.forEach(function(y){
                                if(val.name.match(new RegExp(y,"i"))){

                                    chrome.runtime.sendMessage(
                                        {
                                            result: [
                                                obj.scanning.scanId,
                                                attackUrl,
                                                obj.scanning.payload[0].toUpperCase()+"-"+obj.scanning.payload[1],
                                                val.name,
                                                "None",
                                                "Regex test with regex: "+y,
                                                "Fail - token/captcha detected"]
                                        }
                                        , function(response) {

                                        });  
                                } 
                            });
                        });


                    }

                    //END OF XSRF
                } else if (document.documentElement.outerHTML.match(new RegExp(obj.scanning.payload[4][index2],"i"))){
                    // MUST BE REGEX BASED SIGNATURE

                    //send message to process.html to record results
                    chrome.runtime.sendMessage(
                        {
                            result: [
                                obj.scanning.scanId,
                                attackUrl,
                                obj.scanning.payload[0].toUpperCase()+"-"+obj.scanning.payload[1],
                                obj.scanning.input,
                                obj.scanning.payload[3][obj.scanning.payloadId][1],
                                obj.scanning.payload[4][index2],
                                "Yes"]
                        }
                        , function(response) {
                            location = attackUrl;
                        });

                } else {
                    location = attackUrl;
                }
            }





            //revert back to initial page regardless of current page ( Because post will not change the url )
            if( obj.scanning.index!=0&& obj.scanning.payload[0]=="xsrf"){
                scan(obj.scanning.payload,attackUrl,obj.scanning.index,obj.scanning.payload[4].length+2);
                //next payload
            } else if (location == attackUrl ) {
                chrome.storage.local.set({
                    'scanning':{
                        input:obj.scanning.input,
                        scanId:obj.scanning.scanId,
                        status:true,
                        url:attackUrl,
                        payload:obj.scanning.payload,
                        payloadId:obj.scanning.payloadId,
                        tab:obj.scanning.tab,
                        index:obj.scanning.index+1
                    }
                });
                scan(obj.scanning.payload,attackUrl,obj.scanning.index,obj.scanning.payloadId);
            }
        }
    });
}
function scan2(payload,url,indexx,payloadId) {
    console.log(payload);
    inputs = $("input,select option:selected,textarea").not("input[type='submit']").not("input[type='button']").not("input[type='reset']");

    $.each(inputs,function(index,obj){
        if (inputs[index].name.match(new RegExp(payload[3][payloadId][0],"i"))) {
            chrome.storage.local.get("autofill",function(obj){
                var setting = JSON.parse(obj.autofill.settings);
                $.each(setting,function(key,value){
                    $('input').filter(function() {
                        return (new RegExp(key,"i")).test($(this).attr('name'));
                    }).val(value);
                });
            });



            inputs[index].value = payload[3][payloadId][1];

            if(payload[0]=="xss"){
                var method =    $(inputs[index]).closest("form").attr("method");
                $(inputs[index]).closest("form").attr("target","_blank");
                $(inputs[index]).closest("form").attr("method","get");
                HTMLFormElement.prototype.submit.call(inputs[index].form);  

                if(method!="get")
                    $(inputs[index]).closest("form").attr("method",method);

                inputs[index].value = payload[3][payloadId][1];
                $(inputs[index]).closest("form").attr("target","");
                HTMLFormElement.prototype.submit.call(inputs[index].form);     

            } else {     
                inputs[index].style.outline = "none";
                inputs[index].style.border = "red 2px solid";
                inputs[index].style.boxShadow  = "0 0 10px red";
                HTMLFormElement.prototype.submit.call(inputs[index].form);     
            }
        } 
    });
}


function scan(payload,url,index,payloadId) {

    chrome.extension.sendMessage({ type: 'openResult' }, function(res) {
    });

    //console.log(payload+" "+url+" "+index+" "+payloadId);
    //$("input:not([type='submit']),textarea,option") except for submit
    //textarea, select(one time suffice) $('select option:selected')
    inputs = $("input,select option:selected,textarea").not("input[type='submit']").not("input[type='button']").not("input[type='reset']");

    chrome.storage.local.get("scanning", function(obj){

        if(!obj.scanning.status||payloadId>=payload[3].length){

            alert("scan is completed");
            chrome.storage.local.remove('xsrfstore');
            chrome.storage.local.set({'scanning':{input:"",scanId:0,status:false,url:"",payload:"",payloadId:0,tab:0,index:0}});
            chrome.runtime.sendMessage(
                {
                    result: [
                        obj.scanning.scanId,
                        url,
                        obj.scanning.payload[0].toUpperCase()+"-"+obj.scanning.payload[1],
                        "",
                        "",
                        "",
                        "Uncertain",
                        "done"
                    ]
                }
                , function(response) {
                });
            //done

        }  else {

            //scan not done
            if( index < inputs.length ){
                //Payload versatility
                chrome.storage.local.get("autofill",function(obj){
                    var setting = JSON.parse(obj.autofill.settings);
                    $.each(setting,function(key,value){
                        $('input').filter(function() {
                            return (new RegExp(key,"i")).test($(this).attr('name'));
                        }).val(value);
                    });
                });

                chrome.storage.local.set({
                    'scanning':{
                        input:inputs[index].name,
                        scanId:obj.scanning.scanId,
                        status:obj.scanning.status,
                        url:obj.scanning.url,
                        payload:obj.scanning.payload,
                        payloadId:obj.scanning.payloadId,
                        tab:obj.scanning.tab,
                        index:obj.scanning.index
                    }
                });
                if (payload[0]=="xsrf"&&index<1){
                    chrome.storage.local.set({
                        'xsrfstore':{
                            html: $('form').innerHTML
                        }
                    });
                    location = url;
                } else
                    if (payload[3][payloadId][0] == "*"){
                        inputs[index].value = payload[3][payloadId][1];
                        inputs[index].style.outline = "none";
                        inputs[index].style.border = "red 2px solid";
                        inputs[index].style.boxShadow  = "0 0 10px red";
                        HTMLFormElement.prototype.submit.call(inputs[index].form);

                    } else {

                        //compare name of input with payload[3][index][0];
                        if (inputs[index].name.match(new RegExp(payload[3][payloadId][0],"i"))) {

                            inputs[index].value = payload[3][payloadId][1];
                            inputs[index].style.outline = "none";
                            inputs[index].style.border = "red 2px solid";
                            inputs[index].style.boxShadow  = "0 0 10px red";
                            HTMLFormElement.prototype.submit.call(inputs[index].form);     

                        } else {
                            location = url;
                        }
                    }

            } else {
                //else payloadId++
                chrome.storage.local.set({
                    'scanning':{
                        input:obj.scanning.input,
                        scanId:obj.scanning.scanId,
                        status:true,
                        url:obj.scanning.url,
                        payload:obj.scanning.payload,
                        payloadId:obj.scanning.payloadId+1,
                        tab:obj.scanning.tab,
                        index:0
                    }
                });

            }
        }
    });

}

var last;
//onmessage for start of attack
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if ( request.type == "start2" ) {

            scan2(request.payload,request.url,0,0);
            sendResponse({farewell: "goodbye"});
        }
        if ( request.type == "start" ) {

            scan(request.payload,request.url,0,0);
            sendResponse({farewell: "goodbye"});
        }
        if(request.type =="getInput"){
            var input  =$("input,select option:selected,textarea").not("input[type='submit']").not("input[type='button']").not("input[type='reset']");
            var output = {};
            $.each(input,function(ind,obj){
                output[ind] = obj.name;
            });
            sendResponse({input: JSON.stringify(output)});
        }
        if( request.type=="highlight"){
            if( last )
                last.css("outline","none").css("border","").css("boxShadow","");
            last = $(":input[name='"+request.name+"']");
            $(":input[name='"+request.name+"']").css("outline","none");
            $(":input[name='"+request.name+"']").css("border" , "#09f 1px solid");
            $(":input[name='"+request.name+"']").css("boxShadow"  ,"0 0 10px #09f");
        }

        //if (request.greeting == "hello") sendResponse({farewell: "goodbye"});
    });
