//var BASE_URL = 'http://127.0.0.1:8000';
var BASE_URL = 'http://staging.xiaolumeimei.com';
//var BASE_URL = 'http://m.xiaolumeimei.com';


var CASHOUT_URL = '/mama_shop/html/cashout.html';
var trial_mama_next_page = null;

var globalShowTag = 'list-in-coupons';
var globalTransferStatus = '';

function changeFilterText(value) {
    var text = "筛选";
    if (value == "1") {
        text = "待审核";
    } else if (value == "2") {
        text = "待发送";
    } else if (value == "3") {
        text = "已完成";
    } else if (value == "4") {
        text = "已取消";
    }
    $("#id-dropdown-button")[0].innerHTML= text+' <span class="caret"></span>';
}

function listOutCoupons(transferStatus) {
    var url = '/rest/v2/mama/trancoupon/list_out_coupons';
    var url = BASE_URL + url;
    var callback = function (res) {
        if (res) {
            $("#id-list-out-coupons").empty();
        }
        for (var i=0; i<res.length; ++i) {
            var data = res[i];
            var content = [];
            content.push('<div class="record-row">');
            content.push('<div class="record-left">');
            content.push('<img class="img-circle" style="height:100%" src="'+data["to_mama_thumbnail"]+'" />');
            content.push('</div>');
            content.push('<div class="record-middle-left">');
            content.push('<div><span class="coupon-number">'+data["coupon_num"]+'</span>&nbsp;张（出）</div>');
            content.push('</div>');
            content.push('<div class="record-middle-right">');
            content.push('<div>'+data["month_day"]+'</div>');
            content.push('<div>'+data["hour_minute"]+'</div>');
            content.push('</div>');
            content.push('<div class="record-right"><p>'+data['transfer_status_display']+'</p></div>');            
            content.push('</div>');
            $("#id-list-out-coupons").append(content.join(''));
        }
    };
    $.ajax({url:url, data:{"transfer_status":transferStatus}, success:callback});
}

function listInCoupons(transferStatus) {
    var url = '/rest/v2/mama/trancoupon/list_in_coupons';
    var url = BASE_URL + url;
    var callback = function (res) {
        if (res) {
            $("#id-list-in-coupons").empty();
        }
        for (var i=0; i<res.length; ++i) {
            var data = res[i];
            var content = [];
            content.push('<div class="record-row">');
            content.push('<div class="record-left">');
            content.push('<img class="img-circle" style="height:100%" src="'+data["from_mama_thumbnail"]+'" />');
            content.push('</div>');
            content.push('<div class="record-middle-left">');
            content.push('<div><span class="coupon-number">'+data["coupon_num"]+'</span>&nbsp;张（入）</div>');
            content.push('</div>');
            content.push('<div class="record-middle-right">');
            content.push('<div>'+data["month_day"]+'</div>');
            content.push('<div>'+data["hour_minute"]+'</div>');
            content.push('</div>');
            content.push('<div class="record-right"><p>'+data['transfer_status_display']+'</p></div>');            
            content.push('</div>');
            $("#id-list-in-coupons").append(content.join(''));
        }
    };
    $.ajax({url:url, data:{"transfer_status":transferStatus}, success:callback});
}

function loadProfile() {
    var url = '/rest/v2/mama/trancoupon/profile';
    var url = BASE_URL + url;
    var callback = function (res) {
        if (res) {
            if (res["direct_buy"] == false) {
                $("#id-place-order").show();
            } 
            $("#id-mama-id")[0].innerHTML = res["mama_id"];
            $("#id-stock-num")[0].innerHTML = res["stock_num"];
            $("#id-bought-num")[0].innerHTML = res["bought_num"];
            if (globalShowTag == 'list-in-coupons') {
                $("#id-waiting")[0].innerHTML = '目前有<span class="hl-number">'+res["waiting_in_num"]+'</span>张券等待被发放！';
            }
            if (globalShowTag == 'list-out-coupons') {
                $("#id-waiting")[0].innerHTML = '目前有<span class="hl-number">'+res["waiting_out_num"]+'</span>张券等待你审核或发放！';
            }
        }
    };

    $.ajax({url:url, success:callback});
}

function requestTransfer() {
    var url = '/rest/v2/mama/trancoupon/start_transfer';
    var url = BASE_URL + url;

    var coupon_num = $("#id-number").val();
    if (coupon_num <= 0) {
        alert("请填写订购数量，不能为0！");
        return;
    }
    var callback = function (res) {
        alert(res["info"]);
        listInCoupons();
    };
    var data = {"coupon_num":coupon_num};

    $.ajax({url:url, data:data, success:callback, type:'POST'});
}

$("#id-dropdown-menu").click(function (e){
    var elem = e.target;
    var status = elem.getAttribute("status");
    if (globalTransferStatus != status) {
        globalTransferStatus = status;
        changeFilterText(status);
        if (globalShowTag == 'list-out-coupons') {
            listOutCoupons(globalTransferStatus);
        } else if (globalShowTag == 'list-in-coupons') {
            listInCoupons(globalTransferStatus);
        }            
    }
});


$('#id-tab a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    var hideTag = $(this).attr("hide-tag");
    var showTag = $(this).attr("show-tag");

    if (showTag && showTag != globalShowTag) {
        globalShowTag = showTag;
        globalTransferStatus = '';
        changeFilterText();

        if (showTag == 'list-out-coupons') {
            listOutCoupons(globalTransferStatus);
        } else if (showTag == 'list-in-coupons') {
            listInCoupons(globalTransferStatus);
        }
        
        if (hideTag) {
            $("#id-"+hideTag).hide();
        }
        if (showTag) {
            $("#id-"+showTag).show();
        }
    }
});

$(document).ready(function() {
    loadProfile();
    listInCoupons();
});

