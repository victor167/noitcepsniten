///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var emulateInternetOffLine  =   false;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var app                     =   {
    exit: function(){Main.exit();},
    back: function(){$$('.back').click()},
    initialize: function() {

        Main.listenBackButton('inspector',Main.back);
        Main.listenBackButton('nuevaInspeccion',Main.back);
        Main.listenBackButton('resumenInspeccion',Main.back);
        Main.listenBackButton('categoriaInspeccion',Main.back);
        Main.listenBackButton('swiper-horizontal',function(){
            $$(".actions-modal-button.color-black").click();
            Main.back();
        });
        Main.listenBackButton('enviarInspeccion',Main.back);
        Main.listenBackButton('foto-coment-inspeccion',Main.back);
        Main.listenBackButton('smart-select-radio-.*',Main.back);
        Main.listenBackButton('autocomplete-radio-.*',Main.back);
        Main.listenBackButton('photo-browser-slides',Main.back);

        $$(document).on('click','#version',function(){
            $$(this).css("opacity","0");
        });
        $$(document).on('click','.back-messagecontinue',function(){
            $$("#message").hide();
            pauseUploadChange = false;
        });
        $$("#logout").on("click",function(){
            DataInitialLoad = false;
            Main.logout();
        });

        AWS.config.update({accessKeyId: base64_decode(AWS_AccessKeyId), secretAccessKey: base64_decode(AWS_SecretAccessKey)});
        AWS.config.region = AWS_Region;
        bucket = new AWS.S3({params: {Bucket: base64_decode(AWS_BucketName)}});

        if(isMobile())
        {
            if(typeof window.plugins !== 'undefined' && typeof window.plugins.TaskDescriptionColor !== 'undefined')
            {
                window.plugins.TaskDescriptionColor.setColor('#ffffff','#154c77');
            }
        }
    },
    panel: false,
    activities:[
        'loginActivity',
        'inspectorActivity',
        'nuevaInspeccionActivity',
        'categoriaInspeccionActivity',
        'preguntasInspeccionActivity',
        'fotoComentInspeccionActivity',
        'enviarInspeccionActivity',
        'enviarInspeccionResumenActivity',
        'resumenInspeccionActivity',
        'developerActivity'
    ]

};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var util                    =   {
    animate: function(time_milliseconds,callback){
        setTimeout(callback,time_milliseconds);
    },
    intervalBefore: function(callback,time){
        var inter;
        var finter = function(){
            clearInterval(inter);
        };
        inter = setInterval(function(){callback(finter);},time);
        callback(finter);
    },
    intervalLast: function(callback,time){
        var inter;
        var finter = function(){
            clearInterval(inter);
        };
        inter = setInterval(function(){callback(finter);},time);
    },
    timeout: function(callback,time){
        setTimeout(callback,time);
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
SESSION.setDataSync = function(name,value){
    var queries = ['UPDATE SESSION SET value="' + value + '" WHERE name="' + name + '"'];
    DB.process(queries,function(){
        //console.log('BIEN:setDataSync');
    },function(){
        //console.log('MAL:setDataSync');
    });
};

var SyncData                =   {
    format: function(object,iscallback,parameters,isObject){
        if(object===null){
            console.log("::SyncData::format::DATA NULL");
            return false;
        }
        if(typeof object==="function")
        {
            iscallback();
        }
        else if(typeof object==="object")
        {
            var objectcount = object.length;
            if(typeof objectcount!=="undefined" && objectcount>0)
            {
                var validparams =   true;
                var objectkeys  =   Object.keys(object[0]);
                for(var i=0;i<parameters.length;i++)
                {
                    if(objectkeys.indexOf(parameters[i]) === -1)
                    {
                        validparams =   false;
                    }
                }
                if(validparams)
                {
                    isObject();
                }
            }else{
                isObject();
            }
        }
    },
    storage: function(object,replace){
        if(typeof replace==="undefined") replace = true;
        SyncData.format(object,function(){
            DB.query('select total_storage, total_storage_used from SyncDataStorage LIMIT 1;',function(trans,result){
                if(result.rows.length){
                    object(result.rows.item(0));
                }else{
                    object({total_storage:0,total_storage_used:0});
                }
            });
        },['total_storage', 'total_storage_used'],function(){
            if(object.length===1)
            {
                var queries = [
                    'DELETE FROM SyncDataStorage;',
                    'INSERT INTO SyncDataStorage(total_storage, total_storage_used) VALUES("'+ object[0].total_storage +'","'+ object[0].total_storage_used +'");'
                ];
                DB.process(queries,function(){
                    //console.log('BIEN:storage');
                },function(){
                    //console.log('MAL:storage');
                });
            }
        });
    },
    listShip: function(object,replace){
        if(typeof replace==="undefined") replace = true;
        SyncData.format(object,function(){
            DB.query('select id,name,nombre,ais_callsign,dt_ship_yearbuilt,idShipSede,id_inventory_KinkShipOrSede,nu_ship_AB,nu_ship_HP,nu_ship_eslora,nu_ship_manga,nu_ship_puntal,tx_ship_bollardpull,tx_ship_registration,type from SyncDataShip;',function(trans,result){
                var length  = result.rows.length;
                var rows    = [];
                for(var i=0;i<length;i++){
                    rows.push(result.rows.item(i));
                }
                object(rows);
            });
        },['id','name','nombre','ais_callsign','dt_ship_yearbuilt','idShipSede','id_inventory_KinkShipOrSede','nu_ship_AB','nu_ship_HP','nu_ship_eslora','nu_ship_manga','nu_ship_puntal','tx_ship_bollardpull','tx_ship_registration','type'],function(){
            var queries = ['DELETE FROM SyncDataShip;'];
            object.forEach(function(value){
                queries.push('INSERT INTO SyncDataShip(id,name,nombre,ais_callsign,dt_ship_yearbuilt,idShipSede,id_inventory_KinkShipOrSede,nu_ship_AB,nu_ship_HP,nu_ship_eslora,nu_ship_manga,nu_ship_puntal,tx_ship_bollardpull,tx_ship_registration,type) VALUES('+ value.id +',"'+ value.name +'","'+ value.nombre +'","'+ value.ais_callsign +'","'+ value.dt_ship_yearbuilt +'",'+ value.idShipSede +','+ value.id_inventory_KinkShipOrSede +','+ value.nu_ship_AB +','+ value.nu_ship_HP +','+ value.nu_ship_eslora +','+ value.nu_ship_manga +','+ value.nu_ship_puntal +',"'+ value.tx_ship_bollardpull +'","'+ value.tx_ship_registration +'","'+ value.type +'")');
            });
            DB.process(queries,function(){
                //console.log('BIEN:listShip');
            },function(){
                //console.log('MAL:listShip');
            });
        });
    },
    listBranch: function(object,replace){
        if(typeof replace==="undefined") replace = true;
        SyncData.format(object,function(){
            DB.query('select id, name from SyncDataShip;',function(trans,result){
                object(result.rows);
            });
        },['id','name'],function(){
            //console.log("listBranch[X]",object);
            var queries = ['DELETE FROM SyncDataBranch;'];
            object.forEach(function(value){
                queries.push('INSERT INTO SyncDataBranch(id,name) VALUES('+ value.id +',"'+ value.name +'")');
            });
            DB.process(queries,function(){
                //console.log('BIEN:listBranch');
            },function(){
                //console.log('MAL:listBranch');
            });
        });
    },
    listCaptain: function(object,replace){
        if(typeof replace==="undefined") replace = true;
        SyncData.format(object,function(){
            DB.query('select id, name, id_inventory_CaptainAdminSede from SyncDataCaptain;',function(trans,result){
                object(result.rows);
            });
        },['id','name','id_inventory_CaptainAdminSede'],function(){
            var queries = ['DELETE FROM SyncDataCaptain;'];
            object.forEach(function(value){
                queries.push('INSERT INTO SyncDataCaptain(id,name,id_inventory_CaptainAdminSede) VALUES('+ value.id +',"'+ value.name +'",'+ value.id_inventory_CaptainAdminSede +')');
            });
            DB.process(queries,function(){
                //console.log('BIEN:listCaptain');
            },function(){
                //console.log('MAL:listCaptain');
            });
        });
    },
    listPerson: function(object,replace){
        if(typeof replace==="undefined") replace = true;
        //console.log("listPerson1", object);
        SyncData.format(object,function(){
            //console.log("listPerson2");
            DB.query('select id_user,NamePerson,NameProfile,CountEmail from SyncDataPerson;',function(trans,result){
                //console.log("listPerson3");
                object(result.rows);
            });
        },[],function(){
            //console.log("listPerson4");
            var queries = ['DELETE FROM SyncDataPerson;'];
            object.forEach(function(value){
                queries.push('INSERT INTO SyncDataPerson(id_user,NamePerson,NameProfile,CountEmail) VALUES('+ value.id_user +',"'+ value.NamePerson +'","'+ value.NameProfile +'",'+ value.CountEmail +')');
            });
            //console.log("listPerson5");
            DB.process(queries,function(){
                //console.log("listPerson6");
                //console.log('BIEN:listPerson');
            },function(){
                //console.log("listPerson7");
                //console.log('MAL:listPerson');
            });
        });
    },
    listInspection: function(object,replace){
        if(typeof replace==="undefined") replace = true;
        SyncData.format(object,function(){
            DB.query('select bo_inspsurvques_type,id_inspection,id_inspsurv,id_inspsurvques,id_inspsurvques_fk,id_mastertable_questype,nu_inspection_countsurv,nu_inspsurv_countques,nu_inspsurv_order,nu_inspsurv_weight,nu_inspsurvques_countquesopti,nu_inspsurvques_level,nu_inspsurvques_order,nu_inspsurvques_son,nu_inspsurvques_weight,tx_inpsurvques_comment,tx_inpsurvques_decription,tx_inspection_title,tx_inspsurv_description,tx_inspsurv_title from SyncDataInspection;',function(trans,result){
                object(result.rows);
            });
        },[],function(){
            var queries = ['DELETE FROM SyncDataInspection;'];
            object.forEach(function(value){
                queries.push('INSERT INTO SyncDataInspection(bo_inspsurvques_type,id_inspection,id_inspsurv,id_inspsurvques,id_inspsurvques_fk,id_mastertable_questype,nu_inspection_countsurv,nu_inspsurv_countques,nu_inspsurv_order,nu_inspsurv_weight,nu_inspsurvques_countquesopti,nu_inspsurvques_level,nu_inspsurvques_order,nu_inspsurvques_son,nu_inspsurvques_weight,tx_inpsurvques_comment,tx_inpsurvques_decription,tx_inspection_title,tx_inspsurv_description,tx_inspsurv_title) VALUES('+ value.bo_inspsurvques_type +','+ value.id_inspection +','+ value.id_inspsurv +','+ value.id_inspsurvques +','+ value.id_inspsurvques_fk +','+ value.id_mastertable_questype +',' + value.nu_inspection_countsurv + ','+ value.nu_inspsurv_countques +','+ value.nu_inspsurv_order +','+ value.nu_inspsurv_weight +','+ value.nu_inspsurvques_countquesopti +','+ value.nu_inspsurvques_level +','+ value.nu_inspsurvques_order +','+ value.nu_inspsurvques_son +','+ value.nu_inspsurvques_weight +',"'+ value.tx_inpsurvques_comment +'","'+ value.tx_inpsurvques_decription +'","'+ value.tx_inspection_title +'","'+ value.tx_inspsurv_description +'","'+ value.tx_inspsurv_title +'");');
            });
            DB.process(queries,function(){
                //console.log('BIEN:listInspection');
            },function(){
                //console.log('MAL:listInspection');
            });
        });
    },
    inspection: function(_id_inspection,callback){
        DB.query('select bo_inspsurvques_type,id_inspection,id_inspsurv,id_inspsurvques,id_inspsurvques_fk,id_mastertable_questype,nu_inspection_countsurv,nu_inspsurv_countques,nu_inspsurv_order,nu_inspsurv_weight,nu_inspsurvques_countquesopti,nu_inspsurvques_level,nu_inspsurvques_order,nu_inspsurvques_son,nu_inspsurvques_weight,tx_inpsurvques_comment,tx_inpsurvques_decription,tx_inspection_title,tx_inspsurv_description,tx_inspsurv_title from SyncDataInspection WHERE id_inspection=' + _id_inspection + ';',function(trans,result){
            callback(result.rows);
        });
    },
    listInspectionType: function(object,replace){
        if(typeof replace==="undefined") replace = true;
        SyncData.format(object,function(){
            DB.query('select id,name from SyncDataInspectionType;',function(trans,result){
                object(result.rows);
            });
        },[],function(){
            //console.log("listInspectionType[X]",object);
            var queries = [];
            if(replace)
            {
                queries.push('DELETE FROM SyncDataInspectionType;');
            }
            object.forEach(function(value){
                queries.push('INSERT INTO SyncDataInspectionType(id,name) VALUES('+ value.id +',"'+ value.name +'");');
            });
            DB.process(queries,function(){
                //console.log('BIEN:listInspectionType');
            },function(){
                //console.log('MAL:listInspectionType');
            });
        });
    },
    listInspectionUser: function(object,replace){
        if(typeof replace==="undefined") replace = true;
        SyncData.format(object,function(){
            DB.query('select bo_inspuser_state, bo_inspusersurvques_answer_option, bo_inspusersurvques_apply, captain_name, dt_inspuser_end, dt_inspuser_start, id_inspsurv, id_inspsurvques, id_inspsurvques_fk, id_inspuser, id_inspusersurv, id_inspusersurvques, id_inspusersurvques_fk, id_mastertable_questype, key_inspuser, nu_inspsurv_countques, nu_inspsurv_countquesrespon, nu_inspsurvques_level, nu_inspsurvques_order, nu_inspsurvques_son, nu_inspsurvques_weight, nu_inspusersurvques_countfile, nu_inspusersurvques_score, ship_name, tx_inpsurvques_comment, tx_inpsurvques_decription, tx_inspection_title, tx_inspsurv_title, tx_inspusersurvques_answer_observation, tx_inspusersurvques_latitud, tx_inspusersurvques_longitud from SyncDataInspectionUser;',function(trans,result){
                object(result.rows);
            });
        },[],function(){
            //console.log("listInspectionUser[X]",object);
            var queries = [];
            if(replace)
            {
                queries.push('DELETE FROM SyncDataInspectionUser;');
            }
            object.forEach(function(value){
                queries.push('INSERT INTO SyncDataInspectionUser(bo_inspuser_state, bo_inspusersurvques_answer_option, bo_inspusersurvques_apply, captain_name, dt_inspuser_end, dt_inspuser_start, id_inspsurv, id_inspsurvques, id_inspsurvques_fk, id_inspuser, id_inspusersurv, id_inspusersurvques, id_inspusersurvques_fk, id_mastertable_questype, key_inspuser, nu_inspsurv_countques, nu_inspsurv_countquesrespon, nu_inspsurvques_level, nu_inspsurvques_order, nu_inspsurvques_son, nu_inspsurvques_weight, nu_inspusersurvques_countfile, nu_inspusersurvques_score, ship_name, tx_inpsurvques_comment, tx_inpsurvques_decription, tx_inspection_title, tx_inspsurv_title, tx_inspusersurvques_answer_observation, tx_inspusersurvques_latitud, tx_inspusersurvques_longitud) VALUES(' + value.bo_inspuser_state + ',' + value.bo_inspusersurvques_answer_option + ',' +  value.bo_inspusersurvques_apply + ',"' +  value.captain_name + '","' +  value.dt_inspuser_end + '","' +  value.dt_inspuser_start + '",' +  value.id_inspsurv + ',' +  value.id_inspsurvques + ',' +  value.id_inspsurvques_fk + ',' +  value.id_inspuser + ',' +  value.id_inspusersurv + ',' +  value.id_inspusersurvques + ',' +  value.id_inspusersurvques_fk + ',' +  value.id_mastertable_questype + ',"' +  value.key_inspuser + '",' +  value.nu_inspsurv_countques + ',' +  value.nu_inspsurv_countquesrespon + ',' +  value.nu_inspsurvques_level + ',' +  value.nu_inspsurvques_order + ',' +  value.nu_inspsurvques_son + ',' +  value.nu_inspsurvques_weight + ',' +  value.nu_inspusersurvques_countfile + ',' +  value.nu_inspusersurvques_score + ',"' +  value.ship_name + '","' +  value.tx_inpsurvques_comment + '","' +  value.tx_inpsurvques_decription + '","' +  value.tx_inspection_title + '","' +  value.tx_inspsurv_title + '","' +  value.tx_inspusersurvques_answer_observation + '","' +  value.tx_inspusersurvques_latitud + '","' +  value.tx_inspusersurvques_longitud + '");');
            });
            DB.process(queries,function(){
                //console.log('BIEN:listInspectionUser');
            },function(){
                //console.log('MAL:listInspectionUser');
            });
        });
    },
    listImagesFileQuestion: function(object,replace){
        console.log("listImagesFileQuestion",object);
        if(typeof replace==="undefined") replace = true;
        SyncData.format(object,function(){
            DB.query('select id_inspuser,id_inspusersurvques,id_inspusersurvquesfile,inspusersurvquesfile_name,inspusersurvquesfile_url from SyncDataImagesFileQuestion;',function(trans,result){
                object(result.rows);
            });
        },[],function(){
            var queries = [];
            if(replace){
                queries.push('DELETE FROM SyncDataImagesFileQuestion;');
            }
            object.forEach(function(value){
                queries.push('INSERT INTO SyncDataImagesFileQuestion(id_inspuser, id_inspusersurvques, id_inspusersurvquesfile, inspusersurvquesfile_name, inspusersurvquesfile_url) VALUES(' + value.id_inspuser + ', ' + value.id_inspusersurvques + ', ' + value.id_inspusersurvquesfile + ', "' + value.inspusersurvquesfile_name + '", "' + value.inspusersurvquesfile_url + '");');
            });
            DB.process(queries,function(){
                //console.log('BIEN:listImagesFileQuestion');
            },function(){
                //console.log('MAL:listImagesFileQuestion');
            });
        });
    },
    getListImagesQuestionAndBuffer: function (_id_inspusersurvques,_id_inspsurvques,_id_inspuser,_key_inspuser,callback) {
        DB.query('SELECT fq.id_inspusersurvquesfile, "" key_image, fq.inspusersurvquesfile_url, c.img FROM SyncDataImagesFileQuestion fq LEFT JOIN SyncDataImagesContent c ON c.id=fq.id_inspusersurvquesfile WHERE fq.id_inspusersurvques != 0 AND fq.id_inspusersurvques =' + _id_inspusersurvques + ' UNION SELECT 0 id_inspusersurvquesfile, bqp.key_image, "" inspusersurvquesfile_url, bqp.file img FROM BufferQuestionPhoto bqp WHERE ( id_inspuser = ' + _id_inspuser + ' AND key_inspuser = "' + _key_inspuser + '" AND id_inspsurvques = ' + _id_inspsurvques + ' ) OR ( id_inspuser != ' + _id_inspuser + ' AND id_inspuser = ' + _id_inspuser + ' AND id_inspsurvques = '+ _id_inspsurvques +' );',function(trans,result){
            callback(result.rows);
        });
    },
    sync: function(object){
        SyncData.format(object,function(){
            DB.query('select CuboInspection,CuboPerson,CuboSede,CuboShip,Cubofile,Cuboinspuser,Cuboinspuserresp,Cubouserstorage from SyncDataSyncDate;',function(trans,result){
                if(result.rows.length){
                    object(result.rows.item(0));
                }else{
                    object({CuboInspection:"",CuboPerson:"",CuboSede:"",CuboShip:"",Cubofile:"",Cuboinspuser:"",Cuboinspuserresp:"",Cubouserstorage:""});
                }
            });
        },['CuboInspection','CuboPerson','CuboSede','CuboShip','Cubofile','Cuboinspuser','Cuboinspuserresp','Cubouserstorage'],function(){
            if(object.length===1)
            {
                var queries = [
                    'DELETE FROM SyncDataSyncDate;',
                    'INSERT INTO SyncDataSyncDate(CuboInspection, CuboPerson, CuboSede, CuboShip, Cubofile, Cuboinspuser, Cuboinspuserresp, Cubouserstorage) VALUES("'+ object[0].CuboInspection +'","'+ object[0].CuboPerson +'","'+ object[0].CuboSede +'","'+ object[0].CuboShip +'","'+ object[0].Cubofile +'","'+ object[0].Cuboinspuser +'","'+ object[0].Cuboinspuserresp +'","'+ object[0].Cubouserstorage +'");'
                ];
                DB.process(queries,function(){
                    //console.log('BIEN:sync');
                },function(){
                    //console.log('MAL:sync');
                });
            }
        });
    },
    listDataImagesContent: function(object,replace){
        if(typeof replace==="undefined") replace = true;
        SyncData.format(object,function(){
            DB.query('select id,img from SyncDataImagesContent;',function(trans,result){
                object(result.rows);
            });
        },['id','img'],function(){
            var queries = [];
            if(replace){
                queries.push('DELETE FROM SyncDataImagesContent;');
            }
            queries.push('INSERT INTO SyncDataImagesContent(id, img) VALUES('+ object[0].id +',"'+ object[0].img +'");');
            DB.process(queries,function(){
                //console.log('BIEN:sync');
            },function(){
                //console.log('MAL:sync');
            });

        });
    },
    getDataImagesContent: function(id,other,object){
        DB.query('select id,img from SyncDataImagesContent where id=' + id + ';',function(trans,result){
            if(result.rows.length===1){
                object(result.rows.item(0),id,other);
            }else{
                object(null,id,other);
            }
        });
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var initialize              =   {
    ini: function(){
        initialize.initial(function(){
            initialize.db(function(){
                initialize.session(function(){
                    initialize.loadData(function(){//--login,internet
                        initialize.dataInitial(function(){
                            initialize.declare(initialize.go);
                        });
                    });
                });
            });
        });
    },
    declare: function(callback){
        console.log("initialize[6].declare");

        $$(".user-info .name .item-title").html(SESSION.namePerson);
        $$(".user-info .user .item-title").html(SESSION.user);

        BufferToCloud.check();

        callback();
    },
    go: function(){
        console.log("initialize[7].go");
        if(updated)
        {
            console.log("SE ESTA ACTUALIZANDO, NO HACER NADA");
        }
        else
        {
            if(SESSION.connect)
            {
                initialize.end(1000,'PANEL');
            }
            else
            {
                initialize.end(1000,'LOGIN');
            }
        }
    },
    initial: function(callback){
        console.log("initialize[1].initial");
        $$("#version").html(VERSION_TITLE);
        moment.locale('es');
        callback();
    },
    db: function(callback){
        console.log("initialize[2].db");
        var db_update = false;

        var db_init_ifnotexist = function(){
            DB.open("client","Client DataBase",10*1024*1024);
            DB.format("session",
                "resources/dtb/client_session.sql",
                function(){
                    db_verify_update();
                },
                function(){
                    alert("LO SENTIMOS OCURRIO UN ERROR[I.DB]");
                }
            );
        };

        var db_verify_update = function(){

            var updateDatabaseMobil ='';
            DB.query('select name,value from session WHERE name="updateDatabaseMobil" LIMIT 1;',function(trans,result){
                if(result.rows.length)
                {
                    updateDatabaseMobil = result.rows.item(0)['value'];

                    if(!db_update)
                    {
                        if(updateDatabaseMobil === UPDATE_DATABASE_MOBIL)
                        {
                            console.log('initialize[2].db>SIN CAMBIOS');
                            if(typeof callback !=='undefined')
                            {
                                callback();
                            }
                        }
                        else
                        {
                            console.log('initialize[2].db>CON CAMBIOS');
                            db_update = true;
                            UPDATE_DATABASE_COUNT++;
                            if(UPDATE_DATABASE_COUNT<=1)
                            {
                                DB.deleteAllDatabase(function(){
                                    db_init_ifnotexist();
                                });
                            }
                            else
                            {
                                alert('Lo sentimos ocurrio un error en la aplicación');
                            }
                        }
                    }else{
                        callback();
                    }

                }
            });
        };

        db_init_ifnotexist();
    },
    session: function(callback){
        console.log("initialize[3].session");
        SESSION.connect                 = false;
        SESSION.updateDatabaseMobil     = '';
        SESSION.token                   = '';

        var i = 0;
        DB.query("select name,value from session;",function(trans,result){
            if(result.rows.length)
            {
                var newResult           = DB.toArrayIndex(result,"name");

                $$.each(newResult,function(ind,val){
                    if(val.name==='connect')
                    {
                        SESSION.connect     = (newResult.connect.value==="1");
                    }
                    else
                    {
                        SESSION[val.name]   = val.value;
                    }
                    if((i+1)===Object.keys(newResult).length){
                        callback();
                    }
                    i++;
                });

                if(Object.keys(newResult).length===0)
                {
                    console.log("ERROR DE SESSION");
                }
            }
            else
            {
                console.log('La aplicación detecto un problema.');
                alert('La aplicación detecto un problema.');
            }
        });
    },
    open_animate: function(){
        this.ini_time_animate  =   new Date();

        util.animate(0,function(){
            $$("#backgroundLogo img").addClass("complete");
        });
        util.animate(400,function(){
            $$("#backgroundLogo").css("opacity","0");
        });
        util.animate(1000,function(){
            $$("#backgroundLogo").hide();
            Main.backgroundTopShow();
        });
    },
    ini_time_animate: 0,
    end: function(time_last_end,to){
        if(initialize.ini_time_animate!==0)
        {
            var x = setInterval(function(){
                var now = new Date();
                if((now-initialize.ini_time_animate)>=time_last_end)
                {
                    if(to==="LOGIN"){
                        mainView.router.load({
                            'url':'layout/login.html',
                            'animatePages':false
                        });
                        Main.backgroundTopHide();
                    }else if(to==="PANEL"){
                        mainView.router.load({
                            'url':'layout/login.html',
                            'animatePages':false
                        });
                        setTimeout(function(){
                            mainView.router.load({
                                'url':'layout/inspector.html',
                                'animatePages':false
                            });
                        },200);
                    }
                    clearInterval(x);
                }
            }, 1000);
        }
    },
    loadData: function(callback){
        console.log("initialize[4].loadData");

        system.iniServices();
        initialize.open_animate();

        Buffer.check();

        if(SESSION.connect){
            app.panel   =   true;
            Main.internet(function(){
                if(!system.checkPendingChange){
                    pauseUploadChange   =   false;
                    callback(true,true);
                }else{
                    callback(true,true);
                }
            },function(){
                callback(true,false);
            });
        }else{
            app.panel   =   false;
            Main.internet(function(){
                callback(false,true);
            },function(){
                callback(false,false);
            });
        }
    },
    dataInitial: function(callbackOn){
        console.log("initialize[5].dataInitial");
        if(!DataInitialLoad) {
            DataInitialLoad = true;

            SyncData.sync(function(DataSyncsync){
                Main.restFul(
                    API + 'api/DataInitial',
                    'GET',
                    {
                        datesDataSync: JSON.stringify(DataSyncsync),
                        dataSync: SESSION.dataSync,
                        dataSyncToCloud: ((system.checkPendingChange)? 1:0),
                        originSync: ((app.panel)?'panel':'login'),
                        idCompany: SESSION.idCompany,
                        idUser: SESSION.idUser,
                        user: SESSION.user,
                        branch: AppBranch,
                        version: VERSION,
                        updateDatabaseMobil: UPDATE_DATABASE_MOBIL
                    },
                    function (respondBody) {//--respondHeader
                        //console.log('respondBody', respondBody);
                        DataInitialLoad = false;
                        console.log("VER::DataInitial::success", respondBody.success);
                        if (typeof respondBody.success !== 'undefined' && respondBody.success) {
                            console.log("VER::connect");
                            if(SESSION.connect){
                                console.log("VER::storage");
                                if (typeof respondBody.data.storage !== "undefined" && typeof respondBody.data.storage[0] !== "undefined" && typeof respondBody.data.storage[0].total_storage !== "undefined" && typeof respondBody.data.storage[0].total_storage !== "undefined") {
                                    SyncData.storage(respondBody.data.storage);
                                }
                                console.log("VER::listShip");
                                if (typeof respondBody.data.listShip !== "undefined") {
                                    SyncData.listShip(respondBody.data.listShip);
                                }
                                console.log("VER::listBranch");
                                if (typeof respondBody.data.listBranch !== "undefined") {
                                    SyncData.listBranch(respondBody.data.listBranch);
                                }
                                console.log("VER::listCaptain");
                                if (typeof respondBody.data.listCaptain !== "undefined") {
                                    SyncData.listCaptain(respondBody.data.listCaptain);
                                }
                                console.log("VER::listPerson");
                                if (typeof respondBody.data.listPerson !== "undefined") {
                                    SyncData.listPerson(respondBody.data.listPerson);
                                }
                                console.log("VER::listInspection");
                                if (typeof respondBody.data.listInspection !== "undefined") {
                                    SyncData.listInspection(respondBody.data.listInspection);
                                    var listInspectionType  =   [];
                                    var listInspectioncount =   respondBody.data.listInspection.length;
                                    var xid_inspection      =   0;

                                    for (var i = 0; i < listInspectioncount; i++)
                                    {
                                        if (xid_inspection !== respondBody.data.listInspection[i].id_inspection)
                                        {
                                            xid_inspection = respondBody.data.listInspection[i].id_inspection;
                                            var x = listInspectionType.length;
                                            listInspectionType[x]       =   {};
                                            listInspectionType[x].id    =   respondBody.data.listInspection[i].id_inspection;
                                            listInspectionType[x].name  =   respondBody.data.listInspection[i].tx_inspection_title;

                                        }
                                    }

                                    SyncData.listInspectionType(listInspectionType);
                                }
                                console.log("VER::listInspectionUser");
                                if (typeof respondBody.data.listInspectionUser !== "undefined") {
                                    SyncData.listInspectionUser(respondBody.data.listInspectionUser);
                                }
                                console.log("VER::listImagesFileQuestion");
                                if(typeof respondBody.data.listImagesFileQuestion !== "undefined"){
                                    //console.log("listImagesFileQuestion::RECIBIDO2");
                                    SyncData.listImagesFileQuestion(respondBody.data.listImagesFileQuestion);
                                }
                                console.log("VER::sync");
                                if (typeof respondBody.data.sync !== "undefined") {
                                    SyncData.sync([respondBody.data.sync]);
                                }
                                console.log("VER::updated");
                                if (typeof respondBody.data.updated !== "undefined" && respondBody.data.updated > 0) {
                                    //console.log("SyncData:ACTUALIZADO");
                                    SESSION.setDataSync("dataSync","1");
                                }
                                callbackOn();
                            }else{
                                //console.log("OK5");
                                callbackOn();
                            }

                        }else{
                            //console.log("OK3");
                            if(SESSION.dataSync!=="0")
                            {
                                callbackOn();///ERROR EN EL SERVER
                            }else{
                                callbackOn();
                            }
                        }
                    }
                );
            });

        }
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var system                  =   {
    checkInternet: true,
    countCheckNoInternet: 0,
    checkPendingChange: false,
    iniServices:    function() {
        this.analiticCheckInternet();
        this.analiticTouchMove();
        this.analiticBackButton();
        this.analiticKeyPressCode();
        this.activitiesInitialize();
    },
    chekingInternet: function(){
        if(window.navigator.onLine)
        {
            system.countCheckNoInternet =    0;
        }
        else
        {
            system.countCheckNoInternet++;
        }

        if(system.countCheckNoInternet>=10)
        {
            system.checkInternet       =   false;
            $$(".not-conection").addClass("show");
        }
        else
        {
            if(typeof emulateInternetOffLine!== "undefined" && emulateInternetOffLine){
                system.checkInternet       =   false;
                $$(".not-conection").addClass("show");
            }else{
                $$(".not-conection").removeClass("show");
                system.checkInternet       =   true;
            }
        }

        Buffer.count(function(count){
            if(system.checkPendingChange){
                $$(".sync-pending").addClass("show");
                $$(".sync-pending .sk-fading-title").html(count);

                if($$("#message").css('display')==='block'){
                    $$(".sync-pending").removeClass("move");
                }else{
                    $$(".sync-pending").addClass("move");
                }
            }else{
                $$(".sync-pending").removeClass("show").addClass("move");
            }

            if(!system.checkPendingChange){
                $$(".sync-complete").addClass("show");
            }else{
                $$(".sync-complete").removeClass("show");
            }
        });

    },
    analiticCheckInternet: function(){
        util.intervalBefore(this.chekingInternet,500);
    },
    analiticTouchMove: function()
    {
        document.body.addEventListener('touchmove', function(e){
            var selector;
            for (var i in Main.listensTouchMove) {
                selector = Main.listensTouchMove[i];
                if (e.target === $$(selector)[0]) {
                    e.preventDefault();
                }
            }
        });
    },
    analiticBackButton: function(){
        document.addEventListener('backbutton', system.backbuttonListen);
    },
    listensBackButton:[],
    backbuttonListen: function(){
        for (i in system.listensBackButton)
        {
            var str = Main.getPageActive();
            var patt = new RegExp('^' + i + '$');
            if(patt.test(str))
            {
                system.listensBackButton[i]();
            }
        }
    },
    analiticKeyPressCode: function()
    {
        document.onkeydown = function (e)
        {
            for (i in Main.listensKeyPressCode)
            {
                var listenKeyPressCode  =   Main.listensKeyPressCode[i];
                if(e.keyCode===listenKeyPressCode.code && e.target===$$(listenKeyPressCode.select)[0])
                {
                    listenKeyPressCode.callback();
                }
            }
        };
    },
    activitiesInitialize: function(x)
    {
        if(typeof x ==='undefined') { x = 0; }

        var countActivities = (app.activities).length;

        if(countActivities>x)
        {
            var activity = app.activities[x];
            var url =   'activity/' + activity + '.js';

            $$.ajax({
                type: "GET",
                url: url,
                dataType: "text",
                success: function(data)
                {
                    var jsElm       =   document.createElement("script");
                    jsElm.type      =   "text/javascript";
                    jsElm.innerHTML =   data;
                    document.body.appendChild(jsElm);
                    if(countActivities===(x+1))
                    {
                        jsElm       =   document.createElement("script");
                        jsElm.type      =   "text/javascript";
                        jsElm.innerHTML =   'app.initialize();';
                        document.body.appendChild(jsElm);
                    }
                    if(typeof app.activities[x+1] !== 'undefined')
                    {
                        system.activitiesInitialize(x+1);
                    }
                },
                error: function(){
                    myApp.alert("Lo sentimos ocurrio un error",'',function(){});
                }
            });

        }
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var DB                      =   {
    ini: function(){
        DB.open("client","Client DataBase",5*1024*1024);

        DB.format("session",
            "resources/dtb/client_session.sql",
            function(){
                system.dbFinish();
            },
            function(){
                alert("LO SENTIMOS OCURRIO UN ERROR");
            }
        );
    },
    open:function(name,description,size){
        html5sql.openDatabase(name,description,size);
    },
    restore: function(_callback){
        DB.open("client","Client DataBase",10*1024*1024);
        DB.formatforce("session",
            "resources/dtb/client_session.sql",
            function(){
                _callback();
            },
            function(){
                alert("LO SENTIMOS OCURRIO UN ERROR[I.DB]");
            }
        );
    },
    error: function(a,b){
        console.log('ERROR_DB['+ b +']',a);
        alert("Lo sentimos ocurrio un error interno");
    },
    format: function(table,fileNameTable,resultTrue,resultFalse){
        DB.hasTable(table,function(exist){
            if(exist)
            {
                resultTrue();
            }
            else
            {
                $$.get(fileNameTable,function(sql){
                    sql = sql.replace("@UPDATE_DATABASE_MOBIL", UPDATE_DATABASE_MOBIL);
                    DB.query(sql,function(){
                        DB.hasTable(table,function(TableExist){
                            if(TableExist)
                            {
                                resultTrue();
                            }
                            else
                            {
                                resultFalse();
                            }
                        });
                    });
                });
            }
        });
    },
    formatforce: function(table,fileNameTable,resultTrue,resultFalse){
        $$.get(fileNameTable,function(sql){
            sql = sql.replace("@UPDATE_DATABASE_MOBIL", UPDATE_DATABASE_MOBIL);
            DB.query(sql,function(){
                DB.hasTable(table,function(TableExist){
                    if(TableExist)
                    {
                        resultTrue();
                    }
                    else
                    {
                        resultFalse();
                    }
                });
            });
        });
    },
    process: function(queries,functionSuccess,functionError){
        html5sql.process(
            queries,
            functionSuccess,
            functionError
        );
    },
    hasTable: function(table,result){
        if(typeof table === "string")
        {
            DB.query("select * from sqlite_master where tbl_name='" + table + "'",function(transaction, results){
                if(typeof result === "function")
                {
                    if(results.rows.length > 0 )
                    {
                        result(true);
                    }
                    else
                    {
                        result(false,results);
                    }
                }
            });
        }
        else
        {
            console.error("ERROR AL INSTANCIAR hasTable");
        }
    },
    deleteAllDatabase: function(_callback)
    {
        var queries_remove_tables  = [];
        DB.query("select * from sqlite_master where type='table'",function(transaction, results){
            var x = 0;
            for(var i=0;i<results.rows.length;i++)
            {
                var table = results.rows.item(i).tbl_name;

                if(table !== '__WebKitDatabaseInfoTable__')
                {
                    queries_remove_tables[x] = "DROP TABLE " + table;
                    x++;
                }
            }
            if(queries_remove_tables.length)
            {
                html5sql.process(
                    queries_remove_tables,
                    function(){
                        if(typeof _callback !=="undefined"){
                            _callback();
                        }
                    },
                    function(error, statement){}
                );
            }
            else
            {
                if(typeof _callback !=="undefined"){
                    _callback();
                }
            }
        });
    },
    procedures:{},
    ADD_PROCEDURE: function(_procedure_name,_procedure){
        this.procedures[_procedure_name] = _procedure;
    },
    PROCEDURE: function(_procedure_name){
        if(typeof this.procedures[_procedure_name]!=='undefined'){
            return this.procedures[_procedure_name]();
        }else{
            console.error('Procedure ' + _procedure_name + ' not exist.');
            Main.backgroundTopShow(
                '<div class="imargin-top-60"><div class="icon_global">:(</div>'+
                '<div>Lo sentimos, nos encontramos con un problema.</div>'+
                '<div>Por favor, inténtelo más tarde</div>' +
                '<div>Cod.[PRO958]</div></div>'
            );
            return [];
        }
    },
    query: function(query,result){
        if(typeof query === "string")
        {
            if(typeof result === "function")
            {
                html5sql.process(query,result,function(a,b){
                    DB.error(a,b);
                });
            }
            else
            {
                html5sql.process(query,function(xtrans,xresult){
                },this.error);
            }
        }else{
            if(typeof result === "function")
            {
                html5sql.process(query,result,function(a,b){
                    DB.error(a,b);
                });
            }
        }
    },
    toArray: function(result,isrows,attributes){
        if(typeof isrows==="undefined") isrows=false;
        if(typeof attributes==="undefined") attributes=null;
        if(!isrows) result = result.rows;

        var returning   =   [];
        if(attributes===null){
            for (var i = 0; i < result.length; i++) {
                returning[i] = result.item(i);
            }
        }else{
            for (var e = 0; e < result.length; e++) {
                returning[e]    =   {};
                var items = result.item(i);
                for(var nameprop in items){
                    if(items.hasOwnProperty(nameprop)){
                        if(attributes.indexOf(nameprop)!==-1){
                            returning[e][nameprop] = result.item(e)[nameprop];
                        }
                    }
                }
            }
        }

        return returning;
    },
    toArrayIndex: function(result,index){
        var returning   = {};
        var existColum  = false;

        for (var i = 0; i < result.rows.length; i++) {
            var val = result.rows.item(i);
            if(existColum || (typeof val !=='undefined' && typeof val[index] !=='undefined'))
            {
                existColum = true;
                returning[val[index]] = val;
            }
        }
        return returning;
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Main                    =   {
    internet: function(functionON,functionOFF) {
        var checkInternet;
        if(isMobile())
        {
            var networkState            = navigator.connection.type;
            var states                  = {};
            states[Connection.UNKNOWN]  = false;
            states[Connection.ETHERNET] = true;
            states[Connection.WIFI]     = true;
            states[Connection.CELL_2G]  = true;
            states[Connection.CELL_3G]  = true;
            states[Connection.CELL_4G]  = true;
            states[Connection.CELL]     = true;
            states[Connection.NONE]     = false;
            checkInternet = states[networkState];
        }
        else
        {
            checkInternet = system.checkInternet;
        }

        if(checkInternet)
        {
            if(typeof functionON !=='undefined')
            {
                functionON();
            }
        }
        else
        {
            if(typeof functionOFF !=='undefined')
            {
                functionOFF();
            }
        }
    },
    logout: function(){
        Main.backgroundTopShow("Cerrando sesión...");
        myApp.closePanel("left");
        app.panel = false;

        SESSION.setDataSync("connect","0");
        SESSION.setDataSync("dataSync","0");

        DB.restore(function(){
            util.timeout(function(){$$("body").hide();},600);
            util.timeout(function(){location.reload();},1000);
        });

    },
    backgroundTopShow: function(message,opacity){
        if(typeof message ==='undefined')
        {
            message = '<div class="spinner" style="margin-top:-50px;"></div>';
        }
        if(typeof opacity ==='undefined')
        {
            opacity = '1';
        }
        $$("#BackgroundTop .title").html(message);
        $$("#BackgroundTop").show().css("opacity",opacity);
    },
    backgroundTopHide: function(){
        $$("#BackgroundTop").css("opacity",0);
        setTimeout(function(){
            $$("#BackgroundTop").css("opacity",1);
            $$("#BackgroundTop").hide();
        },300);
    },
    pageloadShow: function(){
        var page = Main.getPageActive();
        $$('div.page[data-page="' + page + '"]:last-child .page-content-load').show();
    },
    pageloadHide: function(){
        var page = Main.getPageActive();
        $$('div.page[data-page="' + page + '"]:last-child .page-content-load').hide();
    },
    isPhoneGap: function () {
        var est =  (window.cordova || window.PhoneGap || window.phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
        if(est){
            if(typeof sqlitePlugin !=='undefined')
            {
                return true;
            }
        }
        return false;
    },
    disablePanels: function(action) {
        if(typeof action === 'undefined') { action  =   true; }

        if(action)
        {
            myApp.params.swipePanel = false;
        }
        else
        {
            myApp.params.swipePanel = 'left';
        }
    },
    restFulLostConection:function(){
        if(SESSION.dataSync==="0")
        {
            $$("#BackgroundTop .title").html('<div class="imargin-top-60"><div class="icon_global">:(</div><div>Lo sentimos no podemos conectarnos al sistema.</div><div>Por favor, vuelva a intentarlo nuevamente</div></div>');
            setTimeout(function () {
                $$("#BackgroundTop .title .InternetNotConnection").show();
            }, 500);
        }
        else if(!DataInitialLoad)
        {
            
        }
    },
    restFulError: function(){
        if(SESSION.dataSync==="0")
        {
            $$("#BackgroundTop .title").html('<div class="imargin-top-60"><div class="icon_global">:(</div><div>Lo sentimos el servidor detecto un problema.</div><div>Por favor, contactese a un administrador</div></div>');
            setTimeout(function(){
                $$("#BackgroundTop .title .InternetNotConnection").show();
            },500);
        }
        else if(!DataInitialLoad)
        {
            console.log("Error2");
        }
    },
    restFul: function(_url,_type,_data,_callback,_persistence,_timeout) {
        if(typeof _timeout === 'undefined')
        {
            _timeout   =   60000;
        }

        if(_type==='GET'||_type==='DELETE')
        {
            _persistence = true;
        }

        var id = Math.floor(Math.random() * 10000) + 1;

        if(typeof _data === 'undefined')
        {
            _data   =   {};
        }
        if(typeof _persistence === 'undefined')
        {
            _persistence   =   false;
        }

        if(!(_type==="GET"||_type==="DELETE"))
        {
            _data   =   JSON.stringify(_data);
        }

        var _headers        =   {"token":SESSION.token};
        var loadxhr         =   null;
        var nro_conections  =   0;

        Main.internet(function(){
            //////////////////////////////////////////////
            var intervalFunction = function() {
                nro_conections++;
                if(loadxhr!==null)
                {
                    loadxhr.abort();
                }
                if(nro_conections<3)
                {
                    loadxhr = Main.restFulExecute(id,_url, _type, _data, _headers, _callback,function(){
                        clearInterval(sinterval);
                    });
                    if(!_persistence)
                    {
                        clearInterval(sinterval);
                    }
                }
                else
                {
                    clearInterval(sinterval);
                    alert("Hay un problema de conexión, intentémoslo de nuevo",function(){
                        location.reload();
                    });
                }
            };

            intervalFunction();

            if(_timeout===0)
            {
                var sinterval = setInterval(intervalFunction, _timeout);
            }
        },function(){
            $$("#BackgroundTop .title").html('<div class="InternetNotConnection" style="display: none;"><div class="title"><i class="material-icons" style=" font-size: 4em; ">&#xE8A9;</i><div style=" font-size: 1.4em; ">Imposible conectarse a internet</div> <div class="content-block"><a href="#" class="button button-raised" style=" background: white; ">Reintentar</a> </div></div></div>');
            setTimeout(function(){
                $$("#BackgroundTop .title .InternetNotConnection").show();
            },500);
            var request   = {data:_data,headers:_headers};
            _callback({id:id,url:_url,type:_type,request:request,success:false,offline:true},null);
        });

        return id;
    },
    restFulExecute: function(id,_url,_type,_data,_headers,_callback,_complete) {
        var response = false;
        var loadxhr = $$.ajax({
            url: _url,
            type: _type,
            data: _data,
            headers: _headers,
            dataType: 'json',
            processData: false,
            contentType: 'application/json',
            success: function(data,textStatus,respondHeader)
            {
                if(!response){
                    response = true;
                    var request   = {data:_data,headers:_headers};
                    var returning = {id:id,url:_url,type:_type,request:request,success:true,lostConnection:false,offline:false,data:data};
                    if(!isMobile())
                    {
                        console.info("Restful",returning);
                    }
                    _callback(returning,respondHeader);
                }
            },
            error: function(respondHeader, textStatus, errorThrown)
            {


                if(!response) {
                    response = true;
                    _complete();

                    var request = {data: _data, headers: _headers};
                    var returning = {
                        id: id,
                        url: _url,
                        type: _type,
                        request: request,
                        success: false,
                        offline: false,
                        lostConnection: true,
                        data: null,
                        respondHeader: respondHeader,
                        textStatus: textStatus,
                        errorThrown: errorThrown
                    };

                    if (respondHeader.status === 0) {

                        Main.restFulLostConection(loadxhr);
                        if (SESSION.dataSync !== "0") {
                            _callback(returning, respondHeader);
                        }
                    }
                    else if (respondHeader.status === 401 && !statusError401) {
                        statusError401 = true;
                        var ResponseApp = null;
                        var UpdateApp = "NO";
                        try {
                            ResponseApp = respondHeader.getResponseHeader('ResponseApp');
                            UpdateApp = respondHeader.getResponseHeader('UpdateApp');
                        } catch (e) {

                        }

                        if (ResponseApp === null) {
                            ResponseApp = "";
                        } else {
                            ResponseApp = base64_decode(ResponseApp);
                        }

                        var data;
                        var errorJSON = false;
                        try {
                            data = JSON.parse(respondHeader.response);
                        } catch (e) {
                            errorJSON = true;
                        }

                        if (UpdateApp === "yes") {
                            if (!errorJSON && typeof data.hasJavaScript !== "undefined" && data.hasJavaScript) {
                                if (typeof data.javaScript !== 'undefined') {
                                    eval(data.javaScript);
                                }
                            }
                        } else {
                            if (!errorJSON && typeof data.hasJavaScript !== "undefined" && data.hasJavaScript) {
                                if (typeof data.javaScript !== 'undefined') {
                                    eval(data.javaScript);
                                }
                            }

                            if (respondHeader.statusText === "TOKEN EXPIRED") {
                                if (SESSION.connect) {
                                    alert(ResponseApp, function () {
                                        Main.logout();
                                    });
                                } else {
                                    _callback(returning, respondHeader);
                                }
                            }
                        }
                    }
                    else {
                        //console.log("MMMM4");
                        request = {data: _data, headers: _headers};
                        returning = {
                            id: id,
                            url: _url,
                            type: _type,
                            request: request,
                            success: false,
                            offline: false,
                            lostConnection: false,
                            data: null,
                            respondHeader: respondHeader,
                            textStatus: textStatus,
                            errorThrown: errorThrown
                        };

                        Main.restFulError(returning, respondHeader);
                        _callback(returning, respondHeader);
                    }
                }else{
                    console.log("==========================");
                    console.log("AJAX CALLBACK ERROR: " , respondHeader);
                    console.log("MSG: " , textStatus);
                    console.log("URL: " , _url);
                    //console.log("ERROR: " , respondHeader.onerror());
                    console.log("==========================");
                }
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json');
            },
            complete: function(xhr, status)
            {
                _complete();
            }
        });

        return loadxhr;
    },
    activities:[],
    loadActivity: function (activity)
    {
        if(!this.inArray(Main.activities,activity))
        {
            Main.activities[Main.activities.length]   =   activity;
            window[activity].ini();
        }
        window[activity].load();
    },
    setLayout: function(layout){
        Main.layoutActive    =   layout;
    },
    getPageActive : function(){
        return myApp.getCurrentView().activePage.name;
    },
    getSelectPageActive: function(){
        return $$('.views .pages .page[data-page="' +  Main.getPageActive() + '"]');
    },
    loadCSS: function(name){
        var ss      =   document.createElement("link");
        ss.type     =   "text/css";
        ss.rel      =   "stylesheet";
        ss.href     =   'res/css/' + name + '.css';
        document.body.appendChild(ss);
    },
    layoutActive:'index',
    checkLayout: function ()
    {
        return Main.layoutActive;
    },
    listenScroll: function(callback)
    {
        Main.select(window).scroll(function (event) {
            var scroll = Main.select(window).scrollTop();
            callback(event,scroll);
        });
    },
    inArray: function (a, obj)
    {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    },
    on: function(event,select,callback)
    {
        Main.select("body").on(event,select,callback);
    },
    checkIntervalInternet: function(callbackOnINternet,callbackOffINternet)
    {
        setInterval(function(){
            if(system.checkInternet)
            {
                if(typeof callbackOnINternet !== 'undefined')
                {
                    callbackOnINternet();
                }
            }
            else
            {
                if(typeof callbackOffINternet !== 'undefined')
                {
                    callbackOffINternet();
                }
            }
        },1000);
    },
    listenBackButton: function(name,callback)
    {
        system.listensBackButton[name]   =   callback;
    },
    select: function(select)
    {
        return $$(select);
    },
    listensTouchMove:[],
    disableTouchMove: function(selector)
    {
        Main.listensTouchMove[Main.listensTouchMove.length]   =   selector;
    },
    listensKeyPressCode:[],
    keyPressCode: function(select,code,callback)
    {
        var newId  =   Main.listensKeyPressCode.length;
        Main.listensKeyPressCode[newId]          =   [];
        Main.listensKeyPressCode[newId].select   =   select;
        Main.listensKeyPressCode[newId].code     =   code;
        Main.listensKeyPressCode[newId].callback =   callback;
    },
    validateInput: function(filters)
    {
        var resultSucess    =   true;
        var selector;
        for(selector in filters.inputs)
        {
            if(filters.inputs.hasOwnProperty(selector)) {
                var rules = filters.inputs[selector];
                var val = Main.select(selector).val();


                Main.select(selector).parent().removeClass('validationInputError');
                Main.select(selector).parent().find('.validationInputMessage').html('').hide();
                var message;
                var rule;
                for (rule in rules) {
                    if (rules.hasOwnProperty(rule)) {
                        var option = rules[rule];
                        switch (rule) {
                            case 'required':
                                if (option[0] && val.length === 0 || !option[0] && val.length > 0) {
                                    message = option[1];

                                    Main.select(selector).parent().addClass('validationInputError');
                                    Main.select(selector).parent().find('.validationInputMessage').html(message).show();
                                    resultSucess = false;
                                }
                                break;
                            case 'minlength':
                                if (val.length < option[0]) {
                                    message = (option[1]).replace('{0}', option[0]);

                                    Main.select(selector).parent().addClass('validationInputError');
                                    Main.select(selector).parent().find('.validationInputMessage').html(message).show();
                                    resultSucess = false;
                                }
                                break;
                            case 'maxlength':
                                if (val.length >= option[0]) {
                                    message = (option[1]).replace('{0}', option[0]);

                                    Main.select(selector).parent().addClass('validationInputError');
                                    Main.select(selector).parent().find('.validationInputMessage').html(message).show();
                                    resultSucess = false;
                                }
                                break;
                            case 'email':

                                break;
                            case 'equalTo':

                                break;
                        }
                    }
                }
            }
        }
        return resultSucess;
    },
    exit: function (){
        navigator.app.exitApp();
    },
    back: function(callback,animate){
        var iscallback = (typeof callback!=="undefined");
        animate = (typeof animate!=="undefined")? animate:true;

        if(Main.getPageActive()!=="inspector"){
            mainView.router.back({'animatePages':animate});
        }

        if(iscallback){
            if(animate){
                setTimeout(callback,400);
            }else{
                callback();
            }
        }
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////