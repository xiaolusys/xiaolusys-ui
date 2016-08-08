/**
 * Created by jishu_linjie on 8/8/16.
 */
function createLessonTpl(obj) {
    var mamaLesson = $("#mama-lesson-tpl").html();
    return hereDoc(mamaLesson).template(obj)
}
$(document).ready(function () {
    console.log('In apply mama lesson page');
    getMamaLesson();
});

function getMamaLesson() {
    var topicId = getUrlParam("topic_id");
    var lessUrl = '/rest/v1/lesson/lessontopic/' + topicId + '/get_instructor_lesson';
    $.ajax({
        "url": lessUrl,
        "type": "get",
        dataType: 'json',
        success: lessonCallback,
        error: function (err) {
            var resp = JSON.parse(err.responseText);
            if (!isNone(resp.detail)) {
                drawToast(resp.detail);
            }
        }
    });

    function lessonCallback(res) {
        console.log(res);
        if (res.code == 0) {
            res.lesson.lesson_attend_record_url = res.lesson_attend_record_url;
            var html = createLessonTpl(res.lesson);
            $('#mama-lesson-content').append(html);
        } else {
            drawToast(res.info);
        }
    }
}