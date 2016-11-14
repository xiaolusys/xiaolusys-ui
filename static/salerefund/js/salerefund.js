/**
 * Created by jishu_linjie on 10/11/16.
 */
// 从admin 页面加载html页面
var showSaleRefundPage = function (saleRefundId) {
    $(".click_row_" + saleRefundId).parent().parent().hide();//隐藏掉要操作的行
    console.log("debug refund id :", saleRefundId);
    layer.open({
        type: 2,
        title: '退款处理页面',
        shadeClose: true,
        shade: 0.6,
        area: ['85%', '68%'],
        content: '/static/salerefund/html/salerefund.html?sale_refund_id=' + saleRefundId // 弹出的url页面
    });
};

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

function createTemplateDom(obj, templateElementId, containerElementId) {
    var template = $("#" + templateElementId).html();
    $('#' + containerElementId).append(hereDoc(template).template(obj))
}

var getSaleRefund = function (saleRefundId) {
    var url = '/apis/pay/v1/salerefund/' + saleRefundId;
    var func = function (res) {
        var goodStatus = $.inArray(res.good_status, [1, 2]);// 买家收到货　买家已经退货
        if (res.status == 4 && goodStatus >= 0) {
            res.status_display = '同意退货';
        }
        createTemplateDom(res, 'sale_refund_info_tpl', 'sale_refund_info');
        createTemplateDom(res, 'sale_refund_form_tpl', 'sale_refund_form');
        if (res.manual_refund == false) {
            $("#manual_refund_container").attr("hidden", 'hidden');
        }
        $.each(res.proof_pic, function (index, proof_pic) {
            var html = hereDoc($("#proof_pic_tpl").html()).template({"proof_pic": proof_pic});
            $('#proof_pic').append(html);
        });

    };
    serverData({}, func, url, 'get')
};

var patchSaleRefund = function (saleRefundId) {
    console.log('debug submit', saleRefundId);
    var formData = $("form").serializeArray();
    var data = {};
    $(formData).each(function (index, obj) {
        data[obj.name] = obj.value;
    });

    var func = function (res) {
        console.log("patch sale refund res:", res);
        if (res.id == saleRefundId) {
            layer.msg('操作成功！');
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index); //执行关闭
        } else {
            layer.msg('系统出错！')
        }
    };
    var url = '/apis/pay/v1/salerefund/' + saleRefundId;
    serverData(data, func, url, 'patch');
    return false
};

var refunPostage = function (saleRefundId) {
    var url = '/apis/pay/v1/salerefund/' + saleRefundId + '/refund_postage_manual';
    console.log('--->saleRefundId:', saleRefundId, url);
    layer.confirm('确定退邮费给用户吗？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var func = function (res) {
            console.log('res:', res);
            layer.msg(res.info);
        };
        serverData({}, func, url, 'post');
    }, function () {});
};
