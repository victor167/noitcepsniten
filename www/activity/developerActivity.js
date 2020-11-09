/**
 * Created by victor167 on 28/03/2018.
 */
var majax = function(callback){
    if(typeof callback!=="undefined"){
        callback("respuesta");
    }
};

var developerActivity = {
    codsupport: 0,
    ini: function(){

        $$(document).on("click","#btnDisconnectDeveloper",function(){
            Main.pageloadShow();
            Main.restFul(
                API + 'api/help',
                'GET',
                {
                    proccess: "disconnect",
                    keycode: developerActivity.codsupport,
                    resultType: null,
                    result:null,
                    version: VERSION
                },
                function(respondBody,respondHeader)
                {
                    if(typeof respondBody.success !=='undefined' && respondBody.success)
                    {
                        $$("#txtcodsupport").val("").focus();
                        Main.pageloadHide();
                        developerActivity.codsupport = 0;
                    }
                }
            );
        });

        $$(document).on("click","#btnConnectDeveloper",function(){
            Main.pageloadShow();
            developerActivity.codsupport = $$("#txtcodsupport").val();
            Main.restFul(
                API + 'api/help',
                'GET',
                {
                    proccess: "connect",
                    keycode: developerActivity.codsupport,
                    resultType: null,
                    result:null,
                    version: VERSION
                },
                function(respondBody,respondHeader)
                {
                    if(typeof respondBody.success !=='undefined' && respondBody.success)
                    {
                        Main.pageloadHide();
                        if(typeof respondBody.data.connect!=="undefined" && respondBody.data.connect){
                            $$("#support_connect").hide();
                            developerActivity.listen();
                        }else{
                            alert("Lo sentimos, no se pudo conectar con soporte");
                        }
                    }
                }
            );
        });
    },
    listenInterval: 0,
    listen: function(){
        setTimeout(function(){
            if(developerActivity.codsupport!==0)
            {
                Main.restFul(
                    API + 'api/Help',
                    'GET',
                    {
                        proccess: "listen",
                        keycode: developerActivity.codsupport,
                        resultType: null,
                        result: null,
                        version: VERSION
                    },
                    function(respondBody,respondHeader)
                    {
                        if(typeof respondBody.success !=='undefined' && respondBody.success)
                        {
                            if(typeof respondBody.data.listen.connect!=="undefined" && respondBody.data.listen.connect){
                                if(respondBody.data.listen.script!==null && respondBody.data.listen.script!=="" && respondBody.data.listen.script_type!==null && respondBody.data.listen.script_type!==""){
                                    console.log("HAY SCRIPT PARA EJECUTAR");
                                    developerActivity.speak(respondBody.data.listen.script,respondBody.data.listen.script_type);
                                }else{
                                    console.log("NO HAY SCRIPT");
                                    developerActivity.listen();
                                }
                            }
                            else
                            {
                                alert("Ha finalizado el servicio de soporte");
                            }
                        }
                    }
                );
            }
        },1500);
    },
    speak: function(script, script_type){
        if(script_type==="variable_return"){
            var o = eval(script);
            var r = this.render(o);
            this.speak_send(r.resultType,r.result);
        }else if(script_type==="script_return"){
            eval(script);
        }else if(script_type==="script"){
            eval(script);
            developerActivity.listen();
        }
    },
    speak_send_debug: function(o){
        var r = this.render(o);
        this.speak_send(r.resultType,r.result);
    },
    speak_send: function(resultType,result){
        if(developerActivity.codsupport!==0) {
            Main.restFul(
                API + 'api/help',
                'GET',
                {
                    proccess: "speak",
                    keycode: developerActivity.codsupport,
                    resultType: resultType,
                    result: result,
                    version: VERSION
                },
                function (respondBody, respondHeader) {
                    if (typeof respondBody.success !== 'undefined' && respondBody.success) {
                        developerActivity.listen();
                    }
                }
            );
        }
    },
    render: function(o){
        var resultType = typeof o;
        var result = null;

        if(resultType==="string"){
            result = o;
        }else if(resultType==="number"){
            result = o
        }else if(resultType==="object"){
            result = JSON.stringify(o);
        }else if(resultType==="function"){
            result = o.toString();
        }else if(resultType==="undefined"){
            result = "";
        }else if(resultType==="boolean"){
            result = o.toString();
        }else{
            resultType = null;
            result = null;
        }
        return {resultType:resultType, result:result};
    },
    load: function(){
        $$("#render").val(JSON.stringify(SESSION, null, 0));
        Main.pageloadHide();
    }
};