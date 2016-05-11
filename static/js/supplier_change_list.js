$(".category_select").live("change",function(e){
	e.preventDefault();
	console.log('abc');
	var target = e.target;
	var sid = target.getAttribute('sid');
	var cat_id = $(target).val();

	var url = "/supplychain/supplier/brand/"+sid+"/";
    var callback = function (res) {
      if (res.category.toString() == cat_id) {
          $(target).after("<img src='/static/admin/img/icon-yes.gif '>");
      }
    };

	var csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    var data = {"csrfmiddlewaretoken":csrf_token,
    					"format":"json",
    					"category":cat_id};

    var headers = {
	    'X-HTTP-Method-Override': 'PATCH'
	   };

    $.ajax({"url":url,"data":data,"success":callback,"type":"POST","headers":headers });
});

$('.btn-charge').live('click',function(e){
	e.preventDefault();
	var target = e.target;
	var sid = target.getAttribute('sid');

	var url = "/supplychain/supplier/brand/charge/"+sid+"/";
        var callback = function (res) {
          if (res["success"] == true) {
              $(target).attr("href",res["brand_links"]).attr("target","_blank").text('查看商品').removeClass(' btn-charge btn-primary').addClass('btn-success');
          }else{
          	$(target).removeClass().addClass("btn btn-warning").text('接管失败');
          	$(target.parentElement.parentElement).slideUp(2000);
          }
        };

	var csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    var data = {"csrfmiddlewaretoken":csrf_token,
    					"format":"json"};

    $.ajax({"url":url,"data":data,"success":callback,"type":"POST" });
});

$('.status_select').live("change",function(e){
	e.preventDefault();
	var target = e.target;
	var pid = target.getAttribute('pid');
	var status = target.value;

	var url = "/supplychain/supplier/product/"+pid+"/";
    var callback = function (res) {
      if (res["status"] != "ignored") {
      	if (res["status"]=='淘汰' || res["status"]=='忽略'){
      		$(target.parentElement.parentElement).slideUp();
      	}else{
        	$(target).after("<img src='/static/admin/img/icon-yes.gif '>");
        }
      }
    };

	var csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    var data = {"status": status,
				"csrfmiddlewaretoken":csrf_token,
				"format":"json"};

    var headers = {
	    'X-HTTP-Method-Override': 'PATCH'
	   };

    $.ajax({"url":url,"data":data,"success":callback,"type":"POST","headers":headers });
});


$(".sale_category_select").live("change",function(e){
    e.preventDefault();

    var target = e.target;
    var spid = target.getAttribute('spid');
    var cat_id = $(target).val();

    var url = "/supplychain/supplier/product/"+ spid +"/?format=json";
    var callback = function (res) {

     if (res.sale_category.toString() == cat_id) {
          $(target).after("<img src='/static/admin/img/icon-yes.gif '>");
        }
    };

    var csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    var data = {"csrfmiddlewaretoken":csrf_token,
                        "format":"json",
                        "sale_category":cat_id};

	var headers = {
	    'X-HTTP-Method-Override': 'PATCH'
	   };

    $.ajax({"url":url,"data":data,"success":callback,"type":"POST", "headers":headers});
});


var parseQueryString = function (url) {
   var reg = /([^\?\=\&]+)\=([^\?\=\&]*)/g;
   var obj = {};
   while (reg.exec (url)) {
       obj[RegExp.$1] = RegExp.$2;
   }
   return obj;
}

