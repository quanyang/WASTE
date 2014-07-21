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
    var scanStatus;
    var attackUrl;

    chrome.storage.sync.get("scanning", function(obj){
        scanStatus = obj.scanning.status;
        attackUrl = obj.scanning.url;
        //make sure the scan is on correct tab
        if (scanStatus && obj.scanning.tab == tabId) {


            //scan for signature

            //record results

            //revert back to initial page
            setTimeout(function() {
                location = attackUrl;
            },1000);
            //next payload
            if ( location == attackUrl ) {
                chrome.storage.sync.set({'scanning':{status:true,url:attackUrl,payload:obj.scanning.payload,tab:obj.scanning.tab,index:obj.scanning.index+1}});
                scan(obj.scanning.payload,attackUrl,obj.scanning.index);
            }
        }
    });
}


function scan(payload,url,index) {
    //$("input:not([type='submit']),textarea,option")
    //textarea, select(one time suffice)
    inputs = $("input:not([type='submit']");
    
    
    if( index < inputs.length ){
        //Payload versatility
        inputs[index].value = payload[3];

        inputs[index].style.outline = "none";
        inputs[index].style.border = "red 2px solid";
        inputs[index].style.boxShadow  = "0 0 10px red";
        HTMLFormElement.prototype.submit.call(inputs[index].form);
        
    } else {
        chrome.storage.sync.set({'scanning':{status:false,url:"",payload:"",tab:"",index:0}});
        alert("Scan Done!");
    }

}



//onmessage for start of attack
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if ( request.type == "start" ) {
            scan(request.payload,request.url,0);
        }

        //if (request.greeting == "hello") sendResponse({farewell: "goodbye"});
    });
