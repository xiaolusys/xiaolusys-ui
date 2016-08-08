/**
 * Created by jishu_linjie on 8/8/16.
 */
function createLessonSign(obj) {
    var mamaLesson = $("#mama-lesson-tpl").html();
    return hereDoc(mamaLesson).template(obj)
}
$(document).ready(function () {
    console.log('In lesson sign page');
    getMamaLesson();
});

function getMamaLesson() {
    var lessonId = getUrlParam("lesson_id");
    console.log(lessonId);
    var lessUrl = '/rest/v1/lesson/lesson/' + lessonId + '/lesson_sign';
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
            var html = createLessonSign(res);
            $('#lesson-sign-content').append(html);
        } else {
            drawToast(res.info);
        }
    }
}