$(function () {
	var time_selectors = $(".select_saletime");
	if (time_selectors.length==null || time_selectors.length == 0)return;

        $('p.schedule_date').each(function(index, el){
            var $that = $(this);
            var saleproduct_id = parseInt($(this).attr('id'));
            $.ajax({
                url: '/supplychain/supplier/saleproduct_schedule_date/',
                type: 'get',
                dataType: 'json',
                data: {saleproduct_id: saleproduct_id},
                success: function(result){
                    if(result.select_dates && result.select_dates.length > 0){
                        $that.html('上架日期:<br>' + result.select_dates.join('<br>'));
                    }
                }
            });
        });

        $('p.sale_date').each(function(){
            var $that = $(this);
            var saleproduct_id = parseInt($(this).attr('id'));
            $.ajax({
                url: '/supplychain/supplier/saleproduct_sale_date/',
                type: 'get',
                dataType: 'json',
                data: {saleproduct_id: saleproduct_id},
                success: function(result){
                    if(JSON.stringify(result.sale_dates) != '{}'){
                        var n = 0;
                        var tmp = [];
                        for(var x in result.sale_dates){
                            tmp.push(x + ': ' + result.sale_dates[x]);
                            n += result.sale_dates[x];
                        }
                        tmp.push('总计: ' + n);
                        $that.html('销售统计:<br>' + tmp.join('<br>'));
                    }
                }
            });
        });

        $('#input-saleproduct-date').datepicker({
            dateFormat: 'yy-mm-dd'
        }).change(function(e){
            var urlParams = parseQueryString(window.location.href);

            urlParams['sale_time__gte'] = $(this).val();
            urlParams['sale_time__lte'] = $(this).val();
            window.location = '/admin/supplier/saleproduct/?' + $.param(urlParams);
        });
        $('#select-saleproduct-date').click(function(){
            $('#input-saleproduct-date').focus();
        });

	time_selectors.datepicker({
	    dateFormat: "yy-mm-dd 00:00:00"
	}).change(function (e) {
	    var pid = this.id;
	    var sale_time = this.value;
		var url = "/supplychain/supplier/product/"+pid+"/";
	        var callback = function (res) {
	        	console.log('debug sale time:',res,sale_time);
	           if (res['sale_time'] == '' || res['sale_time'] == null){
	           		alert('上架排期失败');
	           		return
	           }
	           $(e.target).after("<img src='/static/admin/img/icon-yes.gif '>");
	        };

		var csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
	    var data = {"sale_time": sale_time,
					"csrfmiddlewaretoken":csrf_token,
					"format":"json"};

	    var headers = {
		    'X-HTTP-Method-Override': 'PATCH'
		   };

	    $.ajax({"url":url,"data":data,"success":callback,"type":"POST","headers":headers });
	});
});

// 修改供应商区域字段 supplier_zone字段修改
$(".supplier_zone").live("change", function (e) {
    e.preventDefault();
    var target = e.target;
    var supplier_id = target.getAttribute('cid');
    var zone_id = $(target).val();
    var url = "/supplychain/supplier/change_list_fields/";
    var callback = function (res) {
        if (res.code == 0) {
            $(target).after("<img src='/static/admin/img/icon-yes.gif'>");
        }
        else {
            alert("系统出错");
        }
    };
    var csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    var data = {
        "csrfmiddlewaretoken": csrf_token,
        "format": "json",
        "zone_id": zone_id,
        "supplier_id": supplier_id
    };
    $.ajax({"url": url, "data": data, "success": callback, "type": "POST"});
});

// 修改供应商区域字段 supplier_zone字段修改
$(".supplier_type").live("change", function (e) {
    e.preventDefault();
    var target = e.target;
    var supplier_id = target.getAttribute('cid');
    var supplier_type = $(target).val();
    var url = "/supplychain/supplier/change_list_fields/";
    var callback = function (res) {
        if (res.code == 0) {
            $(target).after("<img src='/static/admin/img/icon-yes.gif'>");
        }
        else{
            alert("系统出错");
        }
    };
    var csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    var data = {
        "csrfmiddlewaretoken": csrf_token,
        "format": "json",
        "supplier_id": supplier_id,
        "supplier_type": supplier_type
    };
    $.ajax({"url": url, "data": data, "success": callback, "type": "POST"});
});
