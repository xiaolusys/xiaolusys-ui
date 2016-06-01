function setDetailStatsData(data) {
    var statusInit = {'已付款': [], '发货前退款': [], '未付款': [], '缺货退款': [], '退货退款': []};
    var dateField = [];
    var timely_type = '';
    var record_type = '';
    var titleText = '';
    $.each(data, function (index, v) {
        timely_type = v.timely_type;
        record_type = v.record_type;
        console.log("timely_type:", timely_type);
        titleText = v.date_field + v.get_timely_type_display + v.get_record_type_display;
        var name1 = v.current_id + '-' + v.name;
        if ($.inArray(name1, dateField) < 0) {
            dateField.push(name1);
            statusInit.已付款.push(0);
            statusInit.发货前退款.push(0);
            statusInit.未付款.push(0);
            statusInit.缺货退款.push(0);
            statusInit.退货退款.push(0);
        }
    });

    $.each(data, function (index, v) {
        var name2 = v.current_id + '-' + v.name;
        var index = $.inArray(name2, dateField);
        if (v.get_status_display == '已付款') {
            statusInit.已付款[index] += v.num;
        }
        if (v.get_status_display == '发货前退款') {
            statusInit.发货前退款[index] += v.num;
        }
        if (v.get_status_display == '未付款') {
            statusInit.未付款[index] += v.num;
        }
        if (v.get_status_display == '缺货退款') {
            statusInit.缺货退款[index] += v.num;
        }
        if (v.get_status_display == '退货退款') {
            statusInit.退货退款[index] += v.num;
        }
    });

    var series = [];
    $.each(statusInit, function (i, v) {
        series.push({name: i, data: v});
    });
    setChart($('#timely-type-' + timely_type), titleText, 'xlmm', dateField, "销售数量", '个', series);
    showAppointRecords(record_type, timely_type)
}


function showAppointRecords(record_type, timely_type) {
    $('tspan').click(function () {
        var current_id = $(this).html().split('-')[0];
        var url = '/static/statistics/html/salestats-appoint.html?current_id=' + current_id + '&record_type=' + record_type + '&timely_type=' + timely_type;
        console.log("url:" + url);
        appointCharts(url);
    });
}

function appointCharts(url) {
    layer.open({
        type: 2,
        title: '',
        shadeClose: true,
        shade: 0.8,
        area: ['95%', '95%'],
        content: url
    });
}