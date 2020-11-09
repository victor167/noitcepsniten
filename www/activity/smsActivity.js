var smsActivity = 
{
	ini: function() {

	},
	load: function() {

	},
	sendSms: function() {
		if (isMobile() && isIOS() && window.device) {
			alert("Envio de mensaje no permitido");
		}
		else
		{
			var number = $$("#numberTxt").val();
        	var message = $$("#messageTxt").val();

        	var options = {
            	replaceLineBreaks: false,
            	android: {
                	intent: ''
            	}
        	};

        	var success = function () { alert('Message sent successfully'); };
        	var error = function (e) { alert('Message Failed:' + e); };
        	sms.send(number, message, options, success, error);
		}
    }
};