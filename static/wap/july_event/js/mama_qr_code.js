//var BASE_URL = 'http://192.168.1.56:8001';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

function renderHeader(data) {
    var content = [];
    content.push('<div style="text-align:center"><h3>小鹿妈妈聚100万粉丝活动</h3><div>');
    content.push('<div class="admin-header"><div class="admin-head-img"><img src="'+data.head_img_url+'" class="img-circle" style="height:100%;"</></div>');
    content.push('<div style="margin-top:10px"><p>小鹿妈妈：'+data.nick+'</p></div>');
    content.push('<hr/>');
    $("#id-header").append(content.join(''));
}

function renderQrCode(group_id) {
    $("#id-qr-code").append('<img id="id-qrcode" src="/sale/weixingroup/mamagroups/' + group_id + '/qr_code">');
}
function renderMamaNick(nick){
    $("#mama_nick").html(nick);
}

function loadMamaGroup(group_id) {
    var record_url = '/sale/weixingroup/mamagroups/'+group_id+'/detail';
    var url = BASE_URL + record_url;
    
    var callback = function (res) {
        if (res) {
            console.log(res);
            renderHeader(res);
            renderMamaNick(res.nick);
        }
    };
    $.ajax({url:url, success:callback});
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
    var group_id = getParamValue("group_id");
    renderQrCode(group_id);
    loadMamaGroup(group_id);
});

