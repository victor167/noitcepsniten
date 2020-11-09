window.alert = function (txt,callback){
    myApp.alert(txt,callback);
};

function isIOS() {
    return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
}
/*
function onResume(){
    window.plugin.backgroundMode.disable();
}

function onPause(){
    window.plugin.backgroundMode.enable();
}
*/
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; return re.test(email);
}

function rand_code(lon){
    chars = "0123456789abcdefABCDEF";code = "";
    for (x=0; x < lon; x++){
        rand = Math.floor(Math.random()*chars.length);
        code += chars.substr(rand, 1);
    } 
    return code;
}

window.onerror = function(msg, url, line, col, error) {
    console.log("==========================");
    console.log("MSG: " , msg);
    console.log("URL: " , url);
    console.log("LINE: " , line);
    console.log("COL: " , col);
    console.log("ERROR: " , error);
    console.log("==========================");
};
function isMobile()
{
    return !!window.cordova;
}

$$(document).on('pageInit', function(e) {
    var page = e.detail.page;
    $$(page.container).find("script").each(function(el){
        eval($$(this).text());
    });
});

var logoName = document.getElementById('backgroundLogoName');
logoName.innerHTML = AppName;

var statusError401          =   false;

