/**
 * Created by jishu_linjie on 6/4/16.
 */
$(function () {
    domStatusEvent(1);// 已经付款
    domStatusEvent(2);//发货前退款
    domRefundStatusEvent(3, 4);// 缺货退款 默认取4天前的数据
    domRefundStatusEvent(4, 5);// 退货退款 默认取5天前的数据
});

function domRefundStatusEvent(status, days) {
    var dom1 = $('#date-field-' + status);
    dom1.datetimepicker({
        format: 'Y-M-D'
    });
    var date_field = Date.prototype.reduceFormatDate(days);// 获取四天前的日期
    dom1.val(date_field);
    moreType({
        "record_type": 7,
        "timely_type": 6,
        status: dom1.attr('status'),
        date_field: date_field
    }, setSaleStatsSortData);
    dom1.on('dp.change', function (e) {
        $("#status-" + status).empty();
        moreType({
            "record_type": 7,
            "timely_type": 6,
            status: dom1.attr('status'),
            date_field: dom1.val()
        }, setSaleStatsSortData);
    });
}

function domStatusEvent(status) {
    var dom1 = $('#date-field-' + status);
    dom1.datetimepicker({
        format: 'Y-M-D'
    });
    dom1.focus();// 第一次聚焦　　获取首次的日期
    moreType({
        "record_type": 7,
        "timely_type": 6,
        status: dom1.attr('status'),
        date_field: dom1.val()
    }, setSaleStatsSortData);
    dom1.on('dp.change', function (e) {
        $("#status-" + status).empty();
        moreType({
            "record_type": 7,
            "timely_type": 6,
            status: dom1.attr('status'),
            date_field: dom1.val()
        }, setSaleStatsSortData);
    });
}

function setSaleStatsSortData(data) {
    console.log(data);
    var xAixz = [];
    var yAixz = [];
    var titleText = '';
    var status_display = '';
    var status = '';
    var total_num = 0;
    if(data.length==0){
        layer.msg("获取数据为空");
    }
    $.each(data, function (index, v) {
        status = v.status;
        status_display = v.get_status_display;
        titleText = v.get_timely_type_display + v.get_record_type_display;
        xAixz.push(v.current_id + v.name);
        yAixz.push(v.num);
        total_num += v.num;
    });
    $("#status-total-" + status).html(total_num);

    var series = [];
    series.push({name: status_display, data: yAixz});
    setChart($('#status-' + status), titleText, 'xlmm', xAixz, "销售数量", '个', series);
    //showRecordsTips([7, 13, 14], {7: "款式", 13: '供应商', 14: '买手BD'});//
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

