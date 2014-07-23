chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.result){
            console.log("LOG");
            if ( $('.'+request.result[0]).length){
                $('.result .'+request.result[0]+' .payload').children().end().append("<tr><td>"+request.result[3]+"</td></tr>");

                $('.result .'+request.result[0]+' .sign').children().end().append("<tr><td>"+request.result[4]+"</td></tr>");
            } else {
                $('.result').children().children()
                .end().append(
                    "<tr class='"+request.result[0]+"'><td>"+(no++)+"</td><td>"+request.result[1]+"</td><td>"+request.result[2]+"<td>"
                    +"<table class='payload'><tr><td>"+request.result[3]+"</td></tr></table>"+
                    "</td><td>"
                    +"<table class='sign'><tr><td>"+request.result[4]+"</td></tr></table>"+
                    "</td><td>"+request.result[5]+"</td></tr>"
                );
            }
        }

    });
var no = 1;