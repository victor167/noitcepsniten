var API;
var bucket;
var AWS_MaxKeys;
var AWS_Prefix;
var AWS_SignedUrl_Expires;
var AWS_AccessKeyId;
var AWS_SecretAccessKey;
var AWS_Region;
var AWS_BucketName;

function addcss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
        s.styleSheet.cssText = css;
    } else {                // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
}

function base64_decode( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}


function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

var badge_apply_option_text = function(badge_selected){
    if(badge_selected.hasClass("applyhast")){
        applyoptiontext = "applyhast";
    }else if(badge_selected.hasClass("applyhastnot")){
        applyoptiontext = "applyhastnot";
    }else if(badge_selected.hasClass("notapply")){
        applyoptiontext = "notapply";
    }else{
        applyoptiontext = '';
    }
};

var pauseUploadChange       =   true;
var DataInitialLoad         =   false;
var SESSION                 =   {};
var UPDATE_DATABASE_COUNT   =   0;
var updated                 =   false;