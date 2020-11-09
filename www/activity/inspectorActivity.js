var inspectionWrite = true;
var inspectorActivity = 
{
	ini: function() {
		$$(document).on("click",".load-exist-inspection",function() {

            inspectionWrite     = $$(this).hasClass("write");
			id_inspuser 		= parseInt($$(this).attr("data-id_inspuser"));
			key_inspuser 		= $$(this).attr("data-key_inspuser");
			id_inspsurv 		= 0;
			id_inspsurvques 	= 0;
			id_inspusersurvques = 0;

			var query_getinsp = '';
			if(id_inspuser!==0){
				query_getinsp = 'select count(*) count_insp from SyncDataInspectionUser where id_inspuser=' + id_inspuser;
			}else if(id_inspuser===0 && key_inspuser!==''){
				query_getinsp = 'select count(*) count_insp from SyncDataInspectionUser where key_inspuser="' + key_inspuser + '"';
			}

			if(query_getinsp!==''){
				DB.query(query_getinsp,function(trans,result){
					if(result.rows.item(0).count_insp>0)
					{
						mainView.router.load({
							'url':'layout/categoriaInspeccion.html',
							'context':{id_inspuser:id_inspuser,back:"btnCategoryback2"}
						});
					}
					else
					{
						alert("La Inspeccion que desea abrir no esta disponible.");
                        Main.pageloadHide();
					}
				});
			}else{
				alert("La Inspeccion que desea abrir no esta disponible.");
				Main.pageloadHide();
			}
		});

	},
    load: function(){
		inspectorActivity.listInspectionsUser();
        Main.disablePanels(false);
    },
    listInspectionsUser:function(){
    	Main.pageloadShow();
        DB.query("SELECT id_inspuser,key_inspuser,ship_name,bo_inspuser_state,tx_inspection_title,dt_inspuser_start,dt_inspuser_end FROM SyncDataInspectionUser GROUP BY id_inspuser,key_inspuser ORDER BY bo_inspuser_state,dt_inspuser_start DESC",function(trans,result){
            var content = '';
            if(result.rows.length){
                for (var i = 0; i < result.rows.length; i++) {
                    var _id_inspuser 			=	result.rows.item(i).id_inspuser;
                    var _key_inspuser 			=	result.rows.item(i).key_inspuser;
                    var _tx_inspection_title 	=	result.rows.item(i).tx_inspection_title;
                    var _ship_name 				=	result.rows.item(i).ship_name;
                    var dt_inspuser_start		=	result.rows.item(i).dt_inspuser_start;
                    var date_ini;
                    var time_ini;

                    if(typeof dt_inspuser_start!=="undefined"){
                        date_ini = moment(dt_inspuser_start).format('DD MMM YYYY');
                        time_ini = moment(dt_inspuser_start).format('h:mm a');
                    }else{
                        date_ini = '-';
                        time_ini = '-';
                    }
                    var notsend;
                    if(result.rows.item(i).bo_inspuser_state===1){
                        notsend		=	'not-send';
                        content += '<li> <a data-id_inspuser="'+_id_inspuser+'" data-key_inspuser="' + _key_inspuser + '" class="item-link load-exist-inspection write"> <div class="dateinfo"><div>' + date_ini + '</div><div>' + time_ini + '</div></div> <div class="item-glob ' + notsend + '">  </div> <div class="item-title2">' + _tx_inspection_title + '</div><div class="item-subtitle2">' + _ship_name + '</div> </a> </li>';

                    }else{
                        notsend		=	'';
                        content += '<li> <a data-id_inspuser="'+_id_inspuser+'" data-key_inspuser="' + _key_inspuser + '" class="item-link load-exist-inspection read"> <div class="dateinfo"><div>' + date_ini + '</div><div>' + time_ini + '</div></div> <div class="item-glob ' + notsend + '"> </div> <div class="item-title2">' + _tx_inspection_title + '</div><div class="item-subtitle2">' + _ship_name + '</div></a> </li>';
                    }
				}
			}else{
                content = '<div class="content-block-title" style="text-align:center;">Usted no cuenta con inspecciones disponibles</div>';
			}
            $$("#listInspector ul").html(content);
            Main.pageloadHide();
		});
	}
};