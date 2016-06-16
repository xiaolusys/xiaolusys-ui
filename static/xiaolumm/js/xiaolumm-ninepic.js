/**
 * Created by jishu_linjie on 6/14/16.
 */

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

function createSaleInfoDataDom(obj) {
    var template = $("#sale-product-info-template").html();
    return hereDoc(template).template(obj)
}

function createNinepicDataDom(obj) {
    console.log("nine :", obj);
    if (obj.is_pushed == true) {
        obj.is_pushed = "不推送或已经推送";
    }
    else {
        obj.is_pushed = "要推送";
    }
    var template = $("#nine-pic-tbody").html();
    return hereDoc(template).template(obj)
}


function getSaleProductInfo() {
    var url = '/m/ninepic/get_promotion_product';
    var preday = $("#preday").val();
    serverData({"preday": preday}, setSaleProductInfo, url, 'get')
}

function setSaleProductInfo(res) {
    console.log("sale product info is :", res);
    $("#sale-product-info").empty();
    $.each(res, function (i, v) {
        var html = createSaleInfoDataDom(v);
        $("#sale-product-info").append(html);
    })
}

// 创建记录 后回调
function callbackCreateNinePic(res) {
    console.log("call back crated nine", res);
    var xx = createNinepicDataDom(res);
    var id = $("#modify-object").attr('cid');
    if (res.id == id) {// 修改成功
        $('table #' + id).remove();//删除表格中的旧数据
        $("#nine-pic-tbody-content").append(xx);//替换更新后的数据
    }
}

function saveNineModify() {
    console.log("in modify form");
    var id = $("#modify-object").attr('cid');
    var formdata = $("#modify-form").serializeArray();
    var data = {};
    $(formdata).each(function (index, obj) {
        data[obj.name] = obj.value;
    });

    var url = '/m/ninepic/' + id;
    serverData(data, callbackCreateNinePic, url, 'patch');
    return false
}

function setTodayNiepic(res) {
    console.log('today nine pic', res);
    $.each(res.results, function (i, obj) {
        var html = createNinepicDataDom(obj);
        $("#nine-pic-tbody-content").append(html);
    })
}

function getTargetDaysNinepic(days) {
    var date = Date.prototype.reduceFormatDate(days);//当天的日期
    $("#target-nine-date").html(date);
    var url = '/m/ninepic';
    console.log("data is ", date);
    serverData({"search": date}, setTodayNiepic, url, 'get')
}


function modifyNinepic(td) {
    var target_id = $(td).closest('tr').attr('id');
    $("#modify-object").attr("cid", target_id);//设置修改模态框中id为对应的ｉｄ
    // 填写模态框的内容
    var url = '/m/ninepic/' + target_id;
    serverData('', setModityNiepic, url, 'get');
    function setModityNiepic(res) {
        console.log("the modify instance is :", res);
        $("#cate_gory-modify").val(res.cate_gory);
        $("#description-modify").val(res.description);
        $("#detail_modelids-modify").val(res.detail_modelids);
        if (res.is_pushed) {
            $("#is_pushed-modify").val(1);
        } else {
            $("#is_pushed-modify").val(0);
        }
        $("#start_time-modify").val(res.start_time);
        $("#title-modify").val(res.title);
    }
}

function createDesignPic(obj) {
    var template = $("#design-pic-template").html();
    return hereDoc(template).template(obj)
}

function createUploadDesignPic(obj) {
    var template = $("#design-pic-upload-template").html();
    return hereDoc(template).template(obj)
}

function showNinePic(p) {
    var pics = $(p).attr('pics');
    var ps = pics.split(',');
    var pic_dom = $("#pics-model-imgs");
    var target_id = $(p).closest('tr').attr("id");
    console.log("target_id :", target_id);
    pic_dom.empty();
    $.each(ps, function (i, pic) {
        if (pic != '') {
            var obj = {"pic": pic};
            var html = createDesignPic(obj);
            pic_dom.append(html);
        }
        if (i == ps.length - 1) {
            console.log(i, ps.length);
            var target = {"target_id": target_id};
            var h = createUploadDesignPic(target);
            pic_dom.append(h);
        }
    });
    //// 初始化七牛　的插件
    uploadPics(target_id);
}

