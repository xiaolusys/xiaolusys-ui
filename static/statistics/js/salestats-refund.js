$(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'Y-M-D'
    });
    $('#datetimepicker1').click(function () {
        $('.timely-type').val('')
    });
});

$(function () {
    $('#datetimepicker2').datetimepicker({
        format: 'Y-M-D'
    });
    $('#datetimepicker2').click(function () {
        $('.timely-type').val('')
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

// 首次加载请求数据

$(function () {
    $("#datetimepicker1").val(Date.prototype.reduceFormatDate(4)); // 4天前的时间
    $("#datetimepicker2").val(Date.prototype.reduceFormatDate(0));//　今天
    var limit = $("#condition-limit");
    limit.val('TOP 100');
    limit.attr('limit', 100);
    var record_type = $("#condition-record-type");
    record_type.val('款式');
    record_type.attr('record-type', 7);
    var status = $("#condition-status");
    status.val('已付款');
    status.attr('status', 1);
    $("#record-status1").trigger('click', initData());
    function initData() {
        var data = {
            "timely_type": 6, // 聚合仅仅聚合日期
            "limit": 100,
            "record_type": 7,
            "status": 1,
            "date_field_from": $("#datetimepicker1").val(),
            "date_field_to": $("#datetimepicker2").val()
        };
        console.log('get init data:', data);
        moreType(data, setAnnotateData)
    }
});


$(function () {
    var date_field = '';
    var timely_type = 0;
    var limit = 0;
    var record_type = 0;
    var status = '';
    var date_field_from_dom = $("#datetimepicker1");
    var date_field_to_dom = $("#datetimepicker2");
    var date_field_from = date_field_from_dom.val();
    var date_field_to = date_field_to_dom.val();

    date_field_from_dom.on('dp.change', function (e) {
        date_field_from = date_field_from_dom.val();
        console.log("date_field_from:", date_field_from, e.date);
    });

    date_field_to_dom.on('dp.change', function (e) {
        date_field_to = date_field_to_dom.val();
        console.log("date_field_to:", date_field_to, e.date);
    });

    $('.timely-type').click(function () {
        $("#datetimepicker1").val('');
        $("#datetimepicker2").val('');
        timely_type = $(this).attr('timely-type');
        console.log(timely_type);
        var date = $("#condition-date-field");
        var week = $("#condition-week-field");
        var month = $("#condition-month-field");
        var year = $("#condition-year-field");

        if (timely_type == 6) {
            week.val('');
            month.val('');
            year.val('');
        }
        if (timely_type == 7) {
            year.val('');
            date.val('');
            month.val('');

        }
        if (timely_type == 8) {
            year.val('');
            date.val('');
            week.val('');
        }
        if(timely_type==10){
            date.val('');
            week.val('');
            month.val('');
        }
    });

    $('.limit').click(function () {
        limit = $(this).attr('limit');
        status = $("#condition-status").attr('status');
        record_type = $("#condition-record-type").attr('record-type');
        $("#condition-limit").attr('limit', limit);
        date_field_from = $("#datetimepicker1").val();
        date_field_to = $("#datetimepicker2").val();
        if (date_field_from != '' && date_field_to != '' && typeof(record_type) != 'undefined') {
            cleanData();
            $("#condition-limit").val($(this).html());
            requestAnnotateData();
        }
        else {
            cleanData();
            $("#condition-limit").val($(this).html());
            requestData();
        }
    });

    $(".record-type").click(function () {
        record_type = $(this).attr('record-type');
        status = $("#condition-status").attr('status');
        limit = $("#condition-limit").attr('limit');
        date_field_from = $("#datetimepicker1").val();
        date_field_to = $("#datetimepicker2").val();
        $("#condition-record-type").attr('record-type', record_type);
        if (date_field_from != '' && date_field_to != '' && typeof(record_type) != 'undefined') {
            cleanData();
            $("#condition-record-type").val($(this).html());
            requestAnnotateData();
        }
        else {
            cleanData();
            $("#condition-record-type").val($(this).html());
            requestData()
        }
    });

    $(".record-status").click(function () {
        limit = $("#condition-limit").attr('limit');
        record_type = $("#condition-record-type").attr('record-type');
        status = $(this).attr('status');
        $("#condition-status").attr('status', status);
        date_field_from = $("#datetimepicker1").val();
        date_field_to = $("#datetimepicker2").val();
        if (date_field_from != '' && date_field_to != '' && typeof(record_type) != 'undefined') {
            cleanData();
            $("#condition-status").val($(this).html());
            requestAnnotateData();
        }
        else {
            cleanData();
            $("#condition-status").val($(this).html());
            requestData()
        }
    });

    function requestData() {
        $.each($('.timely-type'), function (i, v) {
            var d = $(v).val();
            if (d != '') {
                date_field = d;
            }
        });
        console.log('参数:', date_field, timely_type, limit, record_type);
        if (date_field != '' && timely_type != 0 && limit != 0 && record_type != 0 && status != '') {

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

    function requestAnnotateData() {
        console.log('参数--->', limit, record_type, status);
        if (limit != 0 && record_type != 0) {
            var data = {
                "timely_type": 6, // 聚合仅仅聚合日期
                "limit": limit,
                "record_type": record_type,
                "status": status,
                "date_field_from": date_field_from,
                "date_field_to": date_field_to
            };
            moreType(data, setAnnotateData)
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
    if (obj.record_type == 16) {
        template = $("#stats-template-bd").html();
    }
    return hereDoc(template).template(obj)
}


function setRefundData(data) {

    console.log("data: ", data);
    var t_paid_num = 0;
    var t_cancel_num = 0;
    var t_out_stock_num = 0;
    var t_return_goods_num = 0;
    var t_no_pay_num = 0;
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
        t_paid_num += total_num;
        t_cancel_num += val.cancel_num;
        t_out_stock_num += val.out_stock_num;
        t_return_goods_num += val.return_goods_num;
        t_no_pay_num += val.no_pay_num;
    });
    var table = $('.table-bordered').DataTable();
    console.log("table:", table);
    var t_cancel_rate = 0;
    var t_out_stock_rate = 0;
    var t_return_goods_rate = 0;
    var t_no_pay_rate = 0;
    if (t_paid_num == 0) {
        t_cancel_rate = 0;
        t_out_stock_rate = 0;
        t_return_goods_rate = 0;
        t_no_pay_rate = 0;
    }
    else {
        t_cancel_rate = ( t_cancel_num / t_paid_num).toFixed(4);// 发货前退款率
        t_out_stock_rate = ( t_out_stock_num / t_paid_num).toFixed(4);//缺货率
        t_return_goods_rate = ( t_return_goods_num / t_paid_num).toFixed(4);//退货率
        t_no_pay_rate = ( t_no_pay_num / t_paid_num).toFixed(4);//逃单率
    }

    $('.ta_digit').html('');
    $("#t_paid_num").html('总付款:' + t_paid_num);
    $("#t_cancel_num").html('总退款:' + t_cancel_num);
    $("#t_out_stock_num").html('总缺货:' + t_out_stock_num);
    $("#t_return_goods_num").html('总退货:' + t_return_goods_num);
    $("#t_no_pay_num").html('总逃单:' + t_no_pay_num);
    $("#t_cancel_rate").html('退款率:' + t_cancel_rate);
    $("#t_out_stock_rate").html('缺货率:' + t_out_stock_rate);
    $("#t_return_goods_rate").html('退货率:' + t_return_goods_rate);
    $("#t_no_pay_rate").html('逃单率:' + t_no_pay_rate);


}

function setAnnotateData(data) {
    console.log("annotate data", data);
    var items = {};
    $.each(data, function (i, val) {
        console.log(val.current_id in items, val.cancel_num);

        if (val.current_id in items) {
            items[val.current_id]['paid_num'] += val.paid_num;
            items[val.current_id]['cancel_num'] += val.cancel_num;
            items[val.current_id]['return_goods_num'] += val.return_goods_num;
            items[val.current_id]['out_stock_num'] += val.out_stock_num;
            items[val.current_id]['no_pay_num'] += val.no_pay_num;
        }
        else {
            items[val.current_id] = {};
            items[val.current_id]['cancel_num'] = val.cancel_num;
            items[val.current_id]['paid_num'] = val.paid_num;
            items[val.current_id]['return_goods_num'] = val.return_goods_num;
            items[val.current_id]['out_stock_num'] = val.out_stock_num;
            items[val.current_id]['no_pay_num'] = val.no_pay_num;
            items[val.current_id]['current_id'] = val.current_id;
            items[val.current_id]['date_field'] = val.date_field;
            items[val.current_id]['get_record_type_display'] = val.get_record_type_display;
            items[val.current_id]['get_status_display'] = val.get_status_display;
            items[val.current_id]['get_timely_type_display'] = val.get_timely_type_display;
            items[val.current_id]['id'] = val.id;
            items[val.current_id]['name'] = val.name;
            items[val.current_id]['num'] = val.num;
            items[val.current_id]['parent_id'] = val.parent_id;
            items[val.current_id]['pic_path'] = val.pic_path;
            items[val.current_id]['payment'] = val.payment;
            items[val.current_id]['status'] = val.status;
            items[val.current_id]['timely_type'] = val.timely_type;
            items[val.current_id]['record_type'] = val.record_type;
        }
    });

    console.log("items:", items);

    var ta_paid_num = 0;
    var ta_cancel_num = 0;
    var ta_out_stock_num = 0;
    var ta_return_goods_num = 0;
    var ta_no_pay_num = 0;

    $.each(items, function (i, val) {
        val.return_goods_rate = 0.00;
        var total_num = val.paid_num + val.cancel_num + val.return_goods_num + val.out_stock_num;
        if (total_num != 0) {
            val.return_goods_rate = (val.return_goods_num / total_num).toFixed(4);
        }
        // 退货率 = 退货数量/(销售数量(不含退款) + 退货数量 + 发货前退款数量 +　缺货退款数量)
        val.total_num = total_num;
        var stats = createSaleDataDom(val);
        $("#stats-data").append(stats);

        // 总计
        ta_paid_num += total_num;// 总付款数量
        ta_cancel_num += val.cancel_num;//总退款数量
        ta_out_stock_num += val.out_stock_num;//总缺货数量
        ta_return_goods_num += val.return_goods_num;//总退货数量
        ta_no_pay_num += val.no_pay_num;//总逃单数量
    });

    var table = $('.table-bordered').DataTable();
    var ta_cancel_rate = 0;
    var ta_out_stock_rate = 0;
    var ta_return_goods_rate = 0;
    var ta_no_pay_rate = 0;
    if (ta_paid_num == 0) {
        ta_cancel_rate = 0;
        ta_out_stock_rate = 0;
        ta_return_goods_rate = 0;
        ta_no_pay_rate = 0;
    }
    else {
        ta_cancel_rate = ( ta_cancel_num / ta_paid_num).toFixed(4);// 发货前退款率
        ta_out_stock_rate = ( ta_out_stock_num / ta_paid_num).toFixed(4);//缺货率
        ta_return_goods_rate = ( ta_return_goods_num / ta_paid_num).toFixed(4);//退货率
        ta_no_pay_rate = ( ta_no_pay_num / ta_paid_num).toFixed(4);//逃单率
    }

    $('.t_digit').html('');
    $("#ta_paid_num").html('总付款:' + ta_paid_num);
    $("#ta_cancel_num").html('总退款:' + ta_cancel_num);
    $("#ta_out_stock_num").html('总缺货:' + ta_out_stock_num);
    $("#ta_return_goods_num").html('总退货:' + ta_return_goods_num);
    $("#ta_no_pay_num").html('总逃单:' + ta_no_pay_num);
    $("#ta_cancel_rate").html('退款率:' + ta_cancel_rate);
    $("#ta_out_stock_rate").html('缺货率:' + ta_out_stock_rate);
    $("#ta_return_goods_rate").html('退货率:' + ta_return_goods_rate);
    $("#ta_no_pay_rate").html('逃单率:' + ta_no_pay_rate);
}


Date.prototype.reduceFormatDate = function (days) {// 计算当前时间指定天数前的日期　格式化为　yyyy-mm-dd
    Date.prototype.reduceDays = function (days) {
        this.setDate(this.getDate() - parseInt(days));
        return this;
    };
    var currentDate = new Date();
    var targetDate = currentDate.reduceDays(days);
    var dd = targetDate.getDate();
    var mm = targetDate.getMonth() + 1;
    var y = targetDate.getFullYear();
    var someFormattedDate = y + '-' + mm + '-' + dd;
    return someFormattedDate
};
