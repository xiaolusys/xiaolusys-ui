//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

function loadMamaFortune() {
    var fortune_url = '/rest/v2/mama/fortune';
    var url = BASE_URL + fortune_url;

    var callback = function (res) {
        if (res) {
            var fortune = res['mama_fortune'];
            var extra = res['extra_info'];
            
            var content = [];
            content.push('<div><img class="img-circle" style="width:20%" src=">'+extra.thumbnail+'</></div>');
            content.push('<div><span>ID: ' + fortune.mama_id+'</span></div>');
            content.push('<div><span>店主期限:  ' + extra.surplus_days + '</span></div>');
            $("#id-profile").append(content.join(''));

            content = [];
            content.push('<div class="xlmm-carry"><b>累计收益: '+ fortune.carry_value + '元</b></div>');
            $("#id-fortune").append(content.join(''));

            if (extra.surplus_days > 15) {
                $("#id-award").hide();
            }
        }
    };
    $.ajax({url:url, success:callback});
}

function loadInviteMama(){
    
}


function getParamValue(key) { 
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    
    if (url.indexOf("?") != -1) { 
        var str = url.substr(1); 
        strs = str.split("&"); 
        for(var i = 0; i < strs.length; i ++) {
            pair = strs[i].split("=")
            if (pair[0] == key) {
                return pair[1];
            }
        } 
    } 
    return null;
}

$(document).ready(function() {
    //var openid = getParamValue("openid");
    //var appkey = getParamValue("appkey");
    
    //loadMamaFortune(openid, appkey);
    loadMamaFortune();
});

