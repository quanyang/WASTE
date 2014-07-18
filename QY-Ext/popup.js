$(function() {
    $( "#tabs" ).tabs();
    $("#body").width+=1;
    $( "input[type=submit]")
    .button()
    .click(function( event ) {
        event.preventDefault();
    });

    $( ".type1" ).change(function() {
        if(this.value==="sql"){
            $( ".payload1" ).children().remove().end();
            payload.forEach(function(payloads){
                if ("sql" == payloads[0]) {
                    $( ".payload1" ).children().end().append('<option value="'+payloads[2]+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel").show();
        } else if(this.value==="xss") {
            $( ".payload1" ).children().remove().end();
            payload.forEach(function(payloads){
                if ("xss" == payloads[0]) {
                    $( ".payload1" ).children().end().append('<option value="'+payloads[2]+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel").show();
        } else if(this.value==="xsrf") {
            $( ".payload1" ).children().remove().end();
            payload.forEach(function(payloads){
                if ("xsrf" == payloads[0]) {
                    $( ".payload1" ).children().end().append('<option value="'+payloads[2]+'">'+payloads[1]+'</option>');
                } 
            });
            $(".payloadLabel").show();
        }
    });
});

var payload = [
    ["sql", "Test for vulnerability", "sql1",["","';--"]],
    ["sql", "Login Field","sql2", "sql2",["' or '1' = '1"]]
];

var xsschild = [
    {"title": "Test for vulnerability", "id":"xss1", "contexts":["editable"]},
    {"title": "Insert Image", "id":"xss2", "contexts":["editable"]},
    {"title": "Insert Script","id":"xss3", "contexts":["editable"]},
    {"title": "Insert Redirection","id":"xss4",  "contexts":["editable"]}
];
var xsrfchild = [
    {"title": "Test for vulnerability", "id":"xsrf1", "contexts":["editable"]}
];     