var categoriaInspeccionActivity = 
{
	ini: function() {
		$$("body").on("click","#btnCategoryback",function(){
            Main.backgroundTopShow();
            mainView.router.back({'animatePages':false});
            setTimeout(function(){
                mainView.router.back({'animatePages':false});
                setTimeout(function(){
                    Main.backgroundTopHide();
                },100);
            },200);
        });

        $$("body").on("click","#btnCategoryback2",function(){
            mainView.router.back();
        });

        $$("body").on("click","#listCategoryInpection li",function(){
            $$(this).parent().find("li").removeClass("check");
            $$(this).addClass("check");
        });
	},
    countCat: function(){
        DB.query('SELECT id_inspsurv, nu_inspsurv_countques, nu_inspsurv_countquesrespon FROM SyncDataInspectionUser WHERE id_inspuser = ' + id_inspuser + ' AND key_inspuser = "' + key_inspuser + '" AND id_inspsurv = '+id_inspsurv+' GROUP BY id_inspsurv;',function(trans,result){
            if(result.rows.length){
                var _id_inspsurv                    =   result.rows.item(0).id_inspsurv;
                var _nu_inspsurv_countques          =   result.rows.item(0).nu_inspsurv_countques;
                var _nu_inspsurv_countquesrespon    =   result.rows.item(0).nu_inspsurv_countquesrespon;

                $$('#listCategoryInpection li a[data-id="' + _id_inspsurv + '"] .item-media .badge').html(_nu_inspsurv_countquesrespon + "/" + _nu_inspsurv_countques);
            }
        });
    },
    saveCountCat: function(_id_inspsurv,callback){
        var xrespond = 0;
        var selectQuest     =   'select id_inspsurvques id from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" AND id_inspsurv=' + _id_inspsurv + ' AND IFNULL(id_inspsurvques_fk,0)=0';
        DB.query(selectQuest,function(transQuest,resultQuest){
            if(resultQuest.rows.length){
                asyncLoop(resultQuest.rows.length, function(loop) {
                    var _id = resultQuest.rows.item(loop.iteration()).id;
                    if(typeof categoriaInspeccionActivity.questResp[_id]!=="undefined" && typeof categoriaInspeccionActivity.questResp[_id].resp!=="undefined"){
                        xrespond += categoriaInspeccionActivity.questResp[_id].resp;
                    }
                    loop.next();
                },function(){
                    DB.query('UPDATE SyncDataInspectionUser SET nu_inspsurv_countquesrespon=' + xrespond + ' WHERE id_inspuser = ' + id_inspuser + ' AND key_inspuser = "' + key_inspuser + '" AND id_inspsurv = ' + _id_inspsurv,function(){
                       callback(); 
                   });
                });
            }else{
                callback();
            }
        });
    },
    countPreg: function(_id_inspsurv,callback){
        var selectQuest     =   'select id_inspsurvques id,nu_inspsurvques_son son,tx_inpsurvques_decription desc from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" AND id_inspsurv=' + _id_inspsurv + ' AND IFNULL(id_inspsurvques_fk,0)=0';
        DB.query(selectQuest,function(transQuest,resultQuest){
            if(resultQuest.rows.length){
                asyncLoop(resultQuest.rows.length, function(loop) {
                    var _id = resultQuest.rows.item(loop.iteration()).id;
                    var _son = resultQuest.rows.item(loop.iteration()).son;
                    categoriaInspeccionActivity.countPregCall(_id_inspsurv,_id,_son,function(){
                        loop.next();
                    });
                },function(){
                    callback();
                });
            }else{
                callback();
            }
        });
    },
    countPregCall: function(_id_inspsurv,id,son,callback){
        if(son>0){
            DB.query('SELECT id_inspsurvques id, nu_inspsurvques_son son, tx_inpsurvques_decription desc FROM SyncDataInspectionUser WHERE id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" AND id_inspsurv=' + _id_inspsurv + ' AND id_inspsurvques_fk=' + id,function(transQuest,resultQuest){
                if(resultQuest.rows.length){
                    var _ids = [];
                    asyncLoop(resultQuest.rows.length, function(loop) {
                        _ids.push(resultQuest.rows.item(loop.iteration()).id);
                        var _id = resultQuest.rows.item(loop.iteration()).id;
                        var _son = resultQuest.rows.item(loop.iteration()).son;
                        categoriaInspeccionActivity.countPregCall(_id_inspsurv,_id,_son,function(){
                            loop.next();
                        });
                    },function(){
                        var xresp = 0;
                        var xquest = 0;
                        for (var i = 0; i < _ids.length; i++) {
                            if(typeof _ids[i]!=="undefined" && typeof categoriaInspeccionActivity.questResp[_ids[i]]!=="undefined" && typeof categoriaInspeccionActivity.questResp[_ids[i]].resp!=="undefined" && typeof categoriaInspeccionActivity.questResp[_ids[i]].quest!=="undefined"){
                                xresp += categoriaInspeccionActivity.questResp[_ids[i]].resp;
                                xquest += categoriaInspeccionActivity.questResp[_ids[i]].quest;
                            }else{
                                console.log("ERROR TERRIBLE, NO EXISTE PREGUNTA");
                            }
                        }
                        categoriaInspeccionActivity.questResp[id] = {
                            resp: xresp,
                            son:son,
                            quest: xquest
                        };
                        callback();
                    });
                }else{
                    callback();
                }
            });
        }
        else
        {
            DB.query('SELECT CASE WHEN bo_inspusersurvques_apply > 0 THEN 1 ELSE 0 END resp FROM SyncDataInspectionUser WHERE id_inspuser = ' + id_inspuser + ' AND key_inspuser = "' + key_inspuser + '" AND id_inspsurv = ' + _id_inspsurv + ' AND id_inspsurvques=' + id,function(transQuest,resultQuest){
                if(resultQuest.rows.length){
                    categoriaInspeccionActivity.questResp[id] = {
                        resp: resultQuest.rows.item(0).resp,
                        son:0,
                        quest: 1
                    };
                    callback();
                }else{
                    callback();
                }
            });
        }
    },
    questResp: {},
    load: function(){
        if(!inspectionWrite)
        {
            $$(".SubNavbarInfo").parent().parent().addClass("readonly");
            $$(".buttons-row-send-inspection").remove();
        }
        else
        {
            $$(".buttons-row-send-inspection-resume").remove();
        }

        DB.query('select nu_inspsurv_countques,nu_inspsurv_countquesrespon,id_inspuser,id_inspsurv,tx_inspsurv_title,tx_inspection_title,ship_name,captain_name from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" GROUP BY id_inspsurv',function(trans,result){
            if(result.rows.length) {
                captain_name = result.rows.item(0).captain_name;
                ship_name = result.rows.item(0).ship_name;
                tx_inspection_title = result.rows.item(0).tx_inspection_title;

                $$(".title-inspection").html(tx_inspection_title);
                $$(".title-ship").html(ship_name);
                $$(".title-captain").html(captain_name);
                $$('div[data-page="categoriaInspeccion"] .title-category').append(" (" + result.rows.length + ")");
                var content = '';
                categoriaInspeccionActivity.questResp = {};
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    categoriaInspeccionActivity.countPreg(row.id_inspsurv, function () {

                    });
                    content += '<li><a href="layout/preguntasInspeccion.html" data-id="' + row.id_inspsurv + '" data-context=\'{"tx_inspsurv_title":"' + row.tx_inspsurv_title + '","id_inspsurv": "' + row.id_inspsurv + '","id_inspsurvques":0}\' class="item-link"> <div class="item-content"> <div class="item-media"> <span class="badge bg-lightblue categoryBadge empty" id="' + row.id_inspsurv + '">' + row.nu_inspsurv_countquesrespon + '/' + row.nu_inspsurv_countques + '</span> </div> <div class="item-inner"> <div class="item-title">' + row.tx_inspsurv_title + '</div> </div> </div> </a></li>';
                }
                $$("#listCategoryInpection ul").html(content);
                Main.pageloadHide();
            }else{
                alert("La Inspeccion abierta no cuenta con informacion a visualizar",function(){
                    Main.back(function(){
                        Main.back(function(){
                            //ESTOY EN LA LISTA DE INSPECCIONES
                        },false);
                    },false);
                });
            }
        });

    }
};