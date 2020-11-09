var nuevaInspeccionActivity = 
{
	insertDatabaseInspection: function(data,callbackOk){
		console.log("data",data);
		var queries_data_inspection  = [];
		for (var i = 0; i < data.length; i++) 
        {
        	queries_data_inspection[i] = 'INSERT INTO SyncDataInspectionUser VALUES(';
        	var count = 0;
        	var prefix = '';
        	$$.each(data[i],function(ind,val){
        		var value;
        		if(count!==0)
        		{
					prefix = ',';
        		}
        		if(typeof val ==='number')
        		{
        			value = prefix + val;
        		}
        		else
        		{
        			value = prefix + '"' + String(val) + '"';
        		}
        		if(i===0)
        		{	

        		}
        		count++;

        		queries_data_inspection[i] += value;
        	});
        	queries_data_inspection[i] += ')';
        }
        html5sql.process(
	         queries_data_inspection,
	         function(){
	         	callbackOk();
	         },
	         function(error, statement)
	         {
	         	console.error("Error: " + error.message + " when processing " + statement);
	            
	            alert("Lo sentimos ocurrio un error en el sistema");
	            Main.backgroundTopHide();
	         }        
	     );
	},
	ini: function() {
		$$(document).on("click",".popover-nave .select-nave",function(e){
			setTimeout(function(){
				$$("#acs_barco_2").removeClass("visible");
				$$("#acs_barco").addClass("visible");
				$$("#acs_barco").click();
			},100);
		});
		$$(document).on("click",".popover-nave .add-nave",function(e){
			$$("#acs_barco_2").addClass("visible");
			$$("#acs_barco").removeClass("visible");
			$$("#acs_nave_2_text").val("").focus();
		});

		$$(document).on("click",".popover-capitan .select-capitan",function(e){
			setTimeout(function(){
				$$("#acs_capitan_2").removeClass("visible");
				$$("#acs_capitan").addClass("visible");
				$$("#acs_capitan").click();
			},100);
		});
		$$(document).on("click",".popover-capitan .add-capitan",function(e){
			$$("#acs_capitan_2").addClass("visible");
			$$("#acs_capitan").removeClass("visible");
			$$("#acs_capitan_2_text").val("").focus();
		});


		$$(document).on("click","#btnCreateInspection",function(e){

			var error_not_complete 	= 	0;
			var _id_inspection		=	0;
			var _id_ship			=	0;
			var _id_captain			=	0;
			var _id_branch			=	0;
			var _tx_inspection_name	=	"";
			var _tx_ship			=	"";
			var _tx_captain			=	"";

			_id_inspection 			= 	$$(".smart-select-type-inspection").val();
			_id_branch 				= 	$$(".smart-select-sede").val();
			_tx_inspection_name		=	$$(".smart-select-type-inspection option:checked").text();

			if($$("#acs_barco").hasClass("visible")){
				_id_ship = $$('#acs_barco [type="hidden"]').val();
				_tx_ship = $$('#acs_barco .item-after').html();
				if(_id_ship==="") error_not_complete = 1;
			}else{
				_tx_ship = $$('#acs_nave_2_text').val().trim();
				if(_tx_ship==="") error_not_complete = 1;
			}

			if($$("#acs_capitan").hasClass("visible")){
				_id_captain = $$('#acs_capitan [type="hidden"]').val();
				_tx_captain = $$('#acs_capitan .item-after').html();
				if(_id_captain==="") error_not_complete = 2;
			}else{
				_tx_captain = $$('#acs_capitan_2_text').val().trim();
				if(_tx_captain==="") error_not_complete = 2;
			}

			if(error_not_complete===0 && parseInt(_id_inspection)>0 && parseInt(_id_branch)>0)
			{
				myApp.confirm('¿Realmente desea iniciar una nueva inspeccion?', '',function() {
					Main.pageloadShow();

					Buffer.ins_inspection_create(_id_inspection,_id_ship,_id_captain,_id_branch,_tx_inspection_name,_tx_ship,_tx_captain,function(data_inspection){
                        inspectionWrite = true;
						Main.pageloadHide();

                        mainView.router.load({
                            'url':'layout/categoriaInspeccion.html',
                            'context':{back:"btnCategoryback"}
                        });
                    });
	        	});
			}else{
				alert("Complete todos los campos necesarios");
			}
		});
	},
	load:function(){
        /////////////////////////////////////////////INI LISTA TIPO DE INSPECCION
        if(!$$(".smart-select-type-inspection option").length){
            var selected_listInspectionType=true;
            SyncData.listInspectionType(function(data){
                $$.each(data,function(trans,result){
                    if(selected_listInspectionType)
                    {
                        $$(".smart-select-type-inspection").parent().find(".smart-select-value").html(result.name);
                        selected_listInspectionType=false;
                    }
                    myApp.smartSelectAddOption('.smart-select-type-inspection', '<option value="' + result.id + '">' + result.name + '</option>');
                });
            });
        }
        /////////////////////////////////////////////END LISTA TIPO DE INSPECCION

        /////////////////////////////////////////////INI LISTA DE SEDES
        if(!$$(".smart-select-sede option").length)
        {
            var selected_listsede=true;
            SyncData.listBranch(function(data) {
                $$.each(data, function (trans, result) {
                    if (selected_listsede) {
                        $$(".smart-select-sede").parent().find(".smart-select-value").html(result.name);
                        selected_listsede = false;
                    }
                    myApp.smartSelectAddOption('.smart-select-sede', '<option value="' + result.id + '">' + result.name + '</option>');
                });
            });
        }
        /////////////////////////////////////////////END LISTA DE SEDES

        /////////////////////////////////////////////INI LISTA DE NAVES
        myApp.autocomplete({
            openIn: 'page',
            opener: $$('#acs_barco'),
            multiple: false,
            valueProperty: 'id',
            textProperty: 'name',
            preloader: true,
            preloaderColor: 'white',
            backOnSelect:true,
            onOpen: function()//--autocomplete
            {
                $$('input[type="search"]').val("*").trigger("keypress");
            },
            source: function(autocomplete, query, render) {
                if(query==="*")
                {
                    $$('input[type="search"]').val("").trigger("keypress");
                }
                else
                {
                    var results = [];
                    autocomplete.showPreloader();
                    SyncData.listShip(function(data){
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
                            	results.push(data[i]);
                        }
                        autocomplete.hidePreloader();
                        render(results);
					});

                }
            },
            onChange: function(autocomplete, value) {
                var itemText = [],
                    inputValue = [];
                for (var i = 0; i < value.length; i++) {
                    itemText.push(value[i].name);
                    inputValue.push(value[i].id);
                }
                $$('#acs_barco').find('.item-after').text(itemText.join(', '));
                $$('#acs_barco').find('input').val(inputValue.join(', '));
                autocomplete.close();
            }
		});
        /////////////////////////////////////////////END LISTA DE NAVES

        /////////////////////////////////////////////INI LISTA DE CAPITANES
        myApp.autocomplete({
            openIn: 'page',
            opener: $$('#acs_capitan'),
            multiple: false,
            valueProperty: 'id',
            textProperty: 'name',
            limit: 50,
            preloader: true,
            preloaderColor: 'white',
            backOnSelect:true,
            onOpen: function()//--autocomplete
            {
                $$('input[type="search"]').val("*").trigger("keypress");
            },
            source: function(autocomplete, query, render) {
                if(query==="*")
                {
                    $$('input[type="search"]').val("").trigger("keypress");
                }
                else
                {
                    var results = [];
                    autocomplete.showPreloader();
                    SyncData.listCaptain(function(data){
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
                            	results.push(data[i]);
                        }
                        autocomplete.hidePreloader();
                        render(results);
					});
                }
            },
            onChange: function(autocomplete, value) {
                var itemText = [],
                    inputValue = [];
                for (var i = 0; i < value.length; i++) {
                    itemText.push(value[i].name);
                    inputValue.push(value[i].id);
                }
                $$('#acs_capitan').find('.item-after').text(itemText.join(', '));
                $$('#acs_capitan').find('input').val(inputValue.join(', '));
                autocomplete.close();
            }
        });
        /////////////////////////////////////////////END LISTA DE CAPITANES
		util.timeout(function(){
            Main.pageloadHide();
		},400);
	}
};