var ninePicTargetDays = 0;// 默认为当天
$(document).ready(function () {
    // 加载预计的选款记录
    getSaleProductInfo();
    // 显示当天的九张图记录
    getTargetDaysNinepic(ninePicTargetDays);
    $(".glyphicon-chevron-left").click(function () {
        $("#nine-pic-tbody-content").empty();
        ninePicTargetDays -= 1;
        getTargetDaysNinepic(ninePicTargetDays)
    });

    $(".glyphicon-chevron-right").click(function () {
        $("#nine-pic-tbody-content").empty();
        ninePicTargetDays += 1;
        getTargetDaysNinepic(ninePicTargetDays)
    });
    $("#preday").change(function () {
        getSaleProductInfo();
    });

    $("#create-form").on("submit", function (event) {
        var formdata = $(this).serializeArray();
        var data = {};
        $(formdata).each(function (index, obj) {
            data[obj.name] = obj.value;
        });
        var url = '/m/ninepic';
        serverData(data, callbackCreateNinePic, url, 'post');
        return false
    });
});

function modifyNinepicArray(target_id, pics) {
    console.log("上传成功后处理: target id", target_id, pics);
    // 删除table 中的内容
    $("table #" + target_id).remove();
    var url = '/m/ninepic/' + target_id;
    var p = pics.join(',');
    var data = {"pic_arry": p};
    serverData(data, callbackModifyNinePic, url, 'patch');// 表格中添加修改的项目
    function callbackModifyNinePic(res) {
        console.log("call back crated nine", res);
        var xx = createNinepicDataDom(res);
        $("#nine-pic-tbody-content").append(xx);
        serverData('', resetModityNiepic, url, 'get');
    }

    //　更新上传后　上传框中的记录
    function resetModityNiepic(res) {
        console.log("modify nine pic res:", res);
        var pic_dom = $("#pics-model-imgs");
        pic_dom.empty();
        var ps = res.pic_arry;
        $.each(ps, function (i, pic) {
            if (pic != '') {
                var obj = {"pic": pic};
                var html = createDesignPic(obj);
                pic_dom.append(html);
            }
        });
    }
}


function uploadPics(target_id) {
    var nine_pics = [];
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'uploadfile',
        max_file_size: '100mb',
        flash_swf_url: 'js/plupload/Moxie.swf',
        chunk_size: '4mb',
        uptoken_url: $('#uptoken_url').val(),
        domain: $('#domain').val(),
        auto_start: true,
        init: {
            'FilesAdded': function (up, files) {
            },
            'BeforeUpload': function (up, file) {
            },
            'UploadProgress': function (up, file) {
            },
            'UploadComplete': function (up, file, info) {
                console.log("nine_pics:", nine_pics);
                modifyNinepicArray(target_id, nine_pics);
            },
            'FileUploaded': function (up, file, info) {
                var domain = up.getOption('domain');
                var res = jQuery.parseJSON(info);
                var pic_link = domain + res.key; //获取上传成功后的文件的Url
                console.log("upload pic link:", pic_link);
                nine_pics.push(pic_link);
            },
            'Error': function (up, err, errTip) {
            }
            ,
            'Key': function (up, file) {
                var timestamp = new Date().getTime();
                var key = "nine_pic" + timestamp;
                return key
            }
        }
    });
}

Date.prototype.reduceFormatDate = function (days) {// 计算当前时间指定天数前的日期　格式化为　yyyy-mm-dd
    Date.prototype.reduceDays = function (days) {
        this.setDate(this.getDate() + parseInt(days));
        return this;
    };
    var currentDate = new Date();
    var targetDate = currentDate.reduceDays(days);
    var dd = ('0' + (currentDate.getDate())).slice(-2);
    var mm = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var y = targetDate.getFullYear();
    var someFormattedDate = y + '-' + mm + '-' + dd;
    return someFormattedDate
};


$(function () {
    $('#start_time').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss'
    });

    $('#start_time-modify').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss'
    });
});