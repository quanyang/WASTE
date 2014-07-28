$(document).ready(function(){ 
    $( "#tabs" ).tabs(); 
    $("input[type='button']").button();

    chrome.storage.local.get("autofill",function(obj){
        var setting = JSON.parse(obj.autofill.settings);
        $.each(setting,function(key,value){
            set(key,value);
        });
    });

});

$(document).on("click",".addNew",function(event) {
    if($('.addname').val()!="" && $('.addvalue').val()!=""){
        set($('.addname').val(),$('.addvalue').val());
        chrome.storage.local.set({
            'autofill':{
                settings:JSON.stringify(settingsz)
            }
        });
        $('.addvalue').val("");
        $('.addname').val("")
    }
});

$(document).on("input",".value",function(event) {
    settingsz[event.currentTarget.id] = event.currentTarget.value;
    chrome.storage.local.set({
        'autofill':{
            settings:JSON.stringify(settingsz)
        }
    });
});

$(document).on("click",".remove",function(event) {

    delete settingsz[event.currentTarget.id];
    $("#"+event.currentTarget.id).parent().parent().remove();
    chrome.storage.local.set({
        'autofill':{
            settings:JSON.stringify(settingsz)
        }
    });
});

var settingsz = {};
function set(key,value){
    settingsz[key] = value;
    $('.autofill').children().children().end()
    .append("<tr><td>"+key+"</td><td><input type='text' name='value' class='value' id='"+key+"' value='"+value+"'></td><td><input type='button' href='#' class='remove' id='"+key+"' value='Delete'>");

    $("input[type='button']").button();

}
