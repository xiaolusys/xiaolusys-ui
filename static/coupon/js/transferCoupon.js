/**
 * Created by jishu_linjie on 12/9/16.
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

var agreeReturnTransfer = function (id) {
    var url = '/coupon/verify_return_transfer/';
    var data = {'transfer_record_id': id, 'return_func': 'agree'};
    var actionDom = $('.returnT' + id);
    layer.confirm('确定  同意么 ？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        if (actionDom.hasClass('loading')) {
            return
        }
        actionDom.addClass('loading');
        var func = function (res) {
            layer.msg(res.info);
            actionDom.removeClass('loading');
            if (res.code == 0) {
                actionDom.parent().parent().remove();
            }
        };
        serverData(data, func, url, 'post');
    }, function () {
    });
};

var rejectReturnTransfer = function (id) {
    var url = '/coupon/verify_return_transfer/';
    var data = {'transfer_record_id': id, 'return_func': 'reject'};
    var actionDom = $('.returnT' + id);
    layer.confirm('确定  拒绝么？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        if (actionDom.hasClass('loading')) {
            return
        }
        actionDom.addClass('loading');
        var func = function (res) {
            layer.msg(res.info);
            actionDom.removeClass('loading');
            if (res.code == 0) {
                actionDom.parent().parent().remove();
            }
        };
        serverData(data, func, url, 'post');
    }, function () {
    });
};
