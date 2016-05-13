//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

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

function loadLessonAttendRecord(lesson_id, union_id) {
    var record_url = '/rest/lesson/lessonattendrecord?lesson_id='+lesson_id;
    if (union_id) {
        record_url = record_url + "&unionid="+union_id;
    }
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
    var lesson_id = getParamValue("lesson_id");
    var re = /\d+/g;
    if (lesson_id) {
        var match = lesson_id.match(re);
        if (match) {
            lesson_id = match[0];
        }
    }
    var union_id = getParamValue("unionid");
    
    if (lesson_id) {
        loadLessonInfo(lesson_id);
        loadLessonAttendRecord(lesson_id, union_id);
    }
});

