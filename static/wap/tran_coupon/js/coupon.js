//var BASE_URL = 'http://127.0.0.1:8000';
var BASE_URL = 'http://staging.xiaolumeimei.com';
//var BASE_URL = 'http://m.xiaolumeimei.com';


var CASHOUT_URL = '/mama_shop/html/cashout.html';
var trial_mama_next_page = null;

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
    };
    var data = {"coupon_num":coupon_num};

    $.ajax({url:url, data:data, success:callback, type:'POST'});
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
        }
    };

    $.ajax({url:url, success:callback});
}

$(document).ready(function() {
    loadProfile();
    listInCoupons();
});

