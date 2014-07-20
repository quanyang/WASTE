var last_target = null;
document.addEventListener('mousedown', function(event){
    //possibility: check that the mouse button == 2
    last_target = event.target;
}, true);


var inputs, index;
function scan(payload) {
    inputs = document.getElementsByTagName('input');

    for (index = 0; index < inputs.length; ++index) {
        //    console.log(inputs[index]);
    }
}



//onmessage for start of attack
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        //  console.log(request.payload);
        if ( request.type == "start" ) {
            scan(request.payload);
        }

        //if (request.greeting == "hello") sendResponse({farewell: "goodbye"});
    });


var inputObject;

//scan page for inputs
