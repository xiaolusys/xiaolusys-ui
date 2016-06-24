/**
 * Created by jishu_linjie on 6/12/16.
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
                layer.msg(data.statusText);
            }
        }
    });
}

var logistic = {
    "usually": {
        "3": "EMS经济快递",
        "100": "申通快递",
        "102": "韵达四联",
        "-2": "韵达快递",
        "504": "天天快递",
        "1204": "快捷快递",
        "505": "顺丰速运",
        "-3": "顺丰到付",
        "5000000110730": "德邦快递",
        "107": "德邦物流",
        "101": "圆通速递",
        "500": "中通快递",
        "200143": "国通快递",
        "502": "百世汇通",
        "105": "百世物流",
        "108": "华强物流",
        "1": "中国邮政",
        "200734": "邮政小包",
        "2": "EMS"
    },
    "other": {
        "-5": "无需物流"
        //"-1": "其他"
    },

    "unusually": {
        "-4": "物流宝",
        "106": "联邦快递",
        "103": "宅急送",
        "501": "CCES",
        "507": "亚风",
        "511": "长宇",
        "512": "大田",
        "513": "长发",
        "1008": "安得",
        "1016": "中铁快运",
        "1056": "佳吉快递",
        "1121": "飞远",
        "1137": "东方汇",
        "1138": "首业",
        "1139": "远长",
        "1140": "中远",
        "1185": "黑猫宅急便",
        "1186": "新邦物流",
        "1191": "天地华宇",
        "1192": "港中能达",
        "1195": "龙邦速递",
        "1198": "浙江ABC",
        "1201": "星辰急便",
        "1207": "优速快递",
        "1208": "增益速递",
        "1214": "联昊通",
        "1216": "全峰快递",
        "1236": "成都东骏快捷",
        "1237": "发网",
        "1259": "全一快递",
        "1262": "城市100",
        "1269": "广东EMS",
        "200427": "飞远配送",
        "200740": "E速宝",
        "200982": "汇强快递",
        "201174": "速尔",
        "202855": "信丰物流",
        "202857": "凡宇速递",
        "204882": "飞康达速运",
        "204900": "居无忧",
        "204902": "贝业新兄弟",
        "204904": "合众阳晟",
        "21000007003": "美国速递",
        "21000038002": "派易国际物流77",
        "21000046011": "ZTOSH",
        "21000048014": "ZTOGZ",
        "21000051004": "燕文北京",
        "21000051008": "燕文广州",
        "21000053037": "保宏物流",
        "21000127009": "WnDirect"
    }
};

function setExpressCompany() {
    $.each(logistic, function (key, value) {
        if (key == 'usually') {
            $.each(value, function (k, v) {
                var html = '<option value=' + k + '>' + v + '</option>';
                $(".usually-express").append(html)
            });
        }
        if (key == 'unusually') {
            $.each(value, function (k, v) {
                var html = '<option value=' + k + '>' + v + '</option>';
                $(".unusually-express").append(html)
            });
        }

        if (key == "other") {
            $.each(value, function (k, v) {
                var html = '<option value=' + k + '>' + v + '</option>';
                $(".other-express").append(html)
            });
        }
    });

}

$(document).ready(function () {
    setExpressCompany();
    //　初始化表格数据
    var url = '/warehouse/receipt?page_size=20';
    serverData('', setInitReceiptData, url, 'get')
});

function addReceipt() {
    var receipt_type = $("#receipt_type").val();
    var weight = $("#weight").val();
    var express_no = $("#express_no").val();
    var express_company = $("#express_company").val();
    var data = {
        "receipt_type": receipt_type,
        "weight": weight,
        "express_no": express_no,
        "express_company": express_company
    };
    var url = '/warehouse/receipt';
    serverData(data, setReceiptData, url, 'post');
}

function expressNochange() {
    if (event.keyCode == 13) {
        addReceipt();
        return false;
    }
}


function createReceiptDataDom(obj) {
    var template = $("#receipt-data-false").html();
    if (obj.status == true) {
        template = $("#receipt-data-true").html();
    }
    return hereDoc(template).template(obj)
}

function setInitReceiptData(res) {
    console.log("res:", res);
    if (res.count > 0) {
        $.each(res.results, function (i, v) {
            v.express_company = v.logistic_company_info.name;
            var html = createReceiptDataDom(v);
            $(".receipt-data-item").first("tr").before(html);
        });
    }
    else {
        layer.msg('记录不存在');
    }
}

function setReceiptData(res) {
    console.log("res:", res);
    if (res.code == 0) {
        res.receipt.express_company = res.receipt.logistic_company_info.name;
        var html = createReceiptDataDom(res.receipt);
        $(".receipt-data-item").first("tr").before(html);
    }
    else {
        layer.msg(res.info);
    }
    // 添加过后清除　快递输入框和重量框
    $("#express_no").val('');
    $("#weight").val(0);
}

function modifyReceipt(tar) {
    var id = $(tar).closest('tr').attr('id');
    console.log("modify id :", id);
    var url = '/warehouse/receipt/' + id;
    serverData('', setModifyReceiptData, url, 'get');
}

function setModifyReceiptData(res) {
    console.log('modify object:', res);
    $("#modify-object").attr('cid', res.id);
    $("#receipt_type_modify").val(res.receipt_type);
    $("#weight_modify").val(res.weight);
    $("#express_no_modify").val(res.express_no);
    $("#express_company_modify").val(res.express_company);
}
function cleanModify() {
    $("#modify-object").attr('cid', '');
    $("#receipt_type_modify").val(0);
    $("#weight_modify").val('');
    $("#express_no_modify").val('');
    $("#express_company_modify").val('');
}

$("#close-modify").click(function () {
    cleanModify();
});

function saveModify() {
    console.log('save modify');
    var id = $("#modify-object").attr('cid');
    var receipt_type = $("#receipt_type_modify").val();
    var weight = $("#weight_modify").val();
    var express_no = $("#express_no_modify").val();
    var express_company = $("#express_company_modify").val();
    var data = {
        "id": id,
        "receipt_type": receipt_type,
        "weight": weight,
        "express_no": express_no,
        "express_company": express_company
    };
    var url = '/warehouse/receipt/' + id;
    serverData(data, restReceiptData, url, 'patch');
}

function restReceiptData(res) {
    console.log("reset receipt data afte modify", res);
    $('#' + res.id).remove();
    res.express_company = res.logistic_company_info.name;
    var html = createReceiptDataDom(res);
    $(".receipt-data-item").first("tr").before(html);
}

function searchReceipt() {
    if (event.keyCode == 13) {
        $("#search-receipt").trigger('click', receiptSearch());
        return false;
    }
}

function receiptSearch() {
    var express_no = $("#express-no-search").val();
    if (express_no == '') {
        layer.msg('快递号不能为空的!');
        return
    }
    console.log('receipt search express no:', express_no);
    var url = '/warehouse/receipt?search=' + express_no;
    serverData('', setInitReceiptData, url, 'get');
}
