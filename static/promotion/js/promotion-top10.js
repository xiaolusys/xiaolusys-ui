//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
//var BASE_URL = 'http://m.xiaolumeimei.com';
var BASE_URL = '';
var g_activity_id = 0;
var g_pic_num = 0;

var top10_pics = new Array();
var top10_pic_model = {
    activity_id: 0,
    pic_type: 0,
    model_id:0,
    product_name:'',
    pic_path:'',
    location_id:0,
    jump_url:''
};

function showTop10Pics(activity_id) {
    var topic_url = '/sale/promotion/promotion/goods/get_goods_pics_by_promotionid';
    var url = BASE_URL + topic_url+"?promotion_id="+activity_id;

    //alert("url="+url);
    var callback = function (res) {
        console.log(res);
        top10_pics= [];

        if (res) {

            $(".table tbody").html("");
//            var rowinfo = ' <tr>' +
//                           '<td>位置</th>'+
//                           '<td>图片类型</th>'+
//                            '<td>商品名称</th>'+
//                            '<td>商品款式id</th>'+
//                            '<td>图片链接</th>'+
//                            '<td>操作</th>'+
//                        '</tr>';
//            $(".table").append(rowinfo);

            console.log("res length=",res.length);
            if(res.length == 0){
                console.log("pic empty 2");
                initTable();
                initData();
                return;
            }
            else{
                var num = top10_pics.length;
                var max = g_pic_num;
                if(g_pic_num < res.length)
                    max = num
                for(i=0; i<max;i++){
                    top10_pics[i] = cloneObject(top10_pic_model);
                    top10_pics[i].activity_id = g_activity_id;
                    if(i < res.length){
                        top10_pics[i].location_id = res[i].location_id;
                        top10_pics[i].pic_type=res[i].pic_type;
                        top10_pics[i].model_id=res[i].model_id;
                        top10_pics[i].product_name=res[i].product_name;
                        top10_pics[i].pic_path=res[i].product_img;
                        top10_pics[i].jump_url=res[i].jump_url;
                    }
                    else{
                        top10_pics[i].location_id = i+1;
                    }
                }
                initTableWithData(top10_pics);
            }


        }
        else{
            alert("pic empty1");
        }

//        var topic_url = '/sale/promotion/promotion/goods/get_goods_pics_by_promotionid';
//        var url = BASE_URL + topic_url+"?promotion_id="+activity_id;
//        $.ajax({url:url, success:callback2});
    };

//    var callback2 = function (res) {
//        console.log(res);
//        if (res) {
//
//            $(".table tbody").html("");
//            var rowinfo = ' <tr>' +
//               '<th>位置</th>'+
//               '<th>图片类型</th>'+
//                '<th>商品名称</th>'+
//                '<th>商品款式id</th>'+
//                '<th>图片链接</th>'+
//                '<th>操作</th>'+
//            '</tr>';
//            $(".table").append(rowinfo);
//
//            var arr = res
//            console.log(arr.length == 0);
//            if(arr.length == 0 && top10_pics.length ==0){
//                //显示15个空记录
//                console.log("pic empty 2");
//                initTable();
//                initData();
//                return;
//            }
//
//            var num = top10_pics.length;
//            var max = g_pic_num;
//            if(g_pic_num < num+arr.length)
//                max = num+arr.length
//            for(i=0; i<max-num;i++){
//                top10_pics[i+num] = cloneObject(top10_pic_model);
//                top10_pics[i+num].activity_id = g_activity_id;
//                if(i < arr.length){
//                    top10_pics[i+num].location_id = arr[i].location_id;
//                    top10_pics[i+num].pic_type=3;
//                    top10_pics[i+num].model_id=arr[i].model_id;
//                    top10_pics[i+num].product_name=arr[i].product_name;
//                    top10_pics[i+num].pic_path=arr[i].product_img;
//                }
//                else{
//                    top10_pics[i+num].location_id = i+num+1;
//                }
//            }
//
//            initTableWithData(top10_pics);
//
//        }
//        else{
//            alert("pic empty1");
//        }
//    };
    $.ajax({url:url, success:callback});
}

function locationChange(obj,event){
    var keynum;
    var keychar;
    keynum = window.event ? event.keyCode : event.which;
    keychar = String.fromCharCode(keynum);
    if(keynum != 13) return;

    var tr_id=$(obj).closest('tr').attr('id');
    console.log("tr ="+ tr_id);
    top10_pics[tr_id].location_id = parseInt(obj.value);

}

