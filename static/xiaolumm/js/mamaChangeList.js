/**
 * Created by jie.lin on 11/29/16.
 */

function serverData(data, func, url, type) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: 'json',
        success: func,
        error: function (data) {
            console.log('debug data:', data);
            if (data.status == 403) {
                layer.msg('您还没有登陆哦!');
            }
            else {
                layer.msg(data.responseText);
            }
        }
    });
}

var changeMamaManager = function (id) {
    var url = '/m/set_mama_manager';
    var actionDom = $('#select-manager-' + id);
    var data = {'mama_id': id, 'manager_id': actionDom.val()};
    layer.confirm('确定吗？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        if (actionDom.hasClass('loading')) {
            return
        }
        actionDom.addClass('loading');
        var func = function (res) {
            layer.msg(res.info);
            actionDom.removeClass('loading');
        };
        serverData(data, func, url, 'post');
    }, function () {
    });
};