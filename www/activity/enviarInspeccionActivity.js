var enviarInspeccionActivity =
{
	persons: [],
	ini: function() {

		$$(document).on("click","#listEmailSendInspection .delete",function(){
			$$(this).parent().parent().remove();
		});

		$$(document).on("click","#acs_add_email",function(){
			
			var email = ($$('a#acs_email input[type="text"]').val()).trim();
			
			if(validateEmail(email))
			{
				$$('a#acs_email input[type="text"]').val("");
				var listEmailSendInspection = [];

				$$("#listEmailSendInspection tbody tr").each(function(){
					listEmailSendInspection[listEmailSendInspection.length] = $$(this).find("td").html();
				});

				listEmailSendInspection[listEmailSendInspection.length] = email;

				var htmlListEmailSendInspection = '';
	        	for(x in listEmailSendInspection)
	        	{
	        		val = listEmailSendInspection[x];

	    			htmlListEmailSendInspection += '<tr> <td>'+val+'</td> <td style=" text-align: right; "><div class="delete"><i class="material-icons">close</i></div></td> </tr>';
	        	}

				$$("#listEmailSendInspection tbody").html(htmlListEmailSendInspection);
				$$(".btnSendInspeccion").removeAttr("disabled");
				$$("#acs_add_email").attr("disabled","disabled");
			}
			else
			{
				alert("Direccion de correo no valida.");
			}
		});

		$$(document).on("keyup","#acs_email .item-input input",function(){
			if(($$(this).val()).length>0){
				$$(".btnSendInspeccion").attr("disabled","disabled");
				$$("#acs_add_email").removeAttr("disabled");
			}else{
				$$(".btnSendInspeccion").removeAttr("disabled");
				$$("#acs_add_email").attr("disabled","disabled");
			}
		});

        var completeSendInspection = function(title) {
			setTimeout(function(){
                alert(title,function(){
                    mainView.router.back({'animatePages':false});
                    setTimeout(function(){
						Main.pageloadHide();
                        $$(".btnCategoryback").click();
                        util.timeout(inspectorActivity.listInspectionsUser,400);
                    },200);
				});
            },500);
        };

		$$(document).on("click",".btnSendInspeccion",function(){
            Main.pageloadShow();
			var sendPersons = $$('#acs_person').find('input').val();
			var type 		= $$(this).attr("data-type");
			var sendEmails 	= [];
			/*
			0:nada
			2:final
			4:cancelInspection
			*/

			$$("#listEmailSendInspection tbody tr").each(function(){
				sendEmails[sendEmails.length] = $$(this).find("td").html();
			});

			if(type==="4"){
                Buffer.ins_inspection_send_cancel(id_inspuser,key_inspuser,id_insp,function(){
                    completeSendInspection("Inspeccion cancelado correctamente");
                });
			}else{
				if(key_inspuser!=="" && id_inspuser!==0){
					DB.query('UPDATE SyncDataInspectionUser SET bo_inspuser_state=2 WHERE key_inspuser="' + key_inspuser + '" and id_inspuser=' + id_inspuser,function(){

					});
				}else if(id_inspuser>0 && key_inspuser===""){
					DB.query('UPDATE SyncDataInspectionUser SET bo_inspuser_state=2 WHERE key_inspuser="" and id_inspuser=' + id_inspuser,function(){
						
					});
				}else if(id_inspuser===0 && key_inspuser!==""){
					DB.query('UPDATE SyncDataInspectionUser SET bo_inspuser_state=2 WHERE key_inspuser="' + key_inspuser + '" and id_inspuser=' + id_inspuser,function(){

					});
				}

				Buffer.ins_inspection_send(id_inspuser,key_inspuser,id_insp,sendPersons,sendEmails.toString(),function(){
                    completeSendInspection("Se finalizo correctamente su inspeccion.");
				});
			}
		});
	},
	load: function() {
		$$(".title-inspection").html(tx_inspection_title);
		$$(".title-ship").html(ship_name);
        $$(".title-captain").html(captain_name);

        myApp.autocomplete({
	        openIn: 'page',
	        opener: $$('#acs_person'),
	        multiple: true,
	        valueProperty: 'id_user',
	        textProperty: 'NamePerson',
	        limit: 50,
	        preloader: true,
	        preloaderColor: 'white',
	        source: function(autocomplete, query, render) {
	        	autocomplete.showPreloader();
	            var results = [];
	            if (query.length === 0) {
	            	autocomplete.hidePreloader();
	                render(results);
	                return;
	            }

	            SyncData.listPerson(function(data){
                    for (var i = 0; i < data.length; i++) {
                    	var sync_nameperson 	= 	data.item(i).NamePerson.toLowerCase();
                    	var search_nameperson	=	query.toLowerCase();
                        if (sync_nameperson.indexOf(search_nameperson) >= 0){
                        	results.push(data.item(i));
                        }
                    }
                    autocomplete.hidePreloader();
                    render(results);
				});
	        },
	        onChange: function(autocomplete, value) {
				
	        	var listPersonSendInspection = '';
	        	for(x in value)
	        	{
	        		if(value.hasOwnProperty(x)){
                        var person  = value[x];
                        if(person.CountEmail==0||person.CountEmail=="0")
                        {
                            listPersonSendInspection += '<tr data-id="'+person.id_user+'"> <td>'+person.NamePerson+'</td> <td>'+person.NameProfile+'</td> <td><i class="material-icons color-red">&#xE14C;</i></td> </tr>';
                        }
                        else
                        {
                            listPersonSendInspection += '<tr data-id="'+person.id_user+'"> <td>'+person.NamePerson+'</td> <td>'+person.NameProfile+'</td> <td><i class="material-icons color-green">&#xE5CA;</i></td> </tr>';
                        }
					}
	        	}

	        	$$("#listPersonSendInspection tbody").html(listPersonSendInspection);

	            var itemText = [],
	                inputValue = [];
	            for (var i = 0; i < value.length; i++) {
	                itemText.push(value[i].NamePerson);
	                inputValue.push(value[i].id_user);
	            }
	            $$('#acs_person').find('.item-after').text(itemText.join(', '));
	            $$('#acs_person').find('input').val(inputValue.join(','));

	            autocomplete.close();
	        }
	    });

        util.timeout(Main.pageloadHide,400);
	}
};