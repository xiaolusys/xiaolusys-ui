//var BASE_URL = 'http://127.0.0.1:8000';
var BASE_URL = 'http://staging.xiaolumeimei.com';
var global_lesson_id = null;

function loadLessonInfo(lesson_id) {
    var lesson_url = '/rest/lesson/lesson/get_lesson_info?lesson_id=' + lesson_id;
    var url = BASE_URL + lesson_url;

    var callback = function (res) {
        if (res) {
            var data = res;
            var content = [];
            content.push('<h3>'+data.title+'</h3>');
            content.push('<div><div class="course-time"><p>时间：'+data.start_time_display+'</p></div>');
            content.push('<div class="signup-number"><p>签到：<span style="font-weight:bold">'+data.num_attender+'人</span></p></div></div>');
            content.push('<div class="course-time"><p>授课：'+data.instructor_name+'&nbsp;'+data.instructor_title+'</p></div>');
            $("#id-lesson").append(content.join(''));
        }
    };
    $.ajax({url:url, success:callback});
}

function loadLessonAttendRecord(params) {
    var record_url = '/rest/lesson/lessonattendrecord'+params;
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
                content.push('<img src="'+arr[i].student_image+'" class="img-circle" style="height:100%;">');
                content.push('</div><div class="attender-middle">');
                content.push('<p class="attender-name">'+arr[i].student_nick+'</p>');
                content.push('<p>'+arr[i].signup_time+'</p>');
                content.push('</div><div class="attender-right">');
                content.push('<p class="signup-status">'+arr[i].status_display+'</p>');
                content.push('<p>'+arr[i].signup_date+'</p>');
                content.push('</div></div>');
                $("#id-attender-list").append(content.join(''));
            }
        }
    };
    $.ajax({url:url, success:callback});
}

function getLessonIdParam() { 
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    
    if (url.indexOf("?") != -1) { 
        var str = url.substr(1); 
        strs = str.split("&"); 
        for(var i = 0; i < strs.length; i ++) {
            pair = strs[i].split("=")
            if (pair[0] == 'lesson_id') {
                return pair[1];
            }
        } 
    } 
    return null;
}

function listenWeixinShareEvent(configParams) {
    console.log(configParams);
    var imgUrl      = 'http://7xogkj.com2.z0.glb.qiniucdn.com/logo2.png'
    var lineLink    = '/rest/lessons/snsauth/' + global_lesson_id;
    var descContent = '讲师点名啦，赶快签到吧！小鹿大学正在高薪招聘讲师，一起组团来应聘！';
    var shareTitle  = '小鹿大学 课程签到';
    var signkey     = configParams.wx_singkey;
    wx.config({
        debug: false,
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: signkey.app_id,
        // 必填，公众号的唯一标识
        timestamp: signkey.timestamp,
        // 必填，生成签名的时间戳
        nonceStr: signkey.noncestr,
        // 必填，生成签名的随机串
        signature: signkey.signature,
        // 必填，签名，见附录1
        jsApiList: ["onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function() {
        wx.onMenuShareAppMessage({
            title: shareTitle,
            // 分享标题
            desc: descContent,
            // 分享描述
            link: lineLink,
            // 分享链接
            imgUrl: imgUrl,
            // 分享图标
            type: 'link',
            // 分享类型,music、video或link，不填默认为link
            dataUrl: '',
            // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
            },
            cancel: function() {
                console.log("取消分享");
            }
        });
    });
}

function sharePage(){
    console.log('global_lesson_id', global_lesson_id);
    //if (!GLConfig.weixin){return;}
    var share_url = GLConfig.baseApiUrl + GLConfig.api_share_page;
    console.log(share_url);
    $.ajax({
        type: "get",
        url: share_url,
        data: "",
        success: listenWeixinShareEvent,
        error: function (data) {
            console.log('error:',data);
        }
    });
}




$(document).ready(function() {
    var lesson_id = getLessonIdParam();
    global_lesson_id = lesson_id;
    
    var params = location.search
    if (lesson_id) {
        loadLessonInfo(lesson_id);
        loadLessonAttendRecord(params);
    }
    sharePage();
});