function idChange(obj,event){
//    var keynum;
//    var keychar;
//    keynum = window.event ? event.keyCode : event.which;
//    keychar = String.fromCharCode(keynum);
//    if(keynum != 13) return;

    //alert("changed value is " + obj);
    g_activity_id = obj;

}

function goodsNumChange(obj,event){
    var keynum;
    var keychar;
    keynum = window.event ? event.keyCode : event.which;
    keychar = String.fromCharCode(keynum);
    if(keynum != 13) return;

    //alert("changed value is " + obj);
    g_pic_num = parseInt(obj);
    showTop10Pics(g_activity_id);

    if(top10_pics.length > g_pic_num){
        alert("有多余的图片需要删除");
    }

}

function modelidChange(obj,event){

    var keynum;
    var keychar;
    keynum = window.event ? event.keyCode : event.which;
    keychar = String.fromCharCode(keynum);
    if(keynum != 13) return;

    var tr_id=$(obj).closest('tr').attr('id');
    console.log("tr ="+ tr_id + " modelid="+obj.value);
    top10_pics[tr_id].model_id = obj.value;
    //找出商品名和商品头图链接
    var product_url = BASE_URL + "/rest/v2/modelproducts/get_headimg?modelId="+obj.value;
    var callback = function (res) {
        console.log(res);
        if (res) {
            var arr = res
            console.log("modellist callback ,length="+arr.length + " tr_id="+tr_id);
            if(arr.length == 0){
                console.log("modelid info empty");
                return;
            }

            top10_pics[tr_id].product_name = arr[0].name;
            top10_pics[tr_id].pic_path =  arr[0].head_img;
            console.log("modelidChange end top10_pics=", top10_pics);
            console.log("td="+ $($(obj).closest('tr').children('td').eq(2)).text());
            $($(obj).closest('tr').children('td').eq(2)).html(arr[0].name);
            $($(obj).closest('tr').children('td').eq(4).children()).attr('src', arr[0].head_img);

        }
        else{
            alert("pic empty1");
        }
    };

    //商品才去找图片和名称
    if(top10_pics[tr_id].pic_type == 5 || top10_pics[tr_id].pic_type == 6){
        $.ajax({url:product_url, success:callback});
    }
}

function jumpTypeChange(obj,event){
    var keynum;
    var keychar;
    keynum = window.event ? event.keyCode : event.which;
    keychar = String.fromCharCode(keynum);
    if(keynum != 13) return;

    //alert("changed value is " + obj);
    var tr_id=$(obj).closest('tr').attr('id');
    console.log("tr ="+ tr_id + " jumtypeid="+obj.value);

    if(obj.value ){
        if (top10_pics[tr_id].jump_url.indexOf('activity_id') > 0 ){
            top10_pics[tr_id].jump_url = "com.jimei.xlmm://app/v1/webview?activity_id=";
            tempurl = obj.value + "&url=" + "http://m.xiaolumeimei.com/mall/activity/topTen/model/2?id=" + obj.value;
            top10_pics[tr_id].jump_url += tempurl;
        }
        else{
            top10_pics[tr_id].jump_url = "com.jimei.xlmm://app/v1/products/category?cid=";
            top10_pics[tr_id].jump_url += obj.value;
        }
    }

}

function initTable(){
    //console.log("init table");
    if(g_pic_num ==0 )
        alert("请输入商品个数");
    for(i =0; i< g_pic_num; i++){
        insertRow(i);
    }
}

function cloneObject(obj){
    var o = obj.constructor === Array ? [] : {};
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
        o[i] = typeof obj[i] === "object" ? cloneObject(obj[i]) : obj[i];
        }
    }
    return o;
}

function initData(){
    console.log("init data");
    for(i =0; i< g_pic_num; i++){
        top10_pics[i] = cloneObject(top10_pic_model);
        top10_pics[i].activity_id = g_activity_id;
        top10_pics[i].location_id = i+1;
//        console.log(" " + i +" "+top10_pics[i]);
    }
}

