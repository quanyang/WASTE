var last_target = null;
document.addEventListener('mousedown', function(event){
  //possibility: check that the mouse button == 2
  last_target = event.target;
}, true);


chrome.extension.onMessage.addListener(function(event,sender,response){
  /* If this were a pattern for creating DOM-enabled context
     menu addons, here would be where your code goes*/
    console.log("TEST");
    
    last_target.value = event;
});