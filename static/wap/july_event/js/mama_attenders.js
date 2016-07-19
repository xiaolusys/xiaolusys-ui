//var BASE_URL = 'http://192.168.1.56:8002';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

function renderHeader(data) {
    var content = [];
    content.push('<div style="text-align:center"><h3>小鹿妈妈聚100万粉丝活动</h3><div>');
    content.push('<div class="admin-header"><div class="admin-head-img"><img src="'+data.head_img_url+'" class="img-circle" style="height:100%;"</></div>');
    content.push('<div style="margin-top:10px"><p>活动辅导员：<a href="/mall/activity/summer/mat/success">'+data.nick+'</a></p></div>');
    content.push('<div><p>报名妈妈数：<span style="font-weight:bold">'+data.groups_count + '/' + data.all_groups_count+'人</span></p></div></div>');
    content.push('<hr/>');
    $("#id-header").append(content.join(''));
}

function renderGroups(data) {
    var arr = data
    for(var i=0; i<arr.length; i++) {
        var content = [];
        content.push('<div class="attender-row">');
        content.push('<div class="attender-left">');
        content.push('<img src="'+arr[i].head_img_url+'" class="img-circle" style="height:100%;">');
        content.push('</div><div class="attender-middle">');
        content.push('<p class="attender-name">'+arr[i].nick+'</p>');
        content.push('<p>群编号：'+arr[i].group_uni_key+' &nbsp; &nbsp;<a href="mama_qr_code.html?group_id=' + arr[i].group_uni_key + '">签到码</a></p>');
        content.push('</div><div class="attender-right">');
        content.push('<p class="signup-status"><a href="/sale/weixingroup/liangxi/join?group_id='+arr[i].group_uni_key+''">签到' + arr[i].fans_count + '人</a></p>');
        content.push('<p>'+arr[i].modified_display+'</p>');
        content.push('</div></div>');
        $("#id-mamagroups").append(content.join(''));
    }
}

function loadMamaGroups(union_id) {
    var record_url = '/sale/weixingroup/mamagroups/'+union_id+'/groups';
    var url = BASE_URL + record_url;
    
    var callback = function (res) {
        if (res) {
            console.log(res);
            var admin_data = res["admin"];
            var group_data = res["groups"];
            
            renderHeader(admin_data);
            renderGroups(group_data);
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
    var union_id = getParamValue("unionid");
    loadMamaGroups(union_id);
});