//插入一行
function insertRow(rowid)
{
  //debugger;

  var rowinfo = '<tr id=' +rowid + ' >' +
                '<td><input class="location_id" type="text"  onkeydown="locationChange(this,event)" value="'+ (rowid+1)+ '"> </td>' +
          '<td><div class="col-sm-3 dropdown">' +
                '<input id="dropdownMenu'+ rowid + '" type="button" class="btn dropdown-toggle"  data-toggle="dropdown" value="选择类型"/>' +
                '<ul class="dropdown-menu" aria-labelledby="condition-record-type">' +
                    '<li><a  class="dimension banner-type"  type-id="0">Banner</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="1">优惠券领前</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="2">优惠券领后</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="3">主题入口</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="4">分类说明</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="5">横放商品</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="6">竖放商品</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="7">分享</a></li>' +
                '</ul>' +
            '</div></td>' +
          '<td class="model_name"></td>' +
          '<td><input class="model_id" type="text"  placeholder="输入modelid或优惠券id" onkeydown="modelidChange(this,event)" ></td>' +
          '<td><img class="preview_img" src="" style="float: right" width="100px" height="100px"></td>'+
          '<td><a class="btn btn-info pic_of_top10" style="margin-top: 5px;float: right" onclick="uploadPic(this)"' +
                               'cid="upload_top10.html">上传图片</a></td>' +
          '<td><div class="col-sm-3 dropdown">' +
                '<input id="jumpMenu'+ rowid + '" type="button" class="btn dropdown-toggle"  data-toggle="dropdown" value="选择跳转类型"/>' +
                '<ul class="dropdown-menu" aria-labelledby="condition-record-type">' +
                    '<li><a  class="dimension jump-type"  type-id="0">活动</a></li>' +
                    '<li><a  class="dimension jump-type"  type-id="1">分类</a></li>' +
                '</ul>' +
            '</div></td>' +
          '<td><input class="jump_url" type="text"  placeholder="输入跳到的活动id或分类id" onkeydown="jumpTypeChange(this,event)" ></td>' +
          '<td><a class="btn btn-info del" style="margin-top: 5px;float: right" onclick="delRow(this)">删除</a></td>' +
        '</tr>';


    $(".table").append(rowinfo);
    $('.dropdown-toggle').dropdown();

    $(".banner-type").click(function(){
        var rowid= $(this).closest('tr').attr('id');
        console.log( $(this).attr('type-id'));
        $("#dropdownMenu"+rowid).val($(this).html());
        top10_pics[rowid].pic_type = $(this).attr('type-id');
    });

    $(".jump-type").click(function(){
        var rowid= $(this).closest('tr').attr('id');
        console.log( $(this).attr('type-id'));
        $("#jumpMenu"+rowid).val($(this).html());
        if ($(this).attr('type-id') == 0){
            top10_pics[rowid].jump_url = "com.jimei.xlmm://app/v1/webview?activity_id=";
        }
        else{
            top10_pics[rowid].jump_url = "com.jimei.xlmm://app/v1/products/category?cid=";
        }
    });
}

function initTableWithData(arr){

    if(g_pic_num ==0 )
        alert("请输入商品个数");

    var num = g_pic_num;
    if(g_pic_num < arr.length)
        num = arr.length

    console.log("initTableWithData picnum:"+ g_pic_num+" arr.length:", arr.length);
    for(i =0; i< num; i++){

        insertRowWithData(i, arr);
    }
}

