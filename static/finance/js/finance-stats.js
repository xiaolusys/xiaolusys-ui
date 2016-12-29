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


function ulList() {
    var ul = '<li role="presentation" class="active"><a href="#">Home</a></li>' +
        '<li role="presentation"><a href="#channel-pay">交易渠道占比</a></li>' +
        '<li role="presentation"><a href="#status-refund">退款金额笔数</a></li>' +
        '<li role="presentation"><a href="#refund-good-status">退货金额笔数</a></li>' +
        '<li role="presentation"><a href="#deposit">押金金额笔数</a></li>' +
        '<li role="presentation"><a href="#stock-category">库存分类统计</a></li>' +
        '<li role="presentation"><a href="#sale-cost">销量成本核算</a></li> ' +
        '<li role="presentation"><a href="#mama-order-carry">代理提成统计</a></li>' +
        '<li role="presentation"><a href="#boutique">精品(券/产品)统计</a></li>';
    $("#list-stats").empty();
    $("#list-stats").append(ul);
}
var channelPayStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/channel_pay_stats';
    var func = function (res) {
        var channelNames = [];
        var countData = [];
        $('#channel-pay-tbody').empty();
        var a1 = '<h4><span class="label label-primary">单数：' + res.aggregate_data.total_count + '</span> | ';
        var a2 = '<span class="label label-primary">总付款：' + res.aggregate_data.total_payment + '</span> | ';
        var a3 = '<span class="label label-primary">合计总费用：' + res.aggregate_data.total_fees + '</span></h4>';
        $('#channel-pay-desc').html(res.desc + a1 + a2 + a3);
        $("#channel-pay-sql").html('<span class="label label-success">SQL:</span>' + res.sql);
        $.each(res.items_data, function (k, v) {
            channelNames.push(v.channel_display);
            countData.push({'value': v.count, 'name': v.channel_display});
            createTemplateDom(v, 'channel-pay-template', 'channel-pay-tbody');
        });
        var myChart = echarts.init(document.getElementById('channel-pay-stats'));
        var option = {
            title: {
                text: '支付渠道支付占比',
                subtext: '支付单数占比',
                x: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
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
        var refundNames = [];
        var countData = [];
        $('#refund-stats-tbody').empty();

        $.each(res.items_data, function (k, v) {
            refundNames.push(v.refund_status_display);
            countData.push({'value': v.count, 'name': v.refund_status_display});
            createTemplateDom(v, 'refund-stats-template', 'refund-stats-tbody');
        });
        var a1 = '<h4><span class="label label-primary">单数：' + res.aggregate_data.total_count + '</span> | ';
        var a2 = '<span class="label label-primary">总金额：' + res.aggregate_data.total_payment + '</span></h4>';
        $('#refund-desc').html(res.desc + a1 + a2);
        $("#refund-sql").html('<span class="label label-success">SQL:</span>' + res.sql);
        var myChart = echarts.init(document.getElementById('refund-stats'));
        var option = {
            title: {
                text: '退款状态占比',
                subtext: '退款单数占比',
                x: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                data: refundNames
            },
            series: [
                {
                    name: '退款状态',
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


var returnGoodStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/return_good_stats';
    var func = function (res) {
        var returnGoodNames = [];
        var countData = [];
        $('#return-good-stats-tbody').empty();
        var a1 = '<h4><span class="label label-primary">单数：' + res.aggregate_data.total_count + '</span> | ';
        var a2 = '<span class="label label-primary">总金额：' + res.aggregate_data.total_payment + '</span></h4>';
        $('#refund-good-desc').html(res.desc + a1 + a2);
        $("#refund-good-sql").html('<span class="label label-success">SQL:</span>' + res.sql);
        $.each(res.items_data, function (k, v) {
            returnGoodNames.push(v.return_good_status_display);
            countData.push({'value': v.count, 'name': v.return_good_status_display});
            createTemplateDom(v, 'return-good-stats-template', 'return-good-stats-tbody');
        });
        var myChart = echarts.init(document.getElementById('return-good-stats'));
        var option = {
            title: {
                text: '发货退款状态占比',
                subtext: '发货退款单数占比',
                x: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                data: returnGoodNames
            },
            series: [
                {
                    name: '退货状态',
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
        var depositNames = [];
        var countData = [];
        $('#deposit-stats-tbody').empty();
        var a1 = '<h4><span class="label label-primary">单数：' + res.aggregate_data.total_count + '</span> | ';
        var a2 = '<span class="label label-primary">总金额：' + res.aggregate_data.total_payment + '</span></h4>';
        $('#deposit-desc').html(res.desc + a1 + a2);
        $("#deposit-sql").html('<span class="label label-success">SQL:</span>' + res.sql);
        $.each(res.items_data, function (k, v) {
            depositNames.push(v.deposit_display);
            countData.push({'value': v.count, 'name': v.deposit_display});
            createTemplateDom(v, 'deposit-stats-template', 'deposit-stats-tbody');
        });
        var myChart = echarts.init(document.getElementById('deposit-stats'));
        var option = {
            title: {
                text: '押金单占比',
                subtext: '押金单占比',
                x: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                data: depositNames
            },
            series: [
                {
                    name: '押金占比',
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


var stockStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/stock_stats';
    var func = function (res) {
        var stockNames = [];
        var countData = [];
        $('#stock-stats-tbody').empty();
        var a1 = '<h4><span class="label label-primary">单数：' + res.aggregate_data.total_count + '</span> | ';
        var a2 = '<span class="label label-primary">总金额：' + res.aggregate_data.total_payment + '</span></h4>';
        $('#stock-category-desc').html(res.desc + a1 + a2);
        $("#stock-category-sql").html('<span class="label label-success">SQL:</span>' + res.sql);
        $.each(res.items_data, function (k, v) {
            stockNames.push(v.category_display);
            countData.push({'value': v.sum_cost, 'name': v.category_display});
            createTemplateDom(v, 'stock-stats-template', 'stock-stats-tbody');
        });
        var myChart = echarts.init(document.getElementById('stock-stats'));
        var option = {
            title: {
                text: '库存分类占比',
                subtext: '库存分类占比',
                x: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data: stockNames
            },
            series: [
                {
                    name: '分类占比',
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
        console.log(res.desc);
        var dateArray = [];
        var coseArray = [];
        var paymentArray = [];
        $('#cost-stats-date-tbody').empty();
        var a1 = '<h4><span class="label label-primary">商品件数：' + res.aggregate_data.total_count + '</span> | ';
        var a2 = '<span class="label label-primary">交易总金额：' + res.aggregate_data.total_payment + '</span></h4>';
        $('#sale-cost-desc').html(res.desc + a1 + a2);
        $("#sale-cost-sql").html('<span class="label label-success">SQL:</span>' + res.sql);
        $.each(res.items_data, function (k, v) {
            dateArray.push(v.date);
            coseArray.push(v.sum_cost);
            paymentArray.push(v.sum_payment);
            createTemplateDom(v, 'cost-stats-date-template', 'cost-stats-date-tbody');
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


var orderCarryStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/mama_order_carry_stats';
    var func = function (res) {
        var dateArray = [];
        var carryNumData = [];
        var orderValueData = [];
        $('#order-carry-stats-tbody').empty();
        var a1 = '<h4><span class="label label-primary">单数：' + res.aggregate_data.total_count + '</span> | ';
        var a2 = '<span class="label label-primary">总金额：' + res.aggregate_data.total_carry_num + '</span> | ';
        var a3 = '<span class="label label-primary">总提成：' + res.aggregate_data.total_order_value + '</span></h4>';
        $('#mama-order-carry-desc').html(res.desc + a1 + a2 + a3);
        $("#mama-order-carry-sql").html('<span class="label label-success">SQL:</span>' + res.sql);
        $.each(res.items_data, function (k, v) {
            dateArray.push(v.date);
            carryNumData.push(v.sum_carry_num);
            orderValueData.push(v.sum_order_value);
            createTemplateDom(v, 'order-carry-stats-template', 'order-carry-stats-tbody');
        });
        var myChart = echarts.init(document.getElementById('order-carry-stats'));
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
                    name: '提成金额',
                    type: 'bar',
                    barWidth: '20%',
                    data: carryNumData//[10, 52, 200, 334, 390, 330, 220]
                },
                {
                    name: '交易额',
                    type: 'bar',
                    barWidth: '20%',
                    data: orderValueData//[10, 52, 200, 334, 390, 330, 220]
                }
            ]
        };

        myChart.setOption(option);
    };
    serverData(data, func, url, 'get')
};


var boutiqueStats = function (dateFrom, dateTo) {
    var data = {'date_from': dateFrom, 'date_to': dateTo};
    var url = '/apis/finance/v1/boutique_coupon_stat';
    var func = function (res) {
        var dateArray = [];
        var status0NumData = [];
        var status1NumData = [];
        var status2NumData = [];
        var status0ValueData = [];
        var status1ValueData = [];
        var status2ValueData = [];
        $('#boutique-stats-tbody').empty();
        var aggregate_info = [
            '<h3>精品券销售统计:</h3><span><br>',
            '<span class="label label-primary">总张数：' + res.aggregate_data.total_count,
            '<span class="label label-primary">总券额：' + res.aggregate_data.total_value,

            '<span class="label label-primary">总券购买订单数：' + res.aggregate_data.orders_s_num,
            '<span class="label label-primary">总券购买金额：' + res.aggregate_data.orders_s_payment,

            '<br><h3>精品商品销售统计:</h3><span>',

            '<span class="label label-primary">总精品商品订单件数：' + res.aggregate_data.total_boutique_num,
            '<span class="label label-primary">总精品商品订单金额：' + res.aggregate_data.total_boutique_payment,
            '<span class="label label-primary">总精品商品订单退款额：' + res.aggregate_data.total_refund_boutique_fee,
        ];

        var info_spans = ['<h4>', '</h4>'].join([separator = aggregate_info.join([separator = '</span> | '])]);

        $('#boutique-desc').html(res.desc + info_spans);
        $("#boutique-sql").html('<span class="label label-success">SQL:</span>' + res.sql);
        var satus0Cnt = 0;
        var satus1Cnt = 0;
        var satus2Cnt = 0;
        $.each(res.items_data, function (k, v) {
            if (dateArray.indexOf(v.date) < 0) {
                dateArray.push(v.date);
            }
            var index = dateArray.indexOf(v.date);

            if (v.status == 0) {
                if (status0NumData[index] == undefined) {
                    status0NumData[index] = v.count
                }
                else {
                    status0NumData[index] += v.count
                }
                satus0Cnt += v.count
            }
            if (v.status == 1) {
                if (status1NumData[index] == undefined) {
                    status1NumData[index] = v.count
                }
                else {
                    status1NumData[index] += v.count
                }
                satus1Cnt += v.count
            }
            if (v.status == 2) {
                if (status2NumData[index] == undefined) {
                    status2NumData[index] = v.count
                }
                else {
                    status2NumData[index] += v.count
                }
                satus2Cnt += v.count
            }
            createTemplateDom(v, 'boutique-template', 'boutique-stats-tbody');
        });
        var myChart = echarts.init(document.getElementById('boutique-stats'));
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
                    name: '未使用张数',
                    type: 'bar',
                    barWidth: '20%',
                    data: status0NumData//[10, 52, 200, 334, 390, 330, 220]
                }, {
                    name: '使用张数',
                    type: 'bar',
                    barWidth: '20%',
                    data: status1NumData//[10, 52, 200, 334, 390, 330, 220]
                }, {
                    name: '冻结张数',
                    type: 'bar',
                    barWidth: '20%',
                    data: status2NumData//[10, 52, 200, 334, 390, 330, 220]
                }
            ]
        };
        var myChart2 = echarts.init(document.getElementById('boutique-stats-rate'));
        var option2 = {
            title: {
                text: '状态占比',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['未使用', '已使用', '冻结']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: satus0Cnt, name: '未使用'},
                        {value: satus1Cnt, name: '已使用'},
                        {value: satus2Cnt, name: '冻结'}
                    ],
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
        myChart2.setOption(option2);
    };
    serverData(data, func, url, 'get')
};


var getSumDate = function (dateFrom, dateTo) {
    if (dateFrom != '' && dateTo != '') {
        channelPayStats(dateFrom, dateTo);
        refundStats(dateFrom, dateTo);
        depositStats(dateFrom, dateTo);
        costStats(dateFrom, dateTo);
        stockStats(dateFrom, dateTo);
        returnGoodStats(dateFrom, dateTo);
        orderCarryStats(dateFrom, dateTo);
        boutiqueStats(dateFrom, dateTo);
    } else {
        layer.msg('请选择时间');
    }
};


$(function () {
    var dp = $('.date-picker');
    ulList();
    dp.datetimepicker({
        format: 'YYYY-MM-DD'
    });
    var d = new Date();
    var m = d.getMonth() + 1;
    var today = d.getFullYear() + '-' + m + '-' + d.getDate();
    $('#date-to').val(today);
    $('#search').on('click', function () {
        console.log(123123);
        var dateFrom = $('#date-from').val();
        var dateTo = $('#date-to').val();
        if (dateFrom && dateTo && dateFrom != dateTo) {
            getSumDate(dateFrom, dateTo);
        }
    });
});
