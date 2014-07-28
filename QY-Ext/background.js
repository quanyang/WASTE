
var settings = {
    "email":"abc@abc.com",
    "user":"anon",
    "matric":"a1231123"
}

chrome.runtime.onInstalled.addListener(function(details){
    chrome.storage.local.set({'scanning':{scanId:0,status:true,url:"",payload:"",payloadId:0,tab:0,index:0}});
    chrome.storage.local.set({'result':{id:0}});
    chrome.storage.local.set({
        'scanIndex':{
            scanIndex:0,
        }
    });
    chrome.storage.local.set({
        'resultStorage':{
            html:"",
        }
    });
    chrome.storage.local.set({
        'autofill':{
            settings:JSON.stringify(settings)
        }
    });

});

chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {
        if ( message.type == 'tabID' )
        {
            sendResponse({ tabID: sender.tab.id });
        }
        if (message.type == 'scanIndexc'){
            sendResponse({scanIndex: scanIndex});

        }
        if (message.type == 'openResult'){
            var index;
            var exist = false;
            for(index = 0; index< chrome.extension.getViews().length;index++){
                if (chrome.extension.getViews()[index].location.href.match(/.*result.html.*/)){
                    exist=true; 
                } 
            }
            if(!exist){
                chrome.tabs.create({'url': chrome.extension.getURL('result.html')},   
                                   function(tab) {
                                       // Tab opened.
                                       chrome.storage.local.set({'result':{id:tab.id}});
                                   });
            }
        }
        if(message.newWindow){
            chrome.tabs.create({"url" : message.newWindow[0]});  

        }
    }
);

