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


// Saves options to chrome.storage
function save_options() {
    var color = document.getElementById('color').value;
    var likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
        favoriteColor: color,
        likesColor: likesColor
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        favoriteColor: 'red',
        likesColor: true
    }, function(items) {
        document.getElementById('color').value = items.favoriteColor;
        document.getElementById('like').checked = items.likesColor;
    });
}
//document.addEventListener('DOMContentLoaded', restore_options);
//document.getElementById('save').addEventListener('click', save_options);