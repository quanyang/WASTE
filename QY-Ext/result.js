
$(document).ready(function(){ 
    chrome.storage.local.get("resultStorage", function(res){
        if(res.resultStorage &&  res.resultStorage.html.length >0){
            $(".result").html(res.resultStorage.html); 
        }
    });

    $( ".clear" ).click(function() {
        chrome.storage.local.remove("resultStorage");
        location = "";

        chrome.storage.local.set({
            'scanIndex':{
                scanIndex:0,
            }
        });
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {


        if (request.result){
            console.log(request.result[0])
            if(request.result[7]==="done"){
                if(!$('.'+request.result[0]).length){
                    $('.result').children().children()
                    .end().append(
                        "<tr class='"+request.result[0]+"'><td>"+(request.result[0]+1)+"</td><td>"+request.result[1]+"</td><td>"+request.result[2]+"<td>"+"<td>"+request.result[6]+"</td></tr>"
                    );
                }
            } else {

                if ( $('.'+request.result[0]).length){
                    $('.result .'+request.result[0]+' .payload').children().children().end().append("<tr><td>"+request.result[3]+"</td><td>"+request.result[4]+"</td><td>"+request.result[5]+"</td></tr>");

                } else {
                    $('.result').children().children()
                    .end().append(
                        "<tr class='"+request.result[0]+"'><td>"+(request.result[0]+1)+"</td><td>"+request.result[1]+"</td><td>"+request.result[2]+"<td>"
                        +"<table cellspacing='0' cellpadding='4px' class='payload'><tr><th>Input Field</th><th>Payload</th><th>Signature</th></tr>"
                        +"<tr><td>"+ request.result[3] +"</td><td>"+request.result[4]+"</td><td>"+request.result[5]+"</td></tr>"
                        +"</table>"+
                        "</td><td>"+request.result[6]+"</td></tr>"
                    );
                }
            }


            chrome.storage.local.set({
                'resultStorage':{
                    html:$('.result').html().replace(/\s{2}/g, ''),
                }
            });


            sendResponse("done");
        }

    });