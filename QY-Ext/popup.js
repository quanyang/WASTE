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
                //start attack
                
                chrome.tabs.create({'url': chrome.extension.getURL('process.html')}, function(tab) {
                    // Tab opened.
                });
            });
        }
    });

    $( ".type1" ).change(function() {
        if(this.value==="sql"){
            $( ".payload1" ).children().remove();
            payload.forEach(function(payloads){
                if ("sql" == payloads[0]) {
                    $( ".payload1" ).children().end().append('<option value="'+payloads[2]+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel").show();
        } else if(this.value==="xss") {
            $( ".payload1" ).children().remove();
            payload.forEach(function(payloads){
                if ("xss" == payloads[0]) {
                    $( ".payload1" ).children().end().append('<option value="'+payloads[2]+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel").show();
        } else if(this.value==="xsrf") {
            $( ".payload1" ).children().remove();
            payload.forEach(function(payloads){
                if ("xsrf" == payloads[0]) {
                    $( ".payload1" ).children().end().append('<option value="'+payloads[2]+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel").show();
        } else {
            $( ".payload1" ).children().remove();
            $(".payloadLabel").hide();
        }
    });
});

var payload = [
    ["sql", "Test for vulnerability", "sql1",["","';--"]],
    ["sql", "Login Field","sql2", "sql2",["' or '1' = '1"]],
    ["xss", "Test for vulnerability","xss1",[""]],
    ["xss", "Insert Image","xss2",[""]],
    ["xss", "Insert Script","xss3",[""]],
    ["xss", "Insert Redirection","xss4",[""]],
    ["xsrf", "Test for vulnerability", "xsrf1",[""]]
];
