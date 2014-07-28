// A generic onclick callback function.
//function genericOnClick(info, tab) {
//    alert("item " + info.menuItemId + " was clicked");
//    alert("info: " + JSON.stringify(info));info: {"editable":true,"menuItemId":551,"pageUrl":"http://hugh.comp.nus.edu.sg/cs2107/demo1/grades.php?matric=a0111889w&method=1","parentMenuItemId":548}
//    alert("tab: " + JSON.stringify(tab));
//}
var payload = [
    ["sql1",["","';--"]],
    ["sql2",["' or '1' = '1"]]
];

/*
chrome.contextMenus.onClicked.addListener(function sqlOnClick(info,tab) {
    payload.forEach(function(payloads){
       if (info.menuItemId == payloads[0]) {
           chrome.tabs.sendMessage(tab.id,payloads[1]);
       } 
    });
});
*/
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
                if (chrome.extension.getViews()[index].location.href.match(/.*process.html.*/)){
                    exist=true; 
                } 
            }
            if(!exist){
                chrome.tabs.create({'url': chrome.extension.getURL('process.html')},   
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


// Create one test item for each context type.

//makes into array for easier editing in future.

/*
//var sql = chrome.contextMenus.create({"title": "SQL injection","id":"sql","contexts":["editable"]});
var xss = chrome.contextMenus.create({"title": "Cross-site Scripting","id":"xss","contexts":["editable"]});
var xsrf = chrome.contextMenus.create({"title": "Cross-site Request Forgery","id":"xsrf","contexts":["editable"]});

var sqlchild = [
    {"title": "Test for vulnerability", "id":"sql1", "parentId": sql, "contexts":["editable"]},
    {"title": "Login Field","id":"sql2", "parentId": sql, "contexts":["editable"]}
];
var xsschild = [
    {"title": "Test for vulnerability", "id":"xss1","parentId": xss, "contexts":["editable"]},
    {"title": "Insert Image", "id":"xss2","parentId": xss, "contexts":["editable"]},
    {"title": "Insert Script","id":"xss3", "parentId": xss, "contexts":["editable"]},
    {"title": "Insert Redirection","id":"xss4", "parentId": xss, "contexts":["editable"]}
];
var xsrfchild = [
    {"title": "Test for vulnerability", "id":"xsrf1","parentId": xsrf, "contexts":["editable"]}
];     
*/

/*
var sqlchilds = [];
sqlchild.forEach(function(entry){
//sqlchilds.push(chrome.contextMenus.create(entry));
});

var xsschilds = [];
xsschild.forEach(function(entry){
xsschilds.push(chrome.contextMenus.create(entry));
});

var xsrfchilds = [];
xsrfchild.forEach(function(entry){
xsrfchilds.push(chrome.contextMenus.create(entry));
});

*/
/*
// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": "Test parent item"});
var child1 = chrome.contextMenus.create(
  {"title": "Child 1", "parentId": parent, "onclick": genericOnClick});
var child2 = chrome.contextMenus.create(
  {"title": "Child 2", "parentId": parent, "onclick": genericOnClick});
console.log("parent:" + parent + " child1:" + child1 + " child2:" + child2);


// Create some radio items.
function radioOnClick(info, tab) {
  console.log("radio item " + info.menuItemId +
              " was clicked (previous checked state was "  +
              info.wasChecked + ")");
}
var radio1 = chrome.contextMenus.create({"title": "Radio 1", "type": "radio",
                                         "onclick":radioOnClick});
var radio2 = chrome.contextMenus.create({"title": "Radio 2", "type": "radio",
                                         "onclick":radioOnClick});
console.log("radio1:" + radio1 + " radio2:" + radio2);


// Create some checkbox items.
function checkboxOnClick(info, tab) {
  console.log(JSON.stringify(info));
  console.log("checkbox item " + info.menuItemId +
              " was clicked, state is now: " + info.checked +
              "(previous state was " + info.wasChecked + ")");

}
var checkbox1 = chrome.contextMenus.create(
  {"title": "Checkbox1", "type": "checkbox", "onclick":checkboxOnClick});
var checkbox2 = chrome.contextMenus.create(
  {"title": "Checkbox2", "type": "checkbox", "onclick":checkboxOnClick});
console.log("checkbox1:" + checkbox1 + " checkbox2:" + checkbox2);


// Intentionally create an invalid item, to show off error checking in the
// create callback.
console.log("About to try creating an invalid item - an error about " +
            "item 999 should show up");
chrome.contextMenus.create({"title": "Oops", "parentId":999}, function() {
  if (chrome.extension.lastError) {
    console.log("Got expected error: " + chrome.extension.lastError.message);
  }
});*/