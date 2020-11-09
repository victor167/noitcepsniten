var enviarInspeccionResumenActivity =
{
	persons: [],
	ini: function() {
		$$(document).on("click","#listEmailSendInspectionResumen .delete",function(){
			$$(this).parent().parent().remove();
		});

		$$(document).on("click","#acs_add_email_resumen",function(){
			
			var email = ($$('a#acs_email_resumen input[type="text"]').val()).trim();
			//console.log("EMAIL_RESUMEN",email);
			if(validateEmail(email))
			{
				$$('a#acs_email_resumen input[type="text"]').val("");
				var listEmailSendInspectionResumen = [];

				$$("#listEmailSendInspectionResumen tbody tr").each(function(){
					listEmailSendInspectionResumen[listEmailSendInspectionResumen.length] = $$(this).find("td").html();
				});

				listEmailSendInspectionResumen[listEmailSendInspectionResumen.length] = email;

				var htmllistEmailSendInspectionResumen = '';
	        	for(x in listEmailSendInspectionResumen)
	        	{
	        		val = listEmailSendInspectionResumen[x];

	    			htmllistEmailSendInspectionResumen += '<tr> <td>'+val+'</td> <td style=" text-align: right; "><div class="delete"><i class="material-icons">close</i></div></td> </tr>';
	        	}

				$$("#listEmailSendInspectionResumen tbody").html(htmllistEmailSendInspectionResumen);
				$$(".btnSendEmailReport").removeAttr("disabled");
				$$("#acs_add_email_resumen").attr("disabled","disabled");
			}
			else
			{
				alert("Direccion de correo no valida.");
			}

		});

		$$(document).on("keyup","#acs_email_resumen .item-input input",function(){
			if(($$(this).val()).length>0){
				$$(".btnSendEmailReport").attr("disabled","disabled");
				$$("#acs_add_email_resumen").removeAttr("disabled");
			}else{
				$$(".btnSendEmailReport").removeAttr("disabled");
				$$("#acs_add_email_resumen").attr("disabled","disabled");
			}
		});

		$$(document).on("click",".btnSendEmailReport",function(){
			
			Main.internet(function(){

				var sendPersons = $$('#acs_person').find('input').val();
				var type 		= 0;

				var sendEmails = [];

				$$("#listEmailSendInspectionResumen tbody tr").each(function(){
					sendEmails[sendEmails.length] = $$(this).find("td").html();
				});

				Main.pageloadShow();

				Main.restFul(
					API + 'api/Inspection',
					'PUT',
					{
						id_inspuser:id_inspuser,
						respInspection: sendPersons,
						respEmail: sendEmails.toString(),
						type:type
					},
					function(respondBody,respondHeader)
					{
						if(typeof respondBody.success !=='undefined' && respondBody.success)
						{
							if(typeof respondBody.data !=='undefined')
							{
								try
								{
									alert("Correo(s) enviado correctamente",function(){
										mainView.router.back({'animatePages':false});
										setTimeout(function(){
											$$(".btnCategoryback").click();
											//inspectorActivity.changePicker();
											//Main.backgroundTopHide();
											Main.pageloadHide();
										},200);
									});
								}
								catch(err)
								{
									//console.log(err);
								}

							}
							else
							{
								alert('Lo sentimos ocurrio un error');
							}
						}
					},
					0
				);

			},function(){
				alert("Es necesario internet para realizar esta funcion");
			});

			

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