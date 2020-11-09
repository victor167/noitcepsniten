var resumenInspeccionActivity = 
{
	ini: function() {
		$$('#leyenda-picker-modal').on('click', function() {
		    myApp.pickerModal('#leyenda-picker-modal-action');
		});
	},
	createContent: function(content,title,color,icon)
    {
        return '<li> <div class="item-content"> <div class="item-media"> <i class="material-icons" style="color:' + color + ';">' + icon + '</i> </div> <div class="item-inner" style="margin: 0;"> <div class="item-title">' + title + '</div> <div class="item-after">' + content + '</div> </div> </div> </li>';
    },
	load: function() {
		$$("#contentInspectionSummary").html('<div class="loading" style="margin-top:20px;"></div>');
        if(!inspectionWrite)
        {
            $$(".SubNavbarInfo").parent().parent().addClass("readonly");
        }

        var idi = $$("#id_inspuser").val();
        if(idi==""||idi==0)
        {
            idi=id_inspuser;
        }
        
    	Main.restFul(
    		API + 'api/InspectionSummary',
    		'GET',
        	{
        		id_inspuser: idi,
        	},
        	function(respondBody,respondHeader)
        	{
        		if(typeof respondBody.success !=='undefined' && respondBody.success)
        		{

                    var content = '';
                    if(respondBody.data.length>0)
                    {
						$$('div[data-page="resumenInspeccion"].page .navbar .center').html(respondBody.data[0].inspection_title);
                    	$$('div[data-page="resumenInspeccion"].page .titleship').html(": " + respondBody.data[0].ship_name + '<div class="title">Nave </div>');
                    	$$('div[data-page="resumenInspeccion"].page .titlecapitan').html(": " + respondBody.data[0].captain_name + '<div class="title">Capitán </div>');
                    	
                    	var countCategories = 0;
                        for (var i = 0; i < respondBody.data.length; i++) 
                        {
                        	if(respondBody.data[i].category_id!=0)
                        	{
	                            content += '<div class="content-block-title" style="font-size: 1.3em;font-weight: bold;color: #686868;">' + respondBody.data[i].category_title + '</div>';
	                            content += '<div class="list-block" style="margin:0;"><ul>';
	                            content += resumenInspeccionActivity.createContent(respondBody.data[i].question,'Preguntas','#939393','&#xE8AF;');
	                            content += resumenInspeccionActivity.createContent(respondBody.data[i].observation,'Observaciones','#939393','&#xE0D8;');
	                            content += resumenInspeccionActivity.createContent(respondBody.data[i].photos,'Fotos','#939393','&#xE412;');

	                            content += '</ul> </div>';
	                            countCategories++;
                        	}
                        }
                        if(countCategories==0)
                        {
                        	content = '<div class="content-block-title" style="text-align:center;">Esta inspeccion no cuenta con categorias</div>';
                        }
                    }
                    $$("#contentInspectionSummary").html(content);
        		}
        		else
        		{
        			alert('Lo sentimos ocurrio un errorX');
        		}
        	}
    	);
	}
};