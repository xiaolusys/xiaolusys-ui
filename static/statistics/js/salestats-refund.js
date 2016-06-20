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

function moreType(getData, func, url) {
    var dateTotalRequestUrl = url;//;
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
    //$("#datetimepicker1").val(Date.prototype.reduceFormatDate(4)); // 4天前的时间
    //$("#datetimepicker2").val(Date.prototype.reduceFormatDate(0));//　今天
    //var limit = $("#condition-limit");
    //limit.val('TOP 100');
    //limit.attr('limit', 100);
    //var record_type = $("#condition-record-type");
    //record_type.val('款式');
    //record_type.attr('record-type', 7);
    //var status = $("#condition-status");
    //status.val('已付款');
    //status.attr('status', 1);
    //$("#record-status1").trigger('click', initData());
    //function initData() {
    //    var data = {
    //        "timely_type": 6, // 聚合仅仅聚合日期
    //        "limit": 100,
    //        "record_type": 7,
    //        "status": 1,
    //        "date_field_from": $("#datetimepicker1").val(),
    //        "date_field_to": $("#datetimepicker2").val()
    //    };
    //    console.log('get init data:', data);
    //    moreType(data, setAnnotateData, '/statistics/stats/salestats/get_annotate_type_list')
    //}
    var target_date = Date.prototype.reduceFormatDate(4);
    $("#condition-date-field").val(target_date);//　今天
    var limit = $("#condition-limit");
    limit.val('TOP 100');
    limit.attr('limit', 100);
    var record_type = $("#condition-record-type");
    record_type.val('总计');
    record_type.attr('record-type', 16);
    var status = $("#condition-status");
    status.val('已付款');
    status.attr('status', 1);
    $("#record-status1").trigger('click', initToadyData());

    function initToadyData() {
        var data = {
            "timely_type": 6,
            "date_field": target_date,
            "limit": 100,
            "record_type": 16,// 总计
            "status": 1
        };
        console.log('get init data:', data);
        moreType(data, setRefundData, '/statistics/stats/salestats/get_all_num_type_list')
    }
});


$(function () {

    $("#sort-table").click(function () {
        console.log('sort table');
        $('.table-bordered').DataTable();
    });

    var date_field = '';
    var timely_type = 6;
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
        if (timely_type == 10) {
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
            moreType(data, setRefundData, '/statistics/stats/salestats/get_all_num_type_list')
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
            // 请求　分组聚合后的数据
            moreType(data, setAnnotateData, '/statistics/stats/salestats/get_annotate_type_list')
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
    if (obj.record_type == 14 || obj.record_type == 16) {
        template = $("#stats-template-bd").html();
    }
    return hereDoc(template).template(obj)
}


function setRefundData(data) {

    console.log("assign date field  data: ", data);
    var t_paid_num = 0;
    var t_cancel_num = 0;
    var t_out_stock_num = 0;
    var t_return_goods_num = 0;
    var t_no_pay_num = 0;
    $.each(data, function (i, val) {
        val.return_goods_rate = 0.00;
        var total_num = val.paid_num + val.return_goods_num + val.out_stock_num;
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

var items = {};
function setAnnotateData(data) {
    $('.t_digit').html('');
    items = {};
    console.log("annotate data", data);
    var record_type = $("#condition-record-type").attr('record-type');
    $.each(data, function (i, val) {
        items[val.current_id] = {};
        items[val.current_id]['current_id'] = val.current_id;
        items[val.current_id]['name'] = val.name;
        items[val.current_id]['pic_path'] = val.pic_path;

        items[val.current_id]['nopay_payment'] = 0;
        items[val.current_id]['paid_payment'] = 0;
        items[val.current_id]['cacl_payment'] = 0;
        items[val.current_id]['ostk_payment'] = 0;
        items[val.current_id]['rtg_payment'] = 0;

        items[val.current_id]['nopay_num'] = 0;
        items[val.current_id]['paid_num'] = 0;
        items[val.current_id]['cacl_num'] = 0;
        items[val.current_id]['ostk_num'] = 0;
        items[val.current_id]['rtg_num'] = 0;

        var date_field_from = $("#datetimepicker1").val();
        var date_field_to = $("#datetimepicker2").val();
        var target_data = {
            "record_type": record_type,
            "current_id": val.current_id,
            "date_field_from": date_field_from,
            "date_field_to": date_field_to
        };
        moreType(target_data, setCollectData, '/statistics/stats/salestats/get_target_stats_info')
    });

}

function setCollectData(statsinfos) {
    console.log("statsinfos: ", statsinfos);
    var current_id = statsinfos.current_id;
    items[current_id].nopay_payment = statsinfos.nopay_payment.toFixed(2);
    items[current_id].paid_payment = statsinfos.paid_payment.toFixed(2);
    items[current_id].cacl_payment = statsinfos.cacl_payment.toFixed(2);
    items[current_id].ostk_payment = statsinfos.ostk_payment.toFixed(2);
    items[current_id].rtg_payment = statsinfos.rtg_payment.toFixed(2);
    items[current_id].cacl_num = statsinfos.cacl_num;
    items[current_id].nopay_num = statsinfos.nopay_num;
    items[current_id].ostk_num = statsinfos.ostk_num;
    items[current_id].paid_num = statsinfos.paid_num;
    items[current_id].rtg_num = statsinfos.rtg_num;
    var value = items[current_id];
    var a_total_num =
        Number(statsinfos.paid_num) + Number(statsinfos.rtg_num) + Number(statsinfos.ostk_num);
    console.log('a_total_num num', a_total_num, value);

    if (a_total_num != 0) {
        value.return_goods_rate = (value.rtg_num / a_total_num ).toFixed(4);
    }
    // 退货率 = 退货数量/(销售数量(不含退款) + 退货数量 + 发货前退款数量 +　缺货退款数量)
    value.total_num = a_total_num;
    value.obsolete_supplier = statsinfos.obsolete_supplier;
    var annotate_html = createAnnoDataDom(value);
    $("#stats-data").append(annotate_html);
}

function createAnnoDataDom(obj) {
    var record_type = $("#condition-record-type").attr('record-type');
    var template = $("#stats-template-annotate").html();
    if (record_type == '7') {
        template = $("#stats-template-annotate-model").html();
    }
    return hereDoc(template).template(obj)
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


function jumpToSaleProduct(model_id) {
    console.log("product id is :", model_id);
    var url = '/rest/v1/products/get_product_by_model_id';
    moreType({"model_id": model_id}, createNewPage, url);
    function createNewPage(res) {
        console.log("model_id producs :", res);
        if (res.length > 0) {
            var pro = res[0];
            var sale_product = pro.sale_product;
            var targetUrl = '/admin/supplier/saleproduct/?id=' + sale_product;
            //window.open(targetUrl);
            layer.open({
                type: 2,
                title: '选品页',
                shadeClose: true,
                shade: 0.8,
                area: ['100%', '60%'],
                content: targetUrl
            });
        }
        else {
            layer.msg('没有找到选品信息');
        }
    }
}