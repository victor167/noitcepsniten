var loginActivity =
{
    ini: function() {
        Main.keyPressCode('#contentLogin #username',13,function(){
            $$("#contentLogin #password").focus();
        });

        Main.keyPressCode('#contentLogin #password',13,function(){
            loginActivity.sendLogin();
        });
    },
    load: function(){
        Main.disablePanels(true);
        $$('#contentLogin input#username,#contentLogin input#password').on('focus',function(){
            $$(this).parent().addClass('active');
        });

        $$('#contentLogin input#username,#contentLogin input#password').on('focusout',function(){
            if(($$(this).val()).length==0)
            {
                $$(this).parent().removeClass('active');
            }
        });
        $$('#contentLogin #btnIngresarLogin').on('click',loginActivity.sendLogin);

        Main.select('#masterlogin').show();
    },
    sendLogin: function()
    {
        var result = Main.validateInput(
            {
                inputs:{
                    "#username":{
                        required: [
                            true,
                            '¡Por favor introduzca su usuario!',
                        ],
                        minlength: [
                            2,
                            'Ingrese al menos {0} caracteres requeridos!',
                        ],
                        maxlength: [
                            15,
                            'Ingrese como maximo {0} caracteres!'
                        ]
                    },
                    "#password":{
                        required: [
                            true,
                            '¡Por favor introduzca su contraseña!',
                        ],
                        minlength: [
                            4,
                            'Contraseña invalida, minimo {0} caracteres!',
                        ]
                    }
                }
            }
        );

        if(result)
        {
            var user = $$("#username").val();
            var password = $$("#password").val();


            Main.backgroundTopShow("Iniciando sesión...");
            Main.restFul(
                API + 'api/user',
                'POST',
                {"txtAuthName": user,"txtAuthPass": password},
                function(respondBody,respondHeader)
                {
                    if(typeof respondBody.success !=='undefined' && respondBody.success)
                    {
                        if(typeof respondBody.data.login !=='undefined' && respondBody.data.login)
                        {
                            var token = respondHeader.getResponseHeader('Token');

                            if(typeof token !== 'undefined')
                            {
                                var namePerson='';
                                if(typeof respondBody.data.namePerson !=='undefined')
                                {
                                    namePerson	=	respondBody.data.namePerson;
                                }
                                var profile='';
                                if(typeof respondBody.data.profile !=='undefined')
                                {
                                    profile	=	respondBody.data.profile;
                                }
                                var idUser='0';
                                if(typeof respondBody.data.idUser !=='undefined')
                                {
                                    idUser	=	respondBody.data.idUser;
                                }
                                var idCompany='0';
                                if(typeof respondBody.data.idCompany !=='undefined')
                                {
                                    idCompany	=	respondBody.data.idCompany;
                                }

                                DB.process(
                                    [
                                        "UPDATE session SET value='1' WHERE name='connect'",
                                        "UPDATE session SET value='" + token + "' WHERE name='token'",
                                        "UPDATE session SET value='" + user + "' WHERE name='user'",
                                        "UPDATE session SET value='" + idUser + "' WHERE name='idUser'",
                                        "UPDATE session SET value='" + idCompany + "' WHERE name='idCompany'",
                                        "UPDATE session SET value='" + namePerson + "' WHERE name='namePerson'",
                                        "UPDATE session SET value='" + profile + "' WHERE name='profile'"
                                    ],
                                    function(){
                                        loginActivity.loginSuccess();
                                    },
                                    function(error, statement){
                                        console.error("Error: " + error.message + " when processing " + statement);
                                    }
                                );
                            }
                        }
                        else
                        {
                            alert('Usuario o contraseña incorrecto');
                            Main.backgroundTopHide();
                        }
                    }
                    else if(typeof respondBody.offline !=='undefined' && respondBody.offline)
                    {
                        alert('Es necesario internet para identificarse');
                        Main.backgroundTopHide();
                    }
                    else
                    {
                        alert('El servicio AIS, no se encuentra disponible');
                        Main.backgroundTopHide();
                    }

                }
            );
        }
        $$('#password').blur();
    },
    loginSuccess: function(){
        $$("#username").val("");
        $$("#password").val("");

        initialize.ini();
    }
};