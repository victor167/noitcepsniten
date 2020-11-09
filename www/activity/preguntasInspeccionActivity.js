var id_mastertable_questype = 	1;
var filesObservation		=	{};
var preguntasInspeccionActivity = 
{
	ini: function() {
		Main.keyPressCode('body',39,function(){
		    $$(".activeQuestionView .swiper-button-next").click();
		});

		Main.keyPressCode('body',37,function(){
			$$(".activeQuestionView .swiper-button-prev").click();
		});

		$$(document).on("click",".rowa-comment-photo-embed:not(.disabledx)",function(){
			mainView.router.load({
				'url':'layout/fotoComentInspeccion.html'
			});
		});
		$$("body").on("click",'li.rowquestion .badge',function(e){
		    //console.log(".inspection_pregunta");
			var li = $$(this).closest("li");
			id_inspsurvques 	= parseInt(li.attr("data-idinspsurvques"));
			id_inspsurv 		= parseInt(li.attr("data-idinspsurv"));
			id_inspusersurvques = parseInt(li.attr("data-idinspusersurvques"));

			li.parent().find("li").removeClass("check");
            li.addClass("check");

            badge_apply_option_text(li.find(".badge"));
            if(inspectionWrite){
            	myApp.actions(this, preguntasInspeccionActivity.actionSheetApplyInspection);
            	e.stopImmediatePropagation();
            }
		});

        $$("body").on("click",".inspection_pregunta .rowquestionandquestion",function(){
            var li = $$(this).closest("li");
            li.parent().find("li").removeClass("check");
            li.addClass("check");
        });

		$$("body").on("click",".inspection_pregunta .questionInspectionCell",function(e){

			var li = $$(this).closest("li");
			id_inspsurvques 	= parseInt(li.attr("data-idinspsurvques"));
			id_inspsurv 		= parseInt(li.attr("data-idinspsurv"));
			id_inspusersurvques = parseInt(li.attr("data-idinspusersurvques"));

			li.parent().find("li").removeClass("check");
            li.addClass("check");

            if(li.find(".badge").hasClass("notapply")){
            	badge_apply_option_text(li.find(".badge"));
            	e.stopImmediatePropagation();
            }else{
            	if(!li.hasClass("lleno") && inspectionWrite){
					myApp.actions(this, preguntasInspeccionActivity.actionSheetApplyInspection);
				}else{
					badge_apply_option_text(li.find(".badge"));
					mainView.router.load({
						'url':'layout/fotoComentInspeccion.html'
					});
				}
            }
		});
	},
	actionSheetApplyInspection: [
		[
			{
	            text: 'Sobre la pregunta',
	            label: true
	        },
	        {
	            text: 'Aplica, si tiene',
	            color: 'green',
	            onClick: function(){
					
					var apply 		=	11;
					var latitud 	=	"";
					var longitud 	=	"";

					if(typeof location!=="undefined" && typeof location.coords!=="undefined" && typeof location.coords.longitude!=="undefined" && typeof location.coords.latitude!=="undefined")
					{
						latitud 	=	location.coords.latitude;
						longitud 	=	location.coords.longitude;
					}

					Buffer.ins_question_option(id_inspuser,key_inspuser,id_inspsurvques,apply,latitud, longitud,function(){
						DB.query('UPDATE SyncDataInspectionUser SET bo_inspusersurvques_apply=1,bo_inspusersurvques_answer_option=1 WHERE id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurvques=' + id_inspsurvques);
						DB.query('select id_mastertable_questype from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurvques=' + id_inspsurvques,function(trans,result){
							if(result.rows.length)
							{
								var row 				= result.rows.item(0);
								id_mastertable_questype = row.id_mastertable_questype;
								$$(".swiper-slide-active .certificados-color").removeClass("disabled");
								$$(".swiper-slide-active .rowa-comment-photo-embed").removeClass("disabledx");

								var badge = $$('.page.page-on-center .inspection_pregunta ul li.check .badge');
								var badgeexist = badge.hasClass('applyhast') || badge.hasClass('applyhastnot') || badge.hasClass('notapply');
								badge.addClass("applyhast").removeClass("applyhastnot notapply");
								badge.html("");

								$$(".questionBadgeQuestion").addClass("empty");
                                util.timeout(function(){
									categoriaInspeccionActivity.countPreg(id_inspsurv,function(){
										categoriaInspeccionActivity.saveCountCat(id_inspsurv,function(){
											preguntasInspeccionActivity.getCountsQuestions();
											categoriaInspeccionActivity.countCat();

											preguntasInspeccionActivity.checkQuestionRespond();

										});
									});
                                });
							}
							else
							{
								alert("Lo sentimos ocurrio un error con la inspeccion");
							}
						});
					});
				}
        	},
        	{
	            text: 'Aplica, no tiene',
	            color: 'amber',
	            onClick: function(){
					
					var apply 		=	12;
					var latitud 	=	0;
					var longitud 	=	0;

					if(typeof location!=="undefined" && typeof location.coords!=="undefined" && typeof location.coords.longitude!=="undefined" && typeof location.coords.latitude!=="undefined")
					{
						latitud 	=	location.coords.latitude;
						longitud 	=	location.coords.longitude;
					}
					//OfflineInspection.question_change
					Buffer.ins_question_option(id_inspuser,key_inspuser,id_inspsurvques,apply,latitud, longitud,function(){
						DB.query('UPDATE SyncDataInspectionUser SET bo_inspusersurvques_apply=1,bo_inspusersurvques_answer_option=2 WHERE id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurvques=' + id_inspsurvques);
		        			DB.query('select id_mastertable_questype from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurvques=' + id_inspsurvques,function(trans,result){
		        				if(result.rows.length)
								{
									var row 				= result.rows.item(0);
									id_mastertable_questype =  row.id_mastertable_questype;
									$$(".swiper-slide-active .certificados-color").removeClass("disabled");
									$$(".swiper-slide-active .rowa-comment-photo-embed").removeClass("disabledx");
									

									var badge = $$('.page.page-on-center[data-page="swiper-horizontal"] .inspection_pregunta ul li.check .badge');
									var badgeexist = badge.hasClass('applyhast') || badge.hasClass('applyhastnot') || badge.hasClass('notapply');
									badge.addClass("applyhastnot").removeClass("applyhast notapply");
                                    badge.html("");

									if(!badgeexist){
										badge_apply_option_text(badge);
										mainView.router.load({
											'url':'layout/fotoComentInspeccion.html'
										});
									}

									$$(".questionBadgeQuestion").addClass("empty");
                                    util.timeout(function() {
                                        categoriaInspeccionActivity.countPreg(id_inspsurv, function () {
                                            categoriaInspeccionActivity.saveCountCat(id_inspsurv, function () {
                                                //console.log("CountCat");
                                                preguntasInspeccionActivity.getCountsQuestions();
                                                categoriaInspeccionActivity.countCat();

                                                preguntasInspeccionActivity.checkQuestionRespond();
                                            });
                                        });
                                    });
								}
								else
								{
									alert("Lo sentimos ocurrio un error con la inspeccion");
								}
		        			});
					});
				}
        	},
        	{
	            text: 'No Aplica',
	            color: 'red',
	            onClick: function(){
					var apply 		=	20;
					var latitud 	=	0;
					var longitud 	=	0;

					if(typeof location!=="undefined" && typeof location.coords!=="undefined" && typeof location.coords.longitude!=="undefined" && typeof location.coords.latitude!=="undefined")
					{
						latitud 	=	location.coords.latitude;
						longitud 	=	location.coords.longitude;
					}

                    Buffer.ins_question_option(id_inspuser,key_inspuser,id_inspsurvques,apply,latitud, longitud,function(){
						DB.query('UPDATE SyncDataInspectionUser SET bo_inspusersurvques_apply=2,bo_inspusersurvques_answer_option=0 WHERE id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurvques=' + id_inspsurvques);
		        			DB.query('select id_mastertable_questype from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurvques=' + id_inspsurvques,function(trans,result){
		        				if(result.rows.length)
								{
									var row 				= result.rows.item(0);
									id_mastertable_questype =  row.id_mastertable_questype;
									$$(".swiper-slide-active .certificados-color").removeClass("disabled");
									$$(".swiper-slide-active .rowa-comment-photo-embed").removeClass("disabledx");
									
									var badge = $$('.page.page-on-center[data-page="swiper-horizontal"] .inspection_pregunta ul li.check .badge');
									badge.addClass("notapply").removeClass("applyhast applyhastnot");
                                    badge.html("");

									badge_apply_option_text(badge);

									$$(".questionBadgeQuestion").addClass("empty");

									util.timeout(function(){
                                        categoriaInspeccionActivity.countPreg(id_inspsurv,function(){
                                            categoriaInspeccionActivity.saveCountCat(id_inspsurv,function(){
                                                //console.log("CountCat");
                                                preguntasInspeccionActivity.getCountsQuestions();
                                                categoriaInspeccionActivity.countCat();
                                                preguntasInspeccionActivity.checkQuestionRespond();
                                            });
                                        });
									},400);

								}
								else
								{
									alert("Lo sentimos ocurrio un error con la inspeccion");
								}
		        			});
					});
				}
        	}
		],
		[
			{
            	text: 'Cancelar',
                color: 'black',
            	onClick: function(){
            		id_inspsurvques = 0;
            		id_inspusersurvques = 0;
            	}
        	}
		]
	],
	questionGenerate: function(max,minmax,id_inspsurv,id_inspsurvques,id_inspusersurvques,son,callback){
    	id_inspusersurvques = (id_inspusersurvques == '' || id_inspusersurvques == null)? 0:id_inspusersurvques;
    	son = (son == '' || son == null)? 0:son;
    	preguntasInspeccionActivity.question(max,minmax,id_inspsurv,id_inspsurvques,id_inspusersurvques,son,function(question){
			preguntasInspeccionActivity.questionAndSubQuestionRender(question,id_inspsurvques,id_inspusersurvques);
		});
	},
	question: function(_max,_minmax,_id_inspsurv,_id_inspsurvques,_id_inspusersurvques,_son,_callback){
		var questions  = [];
		id_inspsurv = _id_inspsurv;
		var query;
		if(_id_inspsurvques==0)
		{
			query 		=	'select id_inspusersurvques,id_inspsurvques,id_inspsurvques_fk,tx_inpsurvques_decription,nu_inspsurvques_level,nu_inspsurvques_son,bo_inspusersurvques_apply,bo_inspusersurvques_answer_option from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurv='+_id_inspsurv+' and nu_inspsurvques_level='+_minmax+' group by id_inspsurvques ORDER BY id_inspsurvques,id_inspsurvques_fk';
		}
		else if(_son==0)
		{
			query 		=	'select id_inspusersurvques,id_inspsurvques,id_inspsurvques_fk,tx_inpsurvques_decription,nu_inspsurvques_level,nu_inspsurvques_son,bo_inspusersurvques_apply,bo_inspusersurvques_answer_option from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurv='+_id_inspsurv+' and id_inspsurvques='+_id_inspsurvques+' group by id_inspsurvques ORDER BY id_inspsurvques,id_inspsurvques_fk';
		}
		else
		{
			query 		=	'select id_inspusersurvques,id_inspsurvques,id_inspsurvques_fk,tx_inpsurvques_decription,nu_inspsurvques_level,nu_inspsurvques_son,bo_inspusersurvques_apply,bo_inspusersurvques_answer_option from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurv='+_id_inspsurv+' and nu_inspsurvques_level='+_minmax+' and id_inspsurvques_fk='+_id_inspsurvques+' group by id_inspsurvques ORDER BY id_inspsurvques,id_inspsurvques_fk';
		}

		DB.query(query,function(trans,result){
			if(result.rows.length){
				for (var i = 0; i < result.rows.length; i++){
					var row 	= result.rows.item(i);
					var _applyoption = '';
					var _applyoptiontext = '';
					var _apply 	= parseInt(row.bo_inspusersurvques_apply);
					var _option 	= parseInt(row.bo_inspusersurvques_answer_option);

					if(_apply==1){
						_applyoption = parseInt(_apply + '' + ((_option==2)? 2:1));
						_applyoptiontext = (_option==2)? 'applyhastnot' : 'applyhast';
					}else if(_apply==2){
						_applyoption = parseInt(_apply + '0');
						_applyoptiontext = 'notapply';
					}else{
						_applyoption = 0;
					}

					questions.push({
						id_inspsurv: _id_inspsurv,
						id_inspsurvques: row.id_inspsurvques,
						id_inspsurvques_fk: row.id_inspsurvques_fk,
						tx_inpsurvques_decription: row.tx_inpsurvques_decription,
						nu_inspsurvques_level: row.nu_inspsurvques_level + 1,
						nu_inspsurvques_son: row.nu_inspsurvques_son,
						bo_inspusersurvques_apply: row.bo_inspusersurvques_apply,
						bo_inspusersurvques_answer_option: row.bo_inspusersurvques_answer_option,
						id_inspusersurvques: row.id_inspusersurvques,
						applyoption: _applyoption,
						applyoptiontext: _applyoptiontext
					});
				}
				_callback(questions);
			}else{
				_callback(questions);
			}
		});
	},
	questionAndSubQuestionRender: function(questions,id_inspsurvques,id_inspusersurvques){
		$$(".swiper-main-pagination" + id_inspsurvques).hide();
		$$(".swiper-button-prev" + id_inspsurvques).hide();
		$$(".swiper-button-next" + id_inspsurvques).hide();
		$$.get('layout/questionAndSubQuestion.mst', function(template) {
			var rendered = Mustache.render(template, 
			{
				questions: questions
			});
            $$('.activeQuestionView #inspection_pregunta' + id_inspsurvques).html(rendered);
            $$(".activeQuestionView").removeClass("activeQuestionView");
	    	util.intervalBefore(function(stop){
                var rendered_cuetion_count = $$('div.page:last-child .inspection_pregunta ul li').length;
				if(rendered_cuetion_count===questions.length){
					util.timeout(function(){
                        preguntasInspeccionActivity.getCountsQuestions();
                        preguntasInspeccionActivity.checkQuestionRespond();
                        Main.pageloadHide();
					},400);
                    stop();
				}
			},200);
		});
	},
	checkQuestionRespond: function(){
		$$(".questionBadge").each(function(){
			$$(this).removeClass("empty");
			var id = $$(this).attr("id");
			if(typeof categoriaInspeccionActivity.questResp[id] !== "undefined")
            {
            	var resp 	= categoriaInspeccionActivity.questResp[id].resp;
            	var quest 	= categoriaInspeccionActivity.questResp[id].quest;
            	if(resp==quest)
                {
                    $$(this).closest("li").addClass("lleno");
                }
                else
                {
                    $$(this).closest("li").removeClass("lleno");
                }
            }
		});
	},
	getCountsQuestions: function(){
		$$(".questionBadgeQuestion.empty").each(function(){
			$$(this).removeClass("empty");
			var id = $$(this).attr("id");
			if(typeof categoriaInspeccionActivity.questResp[id] !== "undefined")
            {
            	var resp 	= categoriaInspeccionActivity.questResp[id].resp;
            	var quest 	= categoriaInspeccionActivity.questResp[id].quest;
            	if(resp===quest)
                {
                    $$(this).closest("li").addClass("lleno");
                }
                else
                {
                    $$(this).closest("li").removeClass("lleno");
                }
                $$(this).html(resp + "/" + quest);
            }
		});
	},
	load: function() {
        Main.pageloadShow();
        tx_inspsurv_title	= $$("#tx_inspsurv_title").val();

		$$(".tx_inspsurv_title").html(tx_inspsurv_title);
		$$(".title-ship").html(ship_name);
        $$(".title-captain").html(captain_name);

        if(!inspectionWrite)
        {
            $$(".SubNavbarInfo").parent().parent().addClass("readonly");
        }
	},
	loadCounts: function(id_inspusersurvques)
	{
		if(id_inspusersurvques !=="" && typeof id_inspusersurvques !=="undefined")
		{
			if(typeof filesObservation[id_inspusersurvques] !== "undefined")
			{
				$$(".countFiles").html(filesObservation[id_inspusersurvques].length);
			}

			var queryob = 'select tx_inspusersurvques_answer_observation from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspusersurvques='+id_inspusersurvques;
			DB.query(queryob,function(transob,resultob){
				if(resultob.rows.length)
				{
					var textComent 	= 	resultob.rows.item(0).tx_inspusersurvques_answer_observation;

					if(textComent.length)
					{
						$$(".swiper-slide-active .countComment").html("1");
					}
					else
					{
						$$(".swiper-slide-active .countComment").html("0");
					}
				}
			});
		}
	},
	loadQuestion: function(minmax,id_inspsurv,id_inspsurvques,id_inspusersurvques){
		if(minmax!=="")
		{
			minmax = parseInt(minmax+"");
		}
		
		if(typeof minmax === "undefined")
		{
			minmax = "";
		}

		if(typeof id_inspsurv === "undefined")
		{
			id_inspsurv = "";
		}

        var query2;
		if(typeof id_inspsurvques === "undefined" || id_inspsurvques==="")
		{
			id_inspsurvques = 0;
			query2 	=	'select MAX(nu_inspsurvques_son) son from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurv=' + id_inspsurv;
		}
		else
		{
			query2 	=	'select MAX(nu_inspsurvques_son) son from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurv=' + id_inspsurv + ' AND id_inspsurvques=' + id_inspsurvques;
		}
		
		var query = 'select MAX(nu_inspsurvques_level) max from SyncDataInspectionUser where id_inspuser=' + id_inspuser + ' and key_inspuser="' + key_inspuser + '" and id_inspsurv=' + id_inspsurv + ' ORDER BY id_inspsurvques,id_inspsurvques_fk';
		
		DB.query(query,function(trans,result){
			if(result.rows.length)
            {
            	var max 		= result.rows.item(0).max;
            	if(minmax==="")
            	{
            		minmax 		= 1;
            	}

            	DB.query(query2,function(trans2,result2){
					if(result2.rows.length)
		            {
		            	var son 		= result2.rows.item(0).son;
		            	preguntasInspeccionActivity.questionGenerate(max,minmax,id_inspsurv,id_inspsurvques,id_inspusersurvques,son);
		            }
		        });
            }
		});
	}
};