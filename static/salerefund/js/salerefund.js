/**
 * Created by jishu_linjie on 10/11/16.
 */
// 从admin 页面加载html页面

var showSaleRefundPage = function (saleRefundId) {
    $(".click_row_" + saleRefundId).parent().parent().hide();//隐藏掉要操作的行
    layer.msg('werwer');
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

var setCheckBox = function (saleRefundId) {
    var checked = $("#im-execute-" + saleRefundId).attr("checked");
    console.log('checked', checked);
    if (checked === 'checked') {
        console.log('yes');
        $("#im-execute-" + saleRefundId).attr("checked", null);
    } else {
        console.log('no');
        $("#im-execute-" + saleRefundId).attr("checked", 'checked');
    }
};

var refundCoupon = function (saleRefundId) {
    console.log('补优惠券:', saleRefundId);
    var imExecute = $("#im-execute-" + saleRefundId).attr("checked");
    var templateId = $('#refundCoupon-' + saleRefundId).val();
    var url = '/apis/pay/v1/salerefund/' + saleRefundId + '/refund_coupon_manual';
    layer.confirm('确定补贴优惠券给用户吗？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var func = function (res) {
            console.log('res:', res);
            layer.msg(res.info);
            if (imExecute === 'checked') {
                location.reload();
            }
        };
        serverData({
            'coupon_template_id': parseInt(templateId),
            'im_execute': imExecute === 'checked'
        }, func, url, 'post');
    }, function () {
    });
};

var refundPostage = function (saleRefundId) {
    var postageValue = $("#refundPostage-" + saleRefundId).val();
    var imExecute = $("#im-execute-" + saleRefundId).attr("checked");
    var keyCode = window.event.charCode || window.event.keyCode;
    var url = '/apis/pay/v1/salerefund/' + saleRefundId + '/refund_postage_manual';
    if (keyCode == '13') {
        console.log('退邮费:', saleRefundId, postageValue);
        layer.confirm('确定退邮费给用户吗？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            var func = function (res) {
                console.log('res:', res);
                layer.msg(res.info);
                if (imExecute === 'checked') {
                    location.reload();
                }
            };
            serverData({
                'postage_num': parseInt(postageValue) * 100,
                'im_execute': imExecute === 'checked'
            }, func, url, 'post');
        }, function () {
        });
        return false
    }
};
