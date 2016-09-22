/**
 * Created by jishu_linjie on 5/12/16.
 */

$(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'Y-M-D'
    });
    $('#datetimepicker2').datetimepicker({
        format: 'Y-M-D'
    });
});

function createSaleDataDom(obj) {
    var template = $("#sale-data-template").html();
    return hereDoc(template).template(obj)
}

var taskId = '';
function cleanData() {
    var table = $('.table-bordered').DataTable();
    table.destroy();
    $("#sale-data").empty();

}

$(function(){
    var url = '/statistics/stats/productcategory'
    $.get(url, function(data){
        for (var i = 0; i < data.length; i++) {
            $('select[name="category1"]').append(`
                  <option value="${data[i].cid}">${data[i].name}</option>
            `)
        }
    })

    $('select[name="category1"]').click(function(){
        var cid = $(this).val()
        $.get(url+'?cid='+cid, function(data){
            $('select[name="category2"]').children().remove()
            $('select[name="category3"]').children().remove()
            $('select[name="category2"]').append(`<option value="">---</option>`)
            for (var i = 0; i < data.length; i++) {
                $('select[name="category2"]').append(`
                      <option value="${data[i].cid}">${data[i].name}</option>
                `)
            }
        })
    })

    $('select[name="category2"]').click(function(){
        var cid = $(this).val()
        $.get(url+'?cid='+cid, function(data){
            $('select[name="category3"]').children().remove()
            $('select[name="category3"]').append(`<option value="">---</option>`)
            for (var i = 0; i < data.length; i++) {
                $('select[name="category3"]').append(`
                      <option value="${data[i].cid}">${data[i].name}</option>
                `)
            }
        })
    })
})

$(function () {
    var childClickBtn = $("#data-search-child");
    var femaleClickBtn = $("#data-search-female");
    var allClickBtn = $("#data-search-all");
    var queryClickBtn = $("#data-search-query");

    childClickBtn.click(function () {
        cleanData();
        var time_left = $("#datetimepicker1").val();
        var time_right = $("#datetimepicker2").val();
        if (time_left == "" || time_right == "") {
            layer.msg('时间不能为空');
            return
        }
        var data = {"time_left": time_left, "time_right": time_right, "category": "child"};
        getTaskRequest(data, childClickBtn);
    });
    femaleClickBtn.click(function () {
        cleanData();
        var time_left = $("#datetimepicker1").val();
        var time_right = $("#datetimepicker2").val();
        if (time_left == "" || time_right == "") {
            layer.msg('时间不能为空');
            return
        }
        var data = {"time_left": time_left, "time_right": time_right, "category": "female"};
        getTaskRequest(data, childClickBtn);
    });
    allClickBtn.click(function () {
        cleanData();
        var time_left = $("#datetimepicker1").val();
        var time_right = $("#datetimepicker2").val();
        if (time_left == "" || time_right == "") {
            layer.msg('时间不能为空');
            return
        }
        var data = {"time_left": time_left, "time_right": time_right};
        getTaskRequest(data, childClickBtn);
    });
    queryClickBtn.click(function () {
        cleanData();
        var time_left = $("#datetimepicker1").val();
        var time_right = $("#datetimepicker2").val();
        if (time_left == "" || time_right == "") {
            layer.msg('时间不能为空');
            return
        }
        category1 = $('select[name="category1"]').val();
        category2 = $('select[name="category2"]').val();
        category3 = $('select[name="category3"]').val();
        category = $('select[name="category3"]').val() ||$('select[name="category2"]').val() || $('select[name="category1"]').val()
        var data = {"time_left": time_left, "time_right": time_right, "category": category};
        getTaskRequest(data, childClickBtn);
    });


    function getTaskRequest(data, clickBtn) {
        if (clickBtn.hasClass('loading')) {
            return
        }
        $("#sale-data").empty();
        clickBtn.addClass('loading');
        var index = layer.load(1, {
            shade: [0.1, '#FFB000']
        });
        var requestUrl = '/statistics/pay/salenum';

        $.ajax({
            type: 'get',
            url: requestUrl,
            data: data,
            dataType: 'json',
            success: getTaskId,
            error: function (data) {
                console.log('debug profile:', data);
                if (data.status == 403) {
                    drawToast('您还没有登陆哦!');
                }
            }
        });
        function getTaskId(res) {
            console.log("step 1 res:", res);
            taskId = res.task_id;
            getTaskData();
        }
    }

    function getTaskData() {
        var taskRequestUrl = "/djcelery/" + taskId + "/status/";
        $.ajax({
            type: 'get',
            url: taskRequestUrl,
            dataType: 'json',
            success: setOrderData,
            error: function (data) {
                console.log('debug profile:', data);
                if (data.status == 403) {
                    drawToast('您还没有登陆哦!');
                }
            }
        });
        function setOrderData(res) {
            console.log("task res:", res);
            if (res.task.status == "SUCCESS") {
                $("#data-search-female").removeClass('loading');
                $("#data-search-all").removeClass('loading');
                $("#data-search-child").removeClass('loading');

                layer.closeAll();
                $("#time-consuming").val("耗时 " + res.task.result.time_consuming + "s");
                console.log(res);
                $.each(res.task.result.data, function (i, val) {
                    var itemdom = createSaleDataDom(val);
                    $("#sale-data").append(itemdom);
                });
                var table = $('.table-bordered').DataTable();
                console.log("table:", table);
            }
            else {
                setTimeout(getTaskData, 2500);
            }
        }
    }
});