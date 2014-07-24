chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {


        if (request.result){
            if(request.result[7]==="done"){
                if(!$('.'+request.result[0]).length){
                    $('.result').children().children()
                    .end().append(
                        "<tr class='"+request.result[0]+"'><td>"+(no++)+"</td><td>"+request.result[1]+"</td><td>"+request.result[2]+"<td>"
                        +"<table cellspacing='0' cellpadding='4px' class='payload'><tr><th>Input Field</th><th>Payload</th><th>Signature</th></tr>"
                        +"<tr><td>"+ request.result[3] +"</td><td>"+request.result[4]+"</td><td>"+request.result[5]+"</td></tr>"
                        +"</table>"+
                        "</td><td>"+request.result[6]+"</td></tr>"
                    );
                }
            } else {

                console.log(request);
                if ( $('.'+request.result[0]).length){
                    $('.result .'+request.result[0]+' .payload').children().children().end().append("<tr><td>"+request.result[3]+"</td><td>"+request.result[4]+"</td><td>"+request.result[5]+"</td></tr>");

                } else {
                    $('.result').children().children()
                    .end().append(
                        "<tr class='"+request.result[0]+"'><td>"+(no++)+"</td><td>"+request.result[1]+"</td><td>"+request.result[2]+"<td>"
                        +"<table cellspacing='0' cellpadding='4px' class='payload'><tr><th>Input Field</th><th>Payload</th><th>Signature</th></tr>"
                        +"<tr><td>"+ request.result[3] +"</td><td>"+request.result[4]+"</td><td>"+request.result[5]+"</td></tr>"
                        +"</table>"+
                        "</td><td>"+request.result[6]+"</td></tr>"
                    );
                }
            }
            sendResponse("done");
        }

    });
var no = 1;