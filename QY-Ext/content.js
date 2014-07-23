var last_target = null;
document.addEventListener('mousedown', function(event){
    //possibility: check that the mouse button == 2
    last_target = event.target;
}, true);


$(document).ready(function(){ 

    chrome.extension.sendMessage({ type: 'tabID' }, function(res) {
        tabID = res.tabID;
        checkIfShouldScan(tabID);
    });

});


function checkIfShouldScan(tabId){

    chrome.storage.sync.get("scanning", function(obj){
        var scanStatus = obj.scanning.status;
        var attackUrl = obj.scanning.url;
        //make sure the scan is on correct tab
        if (scanStatus && obj.scanning.tab == tabId) {

            //scan for signature
            //console.log(document.documentElement.outerHTML);
            var index;
            var vulnerability;

            for(index=0;index<obj.scanning.payload[4].length;index++){
                //depending on signature, do different stuff
                //payload[4] = signature to detect ( differential detection : @save[1] and @compare[1] ) 

                if (document.documentElement.outerHTML.match(new RegExp(obj.scanning.payload[4][index],"i"))){

                    //send message to process.html to record results

                    chrome.runtime.sendMessage(
                        {
                            result: [
                                obj.scanning.scanId,
                                attackUrl,
                                obj.scanning.payload[0].toUpperCase()+"-"+obj.scanning.payload[1],
                                obj.scanning.payload[3][obj.scanning.payloadId][1],
                                obj.scanning.payload[4][index],
                                "Yes"]
                        }
                        , function(response) {
                        });


                }


            }


            //revert back to initial page regardless of current page ( Because post will not change the url )
            location = attackUrl;

            //next payload
            if ( location == attackUrl ) {
                chrome.storage.sync.set({
                    'scanning':{
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


function scan(payload,url,index,payloadId) {
    //$("input:not([type='submit']),textarea,option") except for submit
    //textarea, select(one time suffice) $('select option:selected')

    inputs = $("input,select option:selected,textarea").not("input[type='submit']").not("input[type='button']").not("input[type='reset']");
    //console.log(index+ " "+inputs.length+" "+payloadId +" "+ payload[3].length);


    if(payloadId>=payload[3].length){

        //done
        chrome.storage.sync.set({'scanning':{scanId:0,status:false,url:"",payload:"",payloadId:0,tab:0,index:0}});
        alert("Scan Done!");
    }  else {

        //scan not done
        if( index < inputs.length ){
            //Payload versatility

            //console.log(payload[3]);
            //compare name of input with payload[3][1];
            if (payload[3][payloadId][0] == "*"){

                inputs[index].value = payload[3][payloadId][1];
                inputs[index].style.outline = "none";
                inputs[index].style.border = "red 2px solid";
                inputs[index].style.boxShadow  = "0 0 10px red";
                HTMLFormElement.prototype.submit.call(inputs[index].form);

            } else {

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
            chrome.storage.sync.get("scanning", function(obj){
                chrome.storage.sync.set({
                    'scanning':{
                        scanId:obj.scanning.scanId,
                        status:true,
                        url:obj.scanning.url,
                        payload:obj.scanning.payload,
                        payloadId:obj.scanning.payloadId+1,
                        tab:obj.scanning.tab,
                        index:0
                    }
                });
            });
        }

    }


}



//onmessage for start of attack
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if ( request.type == "start" ) {
            scan(request.payload,request.url,0,0);
        }

        //if (request.greeting == "hello") sendResponse({farewell: "goodbye"});
    });
