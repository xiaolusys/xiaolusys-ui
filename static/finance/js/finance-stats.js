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

var channelPayStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/channel_pay_stats';
    var func = function (res) {
        console.log(res);
        var channelNames = [];
        var countData = [];
        $('#channel-pay-tbody').empty();
        $.each(res.results, function (k, v) {
            channelNames.push(v.channel_display);
            countData.push({'value': v.count, 'name': v.channel_display});
            createTemplateDom(v, 'channel-pay-template', 'channel-pay-tbody');
        });
        var myChart = echarts.init(document.getElementById('channel-pay-stats'));
        var option = {
            title: {
                text: '支付渠道支付占比',
                subtext: '支付单数占比',
                x: 'right'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: channelNames
            },
            series: [
                {
                    name: '支付渠道',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: countData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    };
    serverData(data, func, url, 'get')
};

var refundStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/refund_stats';
    var func = function (res) {
        console.log(res);
        var refundNames = [];
        var countData = [];
        $('#refund-stats-tbody').empty();
        $.each(res.results, function (k, v) {
            refundNames.push(v.refund_status_display);
            countData.push({'value': v.count, 'name': v.refund_status_display});
            createTemplateDom(v, 'refund-stats-template', 'refund-stats-tbody');
        });
        var myChart = echarts.init(document.getElementById('refund-stats'));
        var option = {
            title: {
                text: '退款状态占比',
                subtext: '退款单数占比',
                x: 'right'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: refundNames
            },
            series: [
                {
                    name: '支付渠道',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: countData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    };
    serverData(data, func, url, 'get')
};

var depositStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/deposit_stats';
    var func = function (res) {
        console.log(res);
        var depositNames = [];
        var countData = [];
        $('#deposit-stats-tbody').empty();
        $.each(res.results, function (k, v) {
            depositNames.push(v.deposit_display);
            countData.push({'value': v.count, 'name': v.deposit_display});
            createTemplateDom(v, 'deposit-stats-template', 'deposit-stats-tbody');
        });
        var myChart = echarts.init(document.getElementById('deposit-stats'));
        var option = {
            title: {
                text: '退款状态占比',
                subtext: '退款单数占比',
                x: 'right'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: depositNames
            },
            series: [
                {
                    name: '支付渠道',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: countData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    };
    serverData(data, func, url, 'get')
};


var costStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/cost_stats';
    var func = function (res) {
        console.log(res);
        var dateArray = [];
        var coseArray = [];
        var paymentArray = [];
        $('#cost-stats-tbody').empty();
        $.each(res.results, function (k, v) {
            dateArray.push(v.date);
            coseArray.push(v.sum_cost);
            paymentArray.push(v.sum_payment);
            createTemplateDom(v, 'cost-stats-template', 'cost-stats-tbody');
        });
        var myChart = echarts.init(document.getElementById('cost-stats'));
        var option = {
            color: ['blue', 'green'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: dateArray, //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '成本',
                    type: 'bar',
                    barWidth: '20%',
                    data: coseArray//[10, 52, 200, 334, 390, 330, 220]
                },
                {
                    name: '交易额',
                    type: 'bar',
                    barWidth: '20%',
                    data: paymentArray//[10, 52, 200, 334, 390, 330, 220]
                }
            ]
        };

        myChart.setOption(option);
    };
    serverData(data, func, url, 'get')
};

var stockStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/stock_stats';
    var func = function (res) {
        console.log(res);
        var stockNames = [];
        var countData = [];
        $('#stock-stats-tbody').empty();
        $.each(res.results, function (k, v) {
            stockNames.push(v.category_display);
            countData.push({'value': v.sum_cost, 'name': v.category_display});
            createTemplateDom(v, 'stock-stats-template', 'stock-stats-tbody');
        });
        var myChart = echarts.init(document.getElementById('stock-stats'));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: stockNames
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: countData
                }
            ]
        };

        myChart.setOption(option);
    };
    serverData(data, func, url, 'get')
};

var getSumDate = function () {
    var dateFrom = $('#date-from').val();
    var dateTo = $('#date-to').val();
    console.log(dateFrom, dateTo);
    if (dateFrom != '' && dateTo != '') {
        channelPayStats(dateFrom, dateTo);
        refundStats(dateFrom, dateTo);
        depositStats(dateFrom, dateTo);
        costStats(dateFrom, dateTo);
        stockStats(dateFrom, dateTo);
    } else {
        layer.msg('请选择时间');
    }
};


$(function () {
    var dp = $('.date-picker');
    dp.datetimepicker({
        format: 'YYYY-MM-DD'
    });
    //dp.on('dp.change', function () {
    //});
    $('#search').click(function () {
        getSumDate();
    });
});