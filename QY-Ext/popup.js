$(function() {
    $( "#tabs" ).tabs();
    $("#body").width+=1;
    $( "input[type=submit]")
    .button()
    .click(function( event ) {
        event.preventDefault();
    });

    $( ".submit1" ).click(function() {
        //check if options are selected
        if($(".type1 option:selected").val() != "" && $(".payload1 option:selected").val() != ""){
            chrome.tabs.query({'active': true}, function(tabs) {

                //current tab

                //chrome.tabs.update(tabs[0].id, {url: "http://www.google.com"});
                var attackTab = tabs[0].id;
                //send message to content tab to begin attack based on payload
                //start attack

                var scanId;
                chrome.extension.sendMessage({ type: 'scanIndex' }, function(res) {
                    scanId = res.scanIndex;
                    chrome.storage.local.set({'scanning':{scanId:scanId,status:true,url:tabs[0].url,payload:payload[ $(".payload1 option:selected").val()],payloadId:0,tab:tabs[0].id,index:1}},function(){

                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            chrome.tabs.sendMessage(tabs[0].id,{"type":"start","url":tabs[0].url,"payload":payload[ $(".payload1 option:selected").val() ]});
                        });
                    });

                });

                // open scan result page 
                var index;
                var exist = false;
                for(index = 0; index< chrome.extension.getViews().length;index++){
                    if (chrome.extension.getViews()[index].location.href.match(/.*process.html.*/)){
                        exist=true; 
                    } 
                }
                if(!exist){
                    chrome.tabs.create({'url': chrome.extension.getURL('process.html')}, function(tab) {
                        // Tab opened.
                        chrome.storage.local.set({'result':{id:tab.id}});
                    });
                }
            });
        }
    });

    $( ".type1" ).change(function() {
        if(this.value==="sql"){
            $( ".payload1" ).children().remove();
            payload.forEach(function(payloads,index){
                if ("sql" == payloads[0]) {
                    $( ".payload1" ).children().end().append('<option value="'+index+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel").show();
        } else if(this.value==="xss") {
            $( ".payload1" ).children().remove();
            payload.forEach(function(payloads,index){
                if ("xss" == payloads[0]) {
                    $( ".payload1" ).children().end().append('<option value="'+index+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel").show();
        } else if(this.value==="xsrf") {
            $( ".payload1" ).children().remove();
            payload.forEach(function(payloads,index){
                if ("xsrf" == payloads[0]) {
                    $( ".payload1" ).children().end().append('<option value="'+index+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel").show();
        } else {
            $( ".payload1" ).children().remove();
            $(".payloadLabel").hide();
        }
    });
});


//payload[0] = category
//payload[1] = Name of scan
//payload[2] = id of scan
//payload[3] = attack parameter
//  payload[3][i][0] = fields to target ( * = everything )
//  payload[3][i][1] = payload to inject.
//payload[4] = signature to detect ( differential detection : @save[1] and @compare[1] )  
//sql - regex
//xss - dom
//xsrf - token/captcha



var payload = [ 
    ["sql", "Test for vulnerability", "sql1",
     [["*","';--"],["*","'--"]],
     ["An error occured: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to","error"]
    ],
    ["sql", "Login Field","sql2",
     [["^.*username.*$","' or '1' = '1"]]
    ],
    ["xss", "Test for vulnerability","xss1",
     [["*","<div id='w1232' href='w1232' src='w1232'></div>"]],
     ["@XSS,w1232,href,src"]
    ],
    ["xss", "Insert Image","xss2",
     [["*",""]]
    ],
    ["xss", "Insert Script","xss3",
     [["*",""]]
    ],
    ["xss", "Insert Redirection","xss4",
     [["*",""]]
    ],
    ["xsrf", "Test for vulnerability", "xsrf1",
     [["z{1000}",""]],
     ["@XSRF,compare","@XSRF,tokencaptcha"]]

];
