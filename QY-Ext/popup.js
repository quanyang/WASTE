$(function() {
    $( "#tabs" ).tabs();
    $(".result").click(function(event){
        $(".default").click();
        var index;
        var exist = false;
        for(index = 0; index< chrome.extension.getViews().length;index++){
            if (chrome.extension.getViews()[index].location.href.match(/.*process.html.*/)){
                chrome.extension.getViews()[index].chrome.tabs.getCurrent(function(tab){chrome.tabs.update(tab.id, {"selected": true})});
                exist=true; 
                break;
            } 
        }
        if(!exist){
            chrome.tabs.create({'url': chrome.extension.getURL('process.html')}, function(tab) {
                // Tab opened.
                chrome.storage.local.set({'result':{id:tab.id}});
            });
        }

    });
    $(".manual").click(function(event){
        chrome.tabs.query({'active': true}, function(tabs) {
            var attackTab = tabs[0].id;
            chrome.tabs.sendMessage(
                tabs[0].id,
                {"type":"getInput"
                },function(response){
                    var inputs = JSON.parse(response.input);
                    console.log(inputs);
                    $.each(inputs,function(ind,name){
                        $( ".target2" ).children().end().append('<option value="'+name+'">'+name+'</option>');
                    });
                }   
            );
        });
    });

    $( "input[type=button]")
    .button()
    .click(function( event ) {
        event.preventDefault();
    });

    $( "input[type=submit]")
    .button()
    .click(function( event ) {
        event.preventDefault();
    });
    $( ".stop" ).click(function() {
        chrome.storage.local.get("scanning", function(obj){
            chrome.tabs.duplicate(obj.scanning.tab);
            chrome.tabs.remove(obj.scanning.tab);
        });

        chrome.storage.local.remove('xsrfstore');
        chrome.storage.local.set({'scanning':{input:"",scanId:0,status:false,url:"",payload:"",payloadId:0,tab:0,index:0}});

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
                // open scan result page 



                chrome.storage.local.get("scanIndex", function(res){
                    var scanId=res.scanIndex.scanIndex;
                    res.scanIndex.scanIndex++;
                    chrome.storage.local.set({
                        'scanIndex':{
                            scanIndex: res.scanIndex.scanIndex,
                        }
                    });

                    chrome.storage.local.set({'scanning':{scanId:scanId,status:true,url:tabs[0].url,payload:payload[ $(".payload1 option:selected").val()],payloadId:0,tab:tabs[0].id,index:1}},
                                             function(){
                                                 chrome.tabs.sendMessage(
                                                     tabs[0].id,
                                                     {"type":"start",
                                                      "url":tabs[0].url,
                                                      "payload":payload[$(".payload1 option:selected").val()]
                                                     },function(response){
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
                                                     }
                                                 );

                                             });


                });

            });
        }
    });

    $( ".submit2" ).click(function() {
        //check if options are selected
        if($(".customPayload2").val() != "" &&$(".target2 option:selected").val() != "" &&$(".type2 option:selected").val() != "" && $(".payload2 option:selected").val() != ""){
            chrome.tabs.query({'active': true}, function(tabs) {

                //current tab
                var attackTab = tabs[0].id;
                //send message to content tab to begin attack based on payload
                //start attack
                // open scan result page 
                chrome.storage.local.get("scanIndex", function(res){
                    var scanId=res.scanIndex.scanIndex;
                    res.scanIndex.scanIndex++;
                    chrome.storage.local.set({
                        'scanIndex':{
                            scanIndex: res.scanIndex.scanIndex,
                        }
                    });
                    var pay = payload2[ $(".payload2 option:selected").val()];
                    pay[3][0][0] = $(".target2 option:selected").val();
                    pay[3][0][1] = $(".customPayload2").val();



                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {"type":"start2",
                         "url":tabs[0].url,
                         "payload":pay
                        },function(response){
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
                        }
                    );




                });

            });
        }
    });


    $( ".payload2" ).change(function() {
        console.log(this.value);
        $(".customPayload2").val(payload2[this.value][3][0][1]);
    });



    $( ".type2" ).change(function() {
        if(this.value==="sql"){
            $( ".payload2" ).children().remove();
            $( ".payload2" ).children().end().append('<option value=""></option>');
            payload2.forEach(function(payloads,index){
                if ("sql" == payloads[0]) {
                    $( ".payload2" ).children().end().append('<option value="'+index+'">'+payloads[1]+'</option>');
                } 
            });

            $(".payloadLabel2").show();
        } else if(this.value==="xss") {
            $( ".payload2" ).children().remove();

            $( ".payload2" ).children().end().append('<option value=""></option>');
            payload2.forEach(function(payloads,index){
                if ("xss" == payloads[0]) {
                    $( ".payload2" ).children().end().append('<option value="'+index+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel2").show();
        } else {
            $( ".payload2" ).children().remove();
            $(".payloadLabel2").hide();
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

//2 for custom
var payload2 = [ 
    ["sql", "Test for vulnerability", "sql1",
     [["*","';--"]],
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
    ]

];


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
