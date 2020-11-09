////////////////////////////////////////////////////////////////////////
var key_inspuser 		= "";
var id_insp 			= 0;
var id_inspsurv 		= 0;
var id_inspsurvques 	= 0;
var id_inspuser 		= 0;
var id_inspusersurvques = 0;
var tx_inspection_title = '';
var tx_inspsurv_title 	= '';
var captain_name 		= '';
var ship_name 			= '';
var applyoptiontext		= '';
////////////////////////////////////////////////////////////////////////
var Buffer = {
    list_inspection_create:function(callback){
        DB.query('SELECT id_inspuser, key_inspuser, id_inspection, id_ship, id_captain, id_branch, tx_ship, tx_captain, start, state FROM BufferInspectionCreate;',function(trans,result){
            callback(result.rows);
        });
    },
    ins_inspection_create: function(_id_inspection,_id_ship,_id_captain,_id_branch,_tx_inspection_name,_tx_ship,_tx_captain,callback){
        _id_inspection				= parseInt(_id_inspection);
        var start 					= moment().format("YYYY/MM/DD HH:mm:ss");
        var _key_inspuser 			= rand_code(10);
        key_inspuser 				= _key_inspuser;
        id_inspuser 				= 0;

        var d = {
            id_inspuser: 0,
            key_inspuser: _key_inspuser,
            id_inspection: _id_inspection,
            id_ship: _id_ship,
            id_captain: _id_captain,
            id_branch: _id_branch,
            tx_ship: _tx_ship,
            tx_captain: _tx_captain,
            start: start,
            state: 0
        };
        DB.query('INSERT INTO BufferInspectionCreate(id_inspuser, key_inspuser, id_inspection, id_ship, id_captain, id_branch, tx_ship, tx_captain, start, state) VALUES('+d.id_inspuser+', "'+d.key_inspuser+'", '+d.id_inspection+', '+d.id_ship+', '+d.id_captain+', '+d.id_branch+', "'+d.tx_ship+'", "'+d.tx_captain+'", "'+d.start+'", '+d.state+');',function(trans,result){
            BufferToSync.ins_inspection_create(d,callback);
            Buffer.check();
        });
    },
    del_inspection_create: function(_key_inspuser,_id_inspuser,callback){
        DB.query('DELETE FROM BufferInspectionCreate WHERE key_inspuser="' + _key_inspuser + '"',function(){
            callback(_key_inspuser,_id_inspuser);
        });
    },
    list_inspection_send:function(callback){
        DB.query('SELECT id_inspuser, key_inspuser, id_inspection, resp_id_persons, resp_emails, end, state, send FROM BufferInspectionSend;',function(trans,result){
            callback(result.rows);
        });
    },
    ins_inspection_send: function(_id_inspuser,_key_inspuser,_id_inspection,_resp_id_persons,_resp_emails,callback){
        var today 	=	new Date();
        var yyyy 	= 	today.getFullYear();
        var mm 		= 	today.getMonth()+1;
        var dd 		= 	today.getDate();
        var h 		= 	today.getHours();
        var m 		= 	today.getMinutes();
        var s 		= 	today.getSeconds();

        if(dd<10) 	dd	='0'+dd;
        if(mm<10) 	mm	='0'+mm;
        if(h<10) 	h	='0'+h;
        if(m<10) 	m	='0'+m;
        if(s<10)	s	='0'+s;

        var date_end = yyyy +'/' + mm + '/' + dd + ' ' + h + ':' + m + ':' + s;

        var d = {
            id_inspuser: _id_inspuser,
            key_inspuser: _key_inspuser,
            id_inspection: _id_inspection,
            resp_id_persons: _resp_id_persons,
            resp_emails: _resp_emails,
            end: date_end,
            state: 2,
            send: 0
        };
        DB.query('INSERT INTO BufferInspectionSend(id_inspuser, key_inspuser, id_inspection, resp_id_persons, resp_emails, end, state, send) VALUES('+d.id_inspuser+', "'+d.key_inspuser+'", '+d.id_inspection+', "'+d.resp_id_persons+'", "'+d.resp_emails+'", "'+d.end+'", '+d.state+', '+d.send+');',function(trans,result){
            BufferToSync.ins_inspection_send(d,callback);
            Buffer.check();
        });
    },
    ins_inspection_send_resume: function(_id_inspuser,_key_inspuser,_id_inspection,_resp_id_persons,_resp_emails,callback){
        var d = {
            id_inspuser: _id_inspuser,
            key_inspuser: _key_inspuser,
            id_inspection: _id_inspection,
            resp_id_persons: _resp_id_persons,
            resp_emails: _resp_emails,
            end: null,
            state: 0,
            send: 0
        };
        DB.query('INSERT INTO BufferInspectionSend(id_inspuser, key_inspuser, id_inspection, resp_id_persons, resp_emails, end, state, send) VALUES('+d.id_inspuser+', "'+d.key_inspuser+'", '+d.id_inspection+', "'+d.resp_id_persons+'", "'+d.resp_emails+'", "'+d.end+'", '+d.state+', '+d.send+');',function(trans,result){
            BufferToSync.ins_inspection_send(d,callback);
            Buffer.check();
        });
    },
    ins_inspection_send_cancel: function(_id_inspuser,_key_inspuser,_id_inspection,callback){
        var d = {
            id_inspuser: _id_inspuser,
            key_inspuser: _key_inspuser,
            id_inspection: _id_inspection,
            resp_id_persons: "",
            resp_emails: "",
            end:null,
            state: 4,
            send: 0
        };
        DB.query('INSERT INTO BufferInspectionSend(id_inspuser, key_inspuser, id_inspection, resp_id_persons, resp_emails, end, state, send) VALUES('+d.id_inspuser+', "'+d.key_inspuser+'", '+d.id_inspection+', "'+d.resp_id_persons+'", "'+d.resp_emails+'", "'+d.end+'", '+d.state+', '+d.send+');',function(trans,result){
            BufferToSync.ins_inspection_send(d,callback);
            Buffer.check();
        });
    },
    list_question_option:function(callback){
        DB.query('SELECT id_inspuser,key_inspuser,id_inspsurvques,nu_apply,nu_option,latitud,longitud,send FROM BufferQuestionOption;',function(trans,result){
            callback(result.rows);
        });
    },
    ins_question_option: function(_id_inspuser,_key_inspuser,_id_inspsurvques, _apply_option, _latitud, _longitud,callback){
        var _apply = 0;
        var _option = 0;
        if(_apply_option===11){ _apply = 1;_option = 1;}
        else if(_apply_option===12){_apply = 1;_option = 2;}
        else if(_apply_option===20){_apply = 2;_option = 0;}

        var d = {
            id_inspuser: _id_inspuser,
            key_inspuser: _key_inspuser,
            id_inspsurvques: _id_inspsurvques,
            nu_apply: _apply,
            nu_option: _option,
            latitud: _latitud,
            longitud: _longitud,
            send: 0
        };
        DB.query('INSERT INTO BufferQuestionOption(id_inspuser,key_inspuser,id_inspsurvques,nu_apply,nu_option,latitud,longitud,send) VALUES('+d.id_inspuser+',"'+d.key_inspuser+'",'+d.id_inspsurvques+','+d.nu_apply+','+d.nu_option+',"'+d.latitud+'","'+d.longitud+'",'+d.send+');',function(trans,result){
            BufferToSync.ins_question_option(d,callback);
            Buffer.check();
        });
    },
    list_question_photo:function(callback){
        DB.query('SELECT id_inspuser,key_inspuser,id_inspsurvques,file,key_image,file_name,file_size,send FROM BufferQuestionPhoto;',function(trans,result){
            callback(result.rows);
        });
    },
    get_list_question_photo:function(_id_inspuser,_key_inspuser,_id_inspsurvques,callback){
        DB.query('SELECT id_inspuser,key_inspuser,id_inspsurvques,file,key_image,file_name,file_size,send FROM BufferQuestionPhoto WHERE (id_inspuser=0 AND key_inspuser="'+_key_inspuser+'" AND id_inspsurvques='+_id_inspsurvques+') OR (id_inspuser!=0 AND id_inspuser='+_id_inspuser+' AND id_inspsurvques='+_id_inspsurvques+');',function(trans,result){
            callback(result.rows);
        });
    },
    ins_question_photo: function(_id_inspuser,_key_inspuser,_id_inspsurvques,_file,_key_image,_file_name,_file_size,callback){
        var d = {
            id_inspuser: _id_inspuser,
            key_inspuser: _key_inspuser,
            id_inspsurvques: _id_inspsurvques,
            file: _file,
            key_image: _key_image,
            file_name: _file_name,
            file_size: _file_size,
            send: 0
        };

        var sql_img = 'INSERT INTO BufferQuestionPhoto(id_inspuser,key_inspuser,id_inspsurvques,file,key_image,file_name,file_size,send) VALUES('+d.id_inspuser+',"'+d.key_inspuser+'",'+d.id_inspsurvques+',"'+d.file+'","'+d.key_image+'","'+d.file_name+'","'+d.file_size+'",'+d.send+');';

        DB.query([sql_img],function(trans,result){
            BufferToSync.ins_question_photo(d,callback);
            Buffer.check();
        });
    },
    list_question_observation:function(callback){
        DB.query('SELECT id_inspuser,key_inspuser,id_inspsurvques,observation,send FROM BufferQuestionObservation;',function(trans,result){
            callback(result.rows);
        });
    },
    ins_question_observation: function(_id_inspuser,_key_inspuser,_id_inspsurvques,_observation,callback){
        var d = {
            id_inspuser: _id_inspuser,
            key_inspuser: _key_inspuser,
            id_inspsurvques: _id_inspsurvques,
            observation: _observation,
            send: 0
        };
        DB.query('INSERT INTO BufferQuestionObservation(id_inspuser,key_inspuser,id_inspsurvques,observation,send) VALUES('+d.id_inspuser+',"'+d.key_inspuser+'",'+d.id_inspsurvques+',"'+d.observation+'",'+d.send+');',function(trans,result){
            BufferToSync.ins_question_observation(d,callback);
            Buffer.check();
        });
    },
    set_inspection_id: function(_key_inspuser,_id_inspuser,callback){
        DB.query('UPDATE BufferQuestionOption SET id_inspuser='+_id_inspuser+' WHERE key_inspuser="' + _key_inspuser + '";',function(trans,result){
            DB.query('UPDATE BufferQuestionObservation SET id_inspuser='+_id_inspuser+' WHERE key_inspuser="' + _key_inspuser + '";',function(trans,result){
                DB.query('UPDATE BufferQuestionPhoto SET id_inspuser='+_id_inspuser+'  WHERE key_inspuser="' + _key_inspuser + '";',function(trans,result){
                    DB.query('UPDATE BufferInspectionSend SET id_inspuser='+_id_inspuser+' WHERE key_inspuser="' + _key_inspuser + '";',function(trans,result){
                        console.log("COLADO");
                        callback();
                    });
                });
            });
        });
    },
    count: function(callback){
        DB.query("select ((select count(*) from BufferInspectionCreate) + (select count(*) from BufferInspectionSend) + (select count(*) from BufferQuestionOption) + (select count(*) from BufferQuestionPhoto) + (select count(*) from BufferQuestionObservation)) count;",function(o,data){
            callback(data.rows.item(0).count);
        });
    },
    check: function(){
        Buffer.count(function(count){
            if(count>0){
                system.checkPendingChange = true;
            }else{
                system.checkPendingChange = false;
            }
        });
    }
};
////////////////////////////////////////////////////////////////////////
var BufferToSync	=	{
    ins_inspection_create: function(d,callback){
        SyncData.inspection(d.id_inspection,function(data){
            var data_create_inspection = [];
            console.log("data",data);
            for(var i=0;i<data.length;i++){
                data_create_inspection[i] = {};
                data_create_inspection[i].bo_inspuser_state = 1;
                data_create_inspection[i].ship_name = d.tx_ship;
                data_create_inspection[i].captain_name = d.tx_captain;
                data_create_inspection[i].tx_inspection_title = data[i].tx_inspection_title;
                data_create_inspection[i].id_inspusersurv = 0;
                data_create_inspection[i].id_inspuser = 0;
                data_create_inspection[i].id_inspsurv = data[i].id_inspsurv;
                data_create_inspection[i].tx_inspsurv_title = data[i].tx_inspsurv_title;
                data_create_inspection[i].id_inspsurvques = data[i].id_inspsurvques;
                data_create_inspection[i].id_inspsurvques_fk = data[i].id_inspsurvques_fk;
                data_create_inspection[i].id_inspusersurvques = 0;
                data_create_inspection[i].id_inspusersurvques_fk = 0;
                data_create_inspection[i].id_mastertable_questype = data[i].id_mastertable_questype;
                data_create_inspection[i].tx_inpsurvques_decription = data[i].tx_inpsurvques_decription;
                data_create_inspection[i].tx_inpsurvques_comment = data[i].tx_inpsurvques_comment;
                data_create_inspection[i].nu_inspsurvques_order = data[i].nu_inspsurvques_order;
                data_create_inspection[i].nu_inspsurvques_weight = data[i].nu_inspsurvques_weight;
                data_create_inspection[i].nu_inspsurvques_level = data[i].nu_inspsurvques_level;
                data_create_inspection[i].nu_inspsurvques_son = data[i].nu_inspsurvques_son;
                data_create_inspection[i].bo_inspusersurvques_apply = 0;
                data_create_inspection[i].bo_inspusersurvques_answer_option = 0;
                data_create_inspection[i].tx_inspusersurvques_answer_observation = "";
                data_create_inspection[i].nu_inspusersurvques_score = 0;
                data_create_inspection[i].nu_inspusersurvques_countfile = 0;
                data_create_inspection[i].tx_inspusersurvques_latitud = "";
                data_create_inspection[i].tx_inspusersurvques_longitud = "";
                data_create_inspection[i].nu_inspsurv_countques = data[i].nu_inspsurv_countques;
                data_create_inspection[i].nu_inspsurv_countquesrespon = 0;
                data_create_inspection[i].key_inspuser = d.key_inspuser;
                data_create_inspection[i].dt_inspuser_start = d.start;
                data_create_inspection[i].dt_inspuser_end = null;
            }
            SyncData.listInspectionUser(data_create_inspection,false);
            inspectorActivity.listInspectionsUser();
            callback();
        });
    },
    ins_inspection_send: function(d,callback){
        callback();
    },
    ins_question_option: function(d,callback){
        callback();
    },
    ins_question_photo: function(d,callback){
        callback();
    },
    ins_question_observation: function(d,callback){
        callback();
    }
};
////////////////////////////////////////////////////////////////////////
var BufferToCloud	=	{
    check: function(){
        //ESTA FUNCION REEMPLAZARA: Offline.SYNC();
        setInterval(BufferToCloud.render,5000);
    },
    isRender: false,
    render:function(){
        //console.log("RENDER");
        Main.internet(function(){
            if(!pauseUploadChange){
                if(!BufferToCloud.isRender){
                    console.log("RENDER: ON");
                    BufferToCloud.isRender = true;
                    BufferToCloud.uploadCloudRecursive();
                }
            }else{
                console.log("RENDER_NOT: PAUSE");
            }
        },function(){
            BufferToCloud.isRender  =   false;
            console.log("RENDER_NOT: OFFLINE");
        });
    },
    uploadCloudRecursive: function(){
        BufferToCloud.ins_inspection_create(function(){
            BufferToCloud.ins_question_option(function(){
                BufferToCloud.ins_question_observation(function(){
                    BufferToCloud.ins_question_photo(function(){
                        BufferToCloud.ins_inspection_send(function(){
                            BufferToCloud.isRender = false;
                            Buffer.check();
                        });
                    });
                });
            });
        });
    },
    ins_inspection_create:function(callback){
        Main.internet(function(){
            Buffer.list_inspection_create(function(d){
                d = DB.toArray(d,true,['id_branch','id_captain','id_inspection','id_inspuser','id_ship','key_inspuser','start','tx_captain','tx_ship']);

                if(d.length>0){
                    console.log("ins_inspection_create",d);
                    Main.restFul(
                        API + 'api/Sync',
                        'GET',
                        {
                            type: "inspection_create",
                            json: JSON.stringify(d),
                            version: VERSION
                        },
                        function(respondBody,respondHeader)
                        {
                            if(typeof respondBody.success !=='undefined' && respondBody.success){
                                if(respondBody.data.length>0){
                                    for (var e = 0; e < respondBody.data.length; e++) {
                                        if(key_inspuser===respondBody.data[e].key_inspuser){
                                            id_inspuser = respondBody.data[e].id_inspuser;
                                        }

                                        DB.query('UPDATE SyncDataInspectionUser SET id_inspuser = ' + respondBody.data[e].id_inspuser + ' WHERE key_inspuser="' + respondBody.data[e].key_inspuser + '"');

                                        Buffer.del_inspection_create(respondBody.data[e].key_inspuser,respondBody.data[e].id_inspuser,function(_key_inspuser,_id_inspuser){
                                            Buffer.set_inspection_id(_key_inspuser,_id_inspuser,function(){
                                                BufferToCloud.uploadCloudRecursive();
                                            });
                                        });
                                    }
                                }else{
                                    BufferToCloud.uploadCloudRecursive();
                                }
                            }else{
                                util.timeout(BufferToCloud.uploadCloudRecursive,5000);
                            }
                        }
                    );
                }else{
                    callback();
                }
            });

        },function(){
            BufferToCloud.uploadCloudRecursive();
            console.log('SIN INTERNET...ins_inspection_create');
        });
    },
    ins_question_option:function(callback){
        Main.internet(function() {
            Buffer.list_question_option(function (d) {
                d = DB.toArray(d, true,["id_inspuser","key_inspuser","id_inspsurvques","nu_apply","nu_option","latitud","longitud"]);
                if (d.length > 0) {
                    //console.log("ins_question_option", d);
                    DB.query('UPDATE BufferQuestionOption SET send = 1', function () {
                        Main.restFul(
                            API + 'api/Sync',
                            'GET',
                            {
                                type: "question_update",
                                json: JSON.stringify(d),
                                version: VERSION
                            },
                            function (respondBody, respondHeader) {
                                if (typeof respondBody.success !== 'undefined' && respondBody.success) {
                                    //ELIMINAR LAS PREGUNTAS APLICADAS
                                    //RECUPERAR LOS REGISTROS CON RESPUESTA 1 o 0
                                    if (parseInt(respondBody.data.result)) {
                                        DB.query('DELETE FROM BufferQuestionOption WHERE send=1', function () {
                                            BufferToCloud.uploadCloudRecursive();
                                        });

                                    } else {
                                        BufferToCloud.uploadCloudRecursive();
                                    }
                                } else {
                                    util.timeout(BufferToCloud.uploadCloudRecursive,5000);
                                }
                            }
                        );
                    });
                } else {
                    callback();
                }




            });
        },function(){
            BufferToCloud.uploadCloudRecursive();
            console.log('SIN INTERNET...ins_question_option');
        });
    },
    ins_question_observation: function(callback){
        Main.internet(function() {
            Buffer.list_question_observation(function (d) {
                d = DB.toArray(d, true,["id_inspuser","key_inspuser","id_inspsurvques","observation"]);
                if (d.length > 0) {
                    console.log("ins_question_observation", d);
                    DB.query('UPDATE BufferQuestionObservation SET send = 1', function (data) {

                            Main.restFul(
                                API + 'api/Sync',
                                'GET',
                                {
                                    type: "question_observation",
                                    json: JSON.stringify(d),
                                    version: VERSION
                                },
                                function(respondBody,respondHeader)
                                {
                                    if(typeof respondBody.success !=='undefined' && respondBody.success){
                                        if (parseInt(respondBody.data.result)) {
                                            DB.query('DELETE FROM BufferQuestionObservation WHERE send=1', function () {
                                                BufferToCloud.uploadCloudRecursive();
                                            });
                                        } else {
                                            BufferToCloud.uploadCloudRecursive();
                                        }
                                    }else{
                                        util.timeout(BufferToCloud.uploadCloudRecursive,5000);
                                    }
                                }
                            );
                    });
                }else{
                    callback();
                }
            });
        },function(){
            BufferToCloud.uploadCloudRecursive();
            console.log('SIN INTERNET...ins_question_observation');
        });
    },
    ins_question_photo: function(callback){
        Main.internet(function() {
            Buffer.list_question_photo(function(_d){
                d = DB.toArray(_d,true,["id_inspuser","key_inspuser","id_inspsurvques","key_image","file_name","file_size"]);
                imgs = DB.toArray(_d,true);
                if (d.length > 0) {
                    console.log("ins_question_photo",d);
                    DB.query('UPDATE BufferQuestionPhoto SET send = 1', function (data) {

                            Main.restFul(
                                API + 'api/Sync',
                                'GET',
                                {
                                    type: "question_file",
                                    json: JSON.stringify(d),
                                    version: VERSION
                                },
                                function(respondBody,respondHeader)
                                {
                                    if(typeof respondBody.success !=='undefined' && respondBody.success){
                                        var countupload = respondBody.data.listFileSync.length;

                                        var upload = function() {
                                            if(respondBody.data.listFileSync.length){
                                                var exist = false;
                                                for(var k = 0; k < d.length; k++) {
                                                    if(!exist && respondBody.data.listFileSync[0].key_image===d[k].key_image){
                                                        exist = true;
                                                        var file_name = respondBody.data.listFileSync[0].file_name;

                                                        fotoComentInspeccionActivity.photoUpload(file_name, imgs[k],respondBody.data.listFileSync[0],{
                                                            progress: function(percentage,_img){
                                                                console.log("progress");
                                                                var x = percentage*90/100;
                                                                var y = x*2;
                                                                $$('.foto[data-key="' + _img.key_image + '"] .photoscreen').css("top", "-" + x + "px").css("line-height", (120 + y) + "px");
                                                            },
                                                            success: function(data,_img,_file_name,_listFileSync){
                                                                console.log("success");
                                                                $$('.foto[data-key="' + respondBody.data.listFileSync[0].key_image + '"] .photoscreen').hide();

                                                                SyncData.listImagesFileQuestion([{
                                                                    id_inspuser: _listFileSync.id_inspuser,
                                                                    id_inspusersurvques: _listFileSync.id_inspusersurvques,
                                                                    id_inspusersurvquesfile: _listFileSync.id_inspusersurvquesfile,
                                                                    inspusersurvquesfile_name: _file_name,
                                                                    inspusersurvquesfile_url: _file_name
                                                                }],false);

                                                                fotoComentInspeccionActivity.setPhotoMemory(_listFileSync.id_inspusersurvquesfile,_img.file);

                                                                DB.query('DELETE FROM BufferQuestionPhoto where key_image="'+_listFileSync.key_image+'"; ',function(){
                                                                    console.log("IMAGEN LISTA:" + _listFileSync.key_image);
                                                                    countupload--;
                                                                    if(countupload===0){
                                                                        BufferToCloud.uploadCloudRecursive();
                                                                    }else{
                                                                        upload();
                                                                    }
                                                                });
                                                            },
                                                            error: function(err){
                                                                console.log("error");
                                                                console.log("UPLOAD: " + err);
                                                                upload();
                                                            }
                                                        });

                                                    }
                                                }
                                            }
                                        };
                                        upload();

                                    }else{
                                        util.timeout(BufferToCloud.uploadCloudRecursive,5000);
                                    }
                                }
                            );

                    });
                }else{
                    callback();
                }
            });
        },function(){
            BufferToCloud.uploadCloudRecursive();
            console.log('SIN INTERNET...ins_question_photo');
        });


    },
    ins_inspection_send:function(callback){
        Main.internet(function() {
            Buffer.list_inspection_send(function (d) {
                d = DB.toArray(d, true);
                if(d.length>0){
                    //console.log("ins_inspection_send", d);
                    Main.restFul(
                        API + 'api/Sync',
                        'GET',
                        {
                            type: "inspection_send",
                            json: JSON.stringify(d),
                            version: VERSION
                        },
                        function(respondBody,respondHeader)
                        {
                            if(typeof respondBody.success !=='undefined' && respondBody.success){

                                if(respondBody.data.result.length>0){

                                    Buffer.list_inspection_send(function(data){
                                        //console.log("DATA<----------",data);
                                        //console.log("RESULT<----------",respondBody.data.result);

                                        for (var i = 0; i < respondBody.data.result.length; i++) {
                                            for (var j = 0; j < data.length; j++) {

                                                if(respondBody.data.result[i].id_inspuser===data.item(j).id_inspuser){
                                                    DB.query('DELETE FROM BufferInspectionSend where id_inspuser=' + data.item(j).id_inspuser);
                                                }
                                            }
                                        }
                                        BufferToCloud.uploadCloudRecursive();
                                    });

                                }else{
                                    BufferToCloud.uploadCloudRecursive();
                                }

                            }else{
                                util.timeout(BufferToCloud.uploadCloudRecursive,5000);
                            }
                        }
                    );
                }else{
                    callback();
                }
            });
        },function(){
            BufferToCloud.uploadCloudRecursive();
            console.log('SIN INTERNET...ins_inspection_send');
        });
    }
};