/**
 * Created by jishu_linjie on 5/28/16.
 */

function moreType(getData, func) {
    var dateTotalRequestUrl = '/statistics/stats/salestats/get_type_list';
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

function setChart(dom, titleText, subtitleText, xAxisCgs, yAxisTitleText, tooltipSuf, series) {

    $(dom).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: titleText,
            x: -20 //center
        },
        subtitle: {
            text: subtitleText,
            x: -20
        },
        xAxis: {
            categories: xAxisCgs,
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '9px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            title: {
                text: yAxisTitleText
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: tooltipSuf,
            shared: true,
            useHTML: true
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: series
    });
}

function setStatsData(data) {
    var statusInit = {'已付款': [], '发货前退款': [], '未付款': [], '缺货退款': [], '退货退款': []};
    var dateField = [];
    var timely_type = '';
    var titleText = '';
    $.each(data, function (index, v) {
        timely_type = v.timely_type;
        titleText = v.get_timely_type_display + v.get_record_type_display;
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
    showRecordsTips([7, 13, 14], {7: "款式", 13: '供应商', 14: '买手BD'});//
}


function showRecordsTips(record_type_arry, obj) {
    $('tspan').click(function () {
        var timely_type = $(this).closest('.chart').attr('id').split('-')[2];
        var date_field = $(this).html();
        var url = '';
        var InfohtmlSupplier = '';
        $.each(record_type_arry, function (i, v) {
            url = '/static/statistics/html/salestats-detail.html?date_field=' + date_field + '&record_type=' + v + '&timely_type=' + timely_type;
            InfohtmlSupplier += '<a onclick="subCharts(' + '\'' + url + '\'' + ')">' + obj[v] + '</a><br>';
        });
        layer.tips(InfohtmlSupplier, $(this), {
            tips: [3, '#FFFFFF'],
            time: 4000
        });
        console.log($('.layui-layer-content'));
    });
}


function subCharts(url) {
    console.log("打开 明细页面:" + url);
    layer.open({
        type: 2,
        title: '',
        shadeClose: true,
        shade: 0.8,
        area: ['95%', '50%'],
        content: url
    });
}