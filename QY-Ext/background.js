// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function genericOnClick(info, tab) {
  //    alert("item " + info.menuItemId + " was clicked");
  //    alert("info: " + JSON.stringify(info));info: {"editable":true,"menuItemId":551,"pageUrl":"http://hugh.comp.nus.edu.sg/cs2107/demo1/grades.php?matric=a0111889w&method=1","parentMenuItemId":548}
  //    alert("tab: " + JSON.stringify(tab));
}
var payload = [
    ["sql1","';--"],
    ["sql2","' or '1' = '1"]
];

function sqlOnClick(type,info,tab) {
    payload.forEach(function(payloads){
       if (type == payloads[0]) {
           chrome.tabs.sendRequest(tab.id,payloads[1]);
       } 
    });
}

// Create one test item for each context type.
var sql = chrome.contextMenus.create({"title": "SQL injection","contexts":["editable"]});
var xss = chrome.contextMenus.create({"title": "Cross-site Scripting","contexts":["editable"]});
var xsrf = chrome.contextMenus.create({"title": "Cross-site Request Forgery","contexts":["editable"]});

//makes into array for easier editing in future.
var sqlchild = [
    {"title": "Test for vulnerability", "parentId": sql, "onclick": function(info, tab){sqlOnClick("sql1",info,tab)},"contexts":["editable"]},
    {"title": "Login Field", "parentId": sql, "onclick": function(info, tab){sqlOnClick("sql2",info,tab)},"contexts":["editable"]}
];
var xsschild = [
    {"title": "Test for vulnerability", "parentId": xss, "onclick": genericOnClick,"contexts":["editable"]},
    {"title": "Insert Image", "parentId": xss, "onclick": genericOnClick,"contexts":["editable"]},
    {"title": "Insert Script", "parentId": xss, "onclick": genericOnClick,"contexts":["editable"]},
    {"title": "Insert Redirection", "parentId": xss, "onclick": genericOnClick,"contexts":["editable"]}
];
var xsrfchild = [
  {"title": "Test for vulnerability", "parentId": xsrf, "onclick": genericOnClick,"contexts":["editable"]}
];

var sqlchilds = [];
    sqlchild.forEach(function(entry){
        sqlchilds.push(chrome.contextMenus.create(entry));
    });

var xsschilds = [];
    xsschild.forEach(function(entry){
        xsschilds.push(chrome.contextMenus.create(entry));
    });

var xsrfchilds = [];
    xsrfchild.forEach(function(entry){
        xsrfchilds.push(chrome.contextMenus.create(entry));
    });
   
    


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