$(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'Y-M-D'
    });
});

$(function () {
    $('#datetimepicker2').datetimepicker({
        format: 'Y-M-D'
    });
});

$(function () {
    $('.assign-date').datetimepicker({
        format: 'Y-M-D'
    });
});

function moreType(getData, func) {
    var dateTotalRequestUrl = '/statistics/stats/salestats/get_all_num_type_list';
    $.ajax({
        type: 'get',
        url: dateTotalRequestUrl,
        data: getData,
        dataType: 'json',
        success: func,
        error: function (data) {
            console.log('debug profile:', data);
            if (data.status == 403) {
                drawToast('您还没有登陆哦!');
            }
        }
    });
}

function cleanData() {
    var table = $('.table-bordered').DataTable();
    table.destroy();
    $("#stats-data").empty();

}

$(function () {
    var date_field = '';
    var timely_type = 0;
    var limit = 0;
    var record_type = 0;
    var status = '';

    $('.timely-type').click(function () {
        timely_type = $(this).attr('timely-type');
        console.log(timely_type);
        var date = $("#condition-date-field");
        var week = $("#condition-week-field");
        var month = $("#condition-month-field");
        if (timely_type == 6) {
            week.val('');
            month.val('');
            date.on('dp.change', function (e) {
                date_field = $(date).val();
                console.log("date_field:", date_field, e.date);
            });
        }
        if (timely_type == 7) {
            date.val('');
            month.val('');
            week.on('dp.change', function (e) {
                date_field = $(week).val();
                console.log("date_field:", date_field, e.date);
            });
        }
        if (timely_type == 8) {
            date.val('');
            week.val('');
            month.on('dp.change', function (e) {
                date_field = $(month).val();
                console.log("date_field:", date_field, e.date);
            });
        }

    });

    $('.limit').click(function () {
        cleanData();
        limit = $(this).attr('limit');
        $("#condition-limit").val($(this).html());
        requestData();
    });

    $(".record-type").click(function () {
        cleanData();
        record_type = $(this).attr('record-type');
        $("#condition-record-type").val($(this).html());
        requestData()
    });
    $(".record-status").click(function () {
        cleanData();
        status = $(this).attr('status');
        $("#condition-status").val($(this).html());
        requestData()
    });

    function requestData() {
        console.log('参数:', date_field, timely_type, limit, record_type);
        if (date_field != '' && timely_type != 0 && limit != 0 && record_type != 0 && status!='') {
            var date_field_from = $("#datetimepicker1").val();
            var date_field_to = $("#datetimepicker2").val();
            var data = {
                "date_field": date_field,
                "timely_type": timely_type,
                "limit": limit,
                "record_type": record_type,
                "status": status,
                "date_field_from": date_field_from,
                "date_field_to": date_field_to
            };
            moreType(data, setRefundData)
        }
    }
});


function createSaleDataDom(obj) {
    var template = '';
    if (obj.record_type == 7) {
        template = $("#stats-template-model").html();
    }
    if (obj.record_type == 13) {
        template = $("#stats-template-supplier").html();
    }
    if (obj.record_type == 14) {
        template = $("#stats-template-bd").html();
    }
    return hereDoc(template).template(obj)
}


function setRefundData(data) {

    console.log("data: ", data);
    $.each(data, function (i, val) {
        val.return_goods_rate = 0.00;
        var total_num = val.paid_num + val.cancel_num + val.return_goods_num + val.out_stock_num;
        if (total_num != 0) {
            val.return_goods_rate = (val.return_goods_num / total_num).toFixed(4);
        }
        // 退货率 = 退货数量/(销售数量(不含退款) + 退货数量 + 发货前退款数量 +　缺货退款数量)
        val.total_num = total_num;
        var stats = createSaleDataDom(val);
        $("#stats-data").append(stats);
    });
    var table = $('.table-bordered').DataTable();
    console.log("table:", table);

}
