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
        text = "待发放";
    } else if (value == "3") {
        text = "已完成";
    } else if (value == "4") {
        text = "已取消";
    }
    $("#id-dropdown-button")[0].innerHTML= text+' <span class="caret"></span>';
}


function loadProfile() {
    var url = '/rest/v2/mama/trancoupon/profile';
    var url = BASE_URL + url;
    var callback = function (res) {
        if (res) {
            if (res["direct_buy"] == false) {
                $("#id-place-order").show();
            } else {
                $("#id-place-order")[0].innerHTML = '<a href="/mall/buycoupon" class="btn btn-danger">立即购券</a>';
                $("#id-place-order").show();
            }
            $("#id-mama-id")[0].innerHTML = res["mama_id"];
            $("#id-stock-num")[0].innerHTML = res["stock_num"];
            $("#id-bought-num")[0].innerHTML = res["bought_num"];
            if (res["direct_buy"] == true) {
                $("#id-waiting")[0].innerHTML = '目前有<span class="hl-number">'+res["waiting_out_num"]+'</span>张券等待你发放！';
            } else {
                $("#id-waiting")[0].innerHTML = '目前有<span class="hl-number">'+res["waiting_in_num"]+'</span>张券等待被发放,有<span class="hl-number">'+res["waiting_out_num"]+'</span>张券等待你审核！';
            }
        }
    };

    $.ajax({url:url, success:callback});
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
            content.push('<img class="img-rounded" style="width:100%" src="'+data["product_img"]+'" />');
            content.push('</div>');
            content.push('<div class="record-middle-left">');
            content.push('<div><span class="hl-number">'+data["coupon_num"]+'</span>&nbsp;张/出</div><div>'+data["month_day"]+'&nbsp;'+data["hour_minute"]+'</div>');
            content.push('</div>');
            content.push('<div class="record-middle-right">');
            content.push('<img class="img-circle" style="width:90%" src="'+data["to_mama_thumbnail"]+'" />');
            content.push('</div>');
            if (data['is_buyable'] == true){
                content.push('<div class="record-right" id="id-status-'+data["id"]+'"><button type=button class="btn btn-warning" onClick="transferCoupon('+data["id"]+')">发放</button></div>');                            
            } else if (data['is_processable'] == true) {
                content.push('<div class="record-right" id="id-status-'+data["id"]+'"><button type=button class="btn btn-warning" onClick="processCoupon('+data["id"]+')">审核</button></div>');                            
            } else {
                content.push('<div class="record-right"><p>'+data['transfer_status_display']+'</p></div>');                            
            }
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
            content.push('<img class="img-rounded" style="width:100%" src="'+data["product_img"]+'" />');
            content.push('</div>');
            content.push('<div class="record-middle-left">');
            content.push('<div><span class="hl-number">'+data["coupon_num"]+'</span>&nbsp;张/入</div><div>'+data["month_day"]+'&nbsp;'+data["hour_minute"]+'</div>');
            content.push('</div>');
            content.push('<div class="record-middle-right">');
            content.push('<img class="img-circle" style="width:90%" src="'+data["to_mama_thumbnail"]+'" />');
            content.push('</div>');
            if (data['is_cancelable'] == true) {
                content.push('<div class="record-right hl" id="id-status-'+data["id"]+'"><button type=button class="btn btn-default" onClick="cancelCoupon('+data["id"]+')">取消</button></div>');                            
            } else {
                content.push('<div class="record-right hl"><p>'+data['transfer_status_display']+'</p></div>');                            
            }            
            content.push('</div>');
            $("#id-list-in-coupons").append(content.join(''));
        }
    };
    $.ajax({url:url, data:{"transfer_status":transferStatus}, success:callback});
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
        loadProfile();
    };
    var data = {"coupon_num":coupon_num};

    $.ajax({url:url, data:data, success:callback, type:'POST'});
}

function processCoupon(pk) {
    var url = '/rest/v2/mama/trancoupon/'+pk+'/process_coupon';
    var url = BASE_URL + url;
    var callback = function (res) {
        alert(res["info"]);
        if (res["code"] == 0) {
            $("#id-status-"+pk)[0].innerHTML = '待发放';
        }
        loadProfile();
    };
    if (confirm("提示：请务必先收款，后审核！")) {
       $.ajax({url:url, success:callback, type:'POST'});
    }
}

function cancelCoupon(pk) {
    var url = '/rest/v2/mama/trancoupon/'+pk+'/cancel_coupon';
    var url = BASE_URL + url;
    var callback = function (res) {
        alert(res["info"]);
        if (res["code"] == 0) {
            $("#id-status-"+pk)[0].innerHTML = "已取消";
        }
        loadProfile();
    };
    $.ajax({url:url, success:callback, type:'POST'});
}

function transferCoupon(pk) {
    var url = '/rest/v2/mama/trancoupon/'+pk+'/transfer_coupon';
    var url = BASE_URL + url;
    var callback = function (res) {
        alert(res["info"]);
        if (res["code"] == 0) {
            $("#id-status-"+pk)[0].innerHTML = "已完成";
        }
        loadProfile();
    };
    if (confirm("提示：请务必先收款，后发券！")) {
        $.ajax({url:url, success:callback, type:'POST'});
    }
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
        loadProfile();
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