//插入一行
function insertRowWithData(rowid, arr)
{
  //debugger;

  var rowinfo = "";
  if(arr.length <= rowid){
      rowinfo += '<tr id=' +rowid + ' >' +
                '<td><input class="location_id" type="text"  onkeydown="locationChange(this,event)" value="'+ (rowid+1)+ '"> </td>' +
          '<td><div class="col-sm-3 dropdown">' +
                '<input id="dropdownMenu'+ rowid + '" type="button" class="btn dropdown-toggle"  data-toggle="dropdown" value="选择类型"/>' +
                '<ul class="dropdown-menu" aria-labelledby="condition-record-type">' +
                    '<li><a  class="dimension banner-type"  type-id="0">Banner</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="1">优惠券领前</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="2">优惠券领后</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="3">主题入口</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="4">分类说明</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="5">横放商品</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="6">竖放商品</a></li>' +
                    '<li><a  class="dimension banner-type"  type-id="7">分享</a></li>' +
                '</ul>' +
            '</div></td>' +
          '<td class="model_name"></td>' +
          '<td><input class="model_id" type="text"  placeholder="输入modelid或优惠券id" onkeydown="modelidChange(this,event)" ></td>' +
          '<td><img class="preview_img" src="" style="float: right" width="100px" height="100px"></td>'+
          '<td><a class="btn btn-info pic_of_top10" style="margin-top: 5px;float: right" onclick="uploadPic(this)"' +
                               'cid="upload_top10.html">上传图片</a></td>' +
          '<td><div class="col-sm-3 dropdown">' +
                '<input id="jumpMenu'+ rowid + '" type="button" class="btn dropdown-toggle"  data-toggle="dropdown" value="选择跳转类型"/>' +
                '<ul class="dropdown-menu" aria-labelledby="condition-record-type">' +
                    '<li><a  class="dimension jump-type"  type-id="0">活动</a></li>' +
                    '<li><a  class="dimension jump-type"  type-id="1">分类</a></li>' +
                '</ul>' +
            '</div></td>' +
          '<td><input class="jump_url" type="text"  placeholder="输入跳到的活动id或分类id" onkeydown="jumpTypeChange(this,event)" ></td>' +
          '<td><a class="btn btn-info del" style="margin-top: 5px;float: right" onclick="delRow(this)">删除</a></td>' +
        '</tr>';
  }
  else{
      var location_id = "";
      if(arr[rowid].location_id != 0){
        location_id = arr[rowid].location_id+"";
      }

      var pic_type = "";
      switch(arr[rowid].pic_type){
        case 0:
            pic_type = "Banner";
            break;
        case 1:
            pic_type = "优惠券领前";
            break;
        case 2:
            pic_type = "优惠券领后";
            break;
        case 3:
            pic_type = "主题入口";
            break;
        case 4:
            pic_type = "分类说明";
            break;
        case 5:
            pic_type = "横放商品";
            break;
        case 6:
            pic_type = "竖放商品";
            break;
        case 7:
            pic_type = "分享";
            break;
      }

      var model_name = "";
      if(arr[rowid].product_name){
        model_name = arr[rowid].product_name;
      }

      var model_id = "";
      if(arr[rowid].model_id != 0){
        model_id = arr[rowid].model_id+"";
      }

      var pic_path = "";
      if(arr[rowid].pic_path){
        pic_path = arr[rowid].pic_path;
      }

      var jump_type="";
      var jump_id="";
      if(arr[rowid].jump_url == null || arr[rowid].jump_url == undefined || arr[rowid].jump_url=="" ){
           jump_type="选择跳转类型";
           jump_id="";
      } else {
            begin = arr[rowid].jump_url.indexOf("activity_id");
            if(begin>0){
                jump_type="活动";
                jump_id = parseInt(arr[rowid].jump_url.substring(begin+12));
            } else{
                jump_type="分类";
                begin = arr[rowid].jump_url.indexOf("cid");
                jump_id = arr[rowid].jump_url.substring(begin+4);

            }
      }

      rowinfo += '<tr id=' +rowid + ' >' +
                    '<td><input class="location_id" type="text"  onkeydown="locationChange(this,event)" value="'+ location_id+ '"> </td>' +
              '<td><div class="col-sm-3 dropdown">' +
                    '<input id="dropdownMenu'+ rowid + '" type="button" class="btn dropdown-toggle"  data-toggle="dropdown" value='+pic_type +' />' +
                    '<ul class="dropdown-menu" aria-labelledby="condition-record-type">' +
                        '<li><a  class="dimension banner-type"  type-id="0">Banner</a></li>' +
                        '<li><a  class="dimension banner-type"  type-id="1">优惠券领前</a></li>' +
                        '<li><a  class="dimension banner-type"  type-id="2">优惠券领后</a></li>' +
                        '<li><a  class="dimension banner-type"  type-id="3">主题入口</a></li>' +
                        '<li><a  class="dimension banner-type"  type-id="4">分类说明</a></li>' +
                        '<li><a  class="dimension banner-type"  type-id="5">横放商品</a></li>' +
                        '<li><a  class="dimension banner-type"  type-id="6">竖放商品</a></li>' +
                        '<li><a  class="dimension banner-type"  type-id="7">分享</a></li>' +
                    '</ul>' +
                '</div></td>' +
              '<td class="model_name">'+ model_name+'</td>' +
              '<td><input class="model_id" type="text"  placeholder="输入modelid或优惠券id" onkeydown="modelidChange(this,event)" value='+ model_id+'></td>' +
              '<td><img class="preview_img" src='+ pic_path+' style="float: right" width="100px" height="100px"></td>'+
              '<td><a class="btn btn-info pic_of_top10" style="margin-top: 5px;float: right" onclick="uploadPic(this)"' +
                                   'cid="upload_top10.html">上传图片</a></td>' +
              '<td><div class="col-sm-3 dropdown">' +
                '<input id="jumpMenu'+ rowid + '" type="button" class="btn dropdown-toggle"  data-toggle="dropdown" value='+ jump_type +' />' +
                '<ul class="dropdown-menu" aria-labelledby="condition-record-type">' +
                    '<li><a  class="dimension jump-type"  type-id="0">活动</a></li>' +
                    '<li><a  class="dimension jump-type"  type-id="1">分类</a></li>' +
                '</ul>' +
              '</div></td>' +
              '<td><input class="jump_url" type="text"  placeholder="输入跳到的活动id或分类id" onkeydown="jumpTypeChange(this,event)" value='+ jump_id+'></td>' +
              '<td><a class="btn btn-info del" style="margin-top: 5px;float: right" onclick="delRow(this)" >删除</a></td>' +
            '</tr>';
  }

    $(".table").append(rowinfo);
    $('.dropdown-toggle').dropdown();

    $(".banner-type").click(function(){
        var rowid= $(this).closest('tr').attr('id');
        console.log(rowid);
        console.log( $(this).attr('type-id'));
        $("#dropdownMenu"+rowid).val($(this).html());
        top10_pics[rowid].pic_type = $(this).attr('type-id');
    });

    $(".jump-type").click(function(){
        var rowid= $(this).closest('tr').attr('id');
        console.log( $(this).attr('type-id'));
        $("#jumpMenu"+rowid).val($(this).html());
        if ($(this).attr('type-id') == 0){
            top10_pics[rowid].jump_url = "com.jimei.xlmm://app/v1/webview?activity_id=";
        }
        else{
            top10_pics[rowid].jump_url = "com.jimei.xlmm://app/v1/products/category?cid=";
        }
    });
}


