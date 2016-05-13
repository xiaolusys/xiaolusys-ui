//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';


function loadInstructors(unionid) {
    var record_url = '/rest/lesson/instructor?unionid='+unionid;
    var url = BASE_URL + record_url;
    var callback = function (res) {
        if (res) {
            var arr = res.results
            
            for(var i=0; i<arr.length; i++) {
                var content = [];

                if (arr[i].status == 1) {
                    content.push('<div class="attender-row">');
                } else {
                    content.push('<div class="attender-row duplicate">');
                }
                content.push('<div class="attender-left">');
                content.push('<img src="'+arr[i].image+'" class="img-circle" style="height:100%;">');
                content.push('</div><div class="attender-middle">');
                content.push('<p class="attender-name">'+arr[i].name+'</p>');
                content.push('<p>'+arr[i].apply_date+'</p>');
                content.push('</div><div class="attender-right">');
                content.push('<p class="signup-status">'+arr[i].status_display+'</p>');
                content.push('</div></div>');
                $("#id-instructor-list").append(content.join(''));
            }
        }
    };
    $.ajax({url:url, success:callback});
}

function getUnionIdParam() { 
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    
    if (url.indexOf("?") != -1) { 
        var str = url.substr(1); 
        strs = str.split("&"); 
        for(var i = 0; i < strs.length; i ++) {
            pair = strs[i].split("=")
            if (pair[0] == 'unionid') {
                return pair[1];
            }
        } 
    } 
    return null;
}

$(document).ready(function() {
    var union_id = getUnionIdParam();
    console.log(union_id);
    loadInstructors(union_id);
});

