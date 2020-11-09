var IS_READY=false;
var PROJECT_INITIALIZE = false;

if(isMobile()){
    document.addEventListener("deviceready", function(){
        PROJECT_INITIALIZE = true;
    }, false);
}else{
    PROJECT_INITIALIZE = true;
}

var PROJECT_INTERVAL = setInterval(function(){
    if(PROJECT_INITIALIZE)
    {
        IS_READY=true;
        initialize.ini();
        clearInterval(PROJECT_INTERVAL);
    }
},100);

Main.checkIntervalInternet(function(){
    Main.select("#noInternetConnection").hide();
    if($$("#BackgroundTop .title .InternetNotConnection").length && $$("#BackgroundTop .title .InternetNotConnection").css('display') !== 'none' && app.panel){
        Main.backgroundTopHide();
    }
},function(){
    Main.select("#noInternetConnection").show();
});

/*
var PROJECT_INTERVAL = setInterval(function(){
    if(PROJECT_INITIALIZE)
    {
        IS_READY=true;
        initialize.ini();
        clearInterval(PROJECT_INTERVAL);
    }
},100);

window.setTimeout(function() {
    if(!IS_READY)
    {
        var e = document.createEvent('Events');
        e.initEvent("deviceready", true, false);
        window["device"]       =   new Object();
        if(typeof navigator !=='undefined')
        {
            window["device"]    =   navigator;
        } 
        window["device"].name   =   'PC';
        document.dispatchEvent(e);
    }
}, 700);

document.addEventListener("deviceready", function(){
    PROJECT_INITIALIZE = true;
}, false);

Main.checkIntervalInternet(function(){
    Main.select("#noInternetConnection").hide();
    if($$("#BackgroundTop .title .InternetNotConnection").length && $$("#BackgroundTop .title .InternetNotConnection").css('display') !== 'none' && app.panel){
        Main.backgroundTopHide();
    }
},function(){
    Main.select("#noInternetConnection").show();
});*/