var pop_frame = 1;
function uploadPic(dom){

    var poppage_url = $(dom).attr('cid');
             console.log("上传页面地址 :", poppage_url );

             layer.open({
                 type: 2,
                 title: '上传top10图片页面',
                 shadeClose: true,
                 shade: 0.8,
                 area: ['500px', '61%'],
                 content: poppage_url,
                 btn: ['确定上传成功']
                 , yes: function () {
                     console.log(location.href);
                     console.log($('iframe'));
                     console.log("上传成功后给的链接:", $(window.frames["layui-layer-iframe" + pop_frame].document).find("body img").attr('src'));
                     var src = $(window.frames["layui-layer-iframe" + pop_frame].document).find("body img").attr('src');
                     $($(dom).closest('tr').children('td').eq(4).children()).attr('src', src);
                     var tr_id=$(dom).closest('tr').attr('id');
                     console.log("tr_id "+tr_id + " src="+src);
                     top10_pics[tr_id].pic_path =src;
                     pop_frame += 1;
                     layer.closeAll();
                 }
             });
}

function delRow(obj){
    $(obj).parent().parent().remove();
     var tr_id=$(obj).closest('tr').attr('id');
     top10_pics.splice(tr_id, 1);
     console.log("delrow ", top10_pics);
}

function commitClick(obj){
    console.log("commit top10_pics=", top10_pics);
    if(g_pic_num < top10_pics.length)
        alert("图片比预期的多了,需要删除一些");

    var json = JSON.stringify(top10_pics);
    console.log("json=", json);

    var topic_url = '/sale/promotion/promotion/goods/save_pics';
    var url = BASE_URL + topic_url;
    //alert("url="+url);
    var callback = function (res) {
        console.log(res);
        if (res) {
            if(res.code ==0){
                alert("保存成功!");
            }
            else if(res.code ==1){
                alert(res.info);
            }
        }
    };
    $.ajax({
            url: url,
            data: {"arr": json, "promotion_id": g_activity_id},
            type: "post",
            dataType: "json",
            success: callback,
            error: function(e) {
                alert("保存失败,请检查数据是否都填了!"+e);
            }
        });
}

$(function () {
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
            'UploadComplete': function () {
                //$('#success').show();
            },
            'FileUploaded': function (up, file, info) {
                var domain = up.getOption('domain');
                var res = jQuery.parseJSON(info);
                var sourceLink = domain + res.key; //获取上传成功后的文件的Url
                console.log('sourceLink:', sourceLink);
                $("#preview").attr("src", sourceLink);
            },
            'Error': function (up, err, errTip) {
            }
            ,
            'Key': function (up, file) {
                var key = FileNameHandler(file.name, 'top10');
                return key
            }
        }
    });
});

$(document).ready(function() {
    //alert("load finish");

});

