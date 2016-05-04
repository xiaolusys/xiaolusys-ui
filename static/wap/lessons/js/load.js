var BASE_URL = 'http://127.0.0.1:8000';

function loadLessonTopics() {
    var topic_url = '/rest/lesson/lesson';
    var url = BASE_URL + topic_url;
    var callback = function (res) {
        if (res) {
            var arr = res.results
            for(var i=0; i<arr.length; i++) {
                var content = [];
                var qrcode_links = arr[i].qrcode_links.links;

                content.push('<div class="row"><div class="col-sm-6 col-md-4"><div class="thumbnail">');
                content.push('<img src="'+arr[i].instructor_image+'">');
                content.push('<div class="caption" style="margin-top:-60px">');
                content.push('<p style="color:white">主讲：'+arr[i].instructor_name+' '+arr[i].instructor_title);
                content.push('<br/>时间：'+arr[i].start_time_display+'</p>');
                content.push('<h3>'+arr[i].title+'</h3>');
                content.push('<p>'+arr[i].description+'</p>');
                if (arr[i].is_started == 0) {
                    //content.push('<a href="#" class="btn btn-success" style="margin-right:10px" role="button">进入课堂 >></a>');
                    content.push('<p style="text-align:center"><img style="width:50%" src="'+qrcode_links[arr[i].customer_id_last_digit]+'" /><br/><span style="color:red">课程即将开始，请保存并微信扫描入群！</span>');
                    content.push('<br/><a href="'+arr[i].content_link+'" class="btn btn-primary" role="button">查看内容 >></a></p>');
                } else { 
                    content.push('<p><a href="'+arr[i].content_link+'" class="btn btn-primary" role="button">查看内容 >></a></p>');
                }
                content.push('</div></div></div></div>');
                $("#id-container").append(content.join(''));
            }
        }
    };
    $.ajax({url:url, success:callback});
}

$(document).ready(function() {
    loadLessonTopics();
});

