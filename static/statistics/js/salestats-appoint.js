function setAppointStatsData(data) {
    console.log(data);
    var statusInit = {'已付款': [], '发货前退款': [], '未付款': [], '缺货退款': [], '退货退款': []};
    var dateField = [];
    var timely_type = '';
    var record_type = '';
    var titleText = '';
    $.each(data, function (index, v) {
        timely_type = v.timely_type;
        record_type = v.record_type;
        titleText = v.date_field + v.get_timely_type_display + v.get_record_type_display + v.name;
        if ($.inArray(v.date_field, dateField) < 0) {
            dateField.push(v.date_field);
            statusInit.已付款.push(0);
            statusInit.发货前退款.push(0);
            statusInit.未付款.push(0);
            statusInit.缺货退款.push(0);
            statusInit.退货退款.push(0);
        }
    });

    $.each(data, function (index, v) {
        var index = $.inArray(v.date_field, dateField);
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
}
