//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

var CASHOUT_URL = '/mama_shop/html/cashout.html';
var trial_mama_next_page = null;

function canCashoutOnce() {
    var can_cashout_once_url = '/rest/v1/pmt/cashout/can_cashout_once';
    var url = BASE_URL + can_cashout_once_url;
    var callback = function (res) {
        if (res["code"] == 0) {
            console.log(res);
            window.location.href = CASHOUT_URL;
        } else {
            $("#id-msg")[0].innerHTML = res["info"];
            $("#id-msg-box").show();
        }
    };

    $.ajax({url:url, success:callback});
}

function format_time(charge_time) {
    var idx = charge_time.search('T');
    var content = [];
    content.push(charge_time.substr(5,5));
    content.push(charge_time.substr(idx+1,5));
    return content.join(' ');
}

function renderTrialMamaList(res) {
    if (res) {
        var invite_num = res['count'];
        if (invite_num > 0) {
            $("#id-task1-status")[0].innerHTML = "已完成";
            $("#id-task1-status").addClass("xlmm-orange");

            //var invite_award = (invite_num - 1) * 12 + 20;
            var invite_award = (invite_num - 1) * 12;
            $("#id-invite-num")[0].innerHTML = invite_award+'元/'+invite_num+'人';
        }

        trial_mama_next_page = res['next'];
        
        var arr = res['results'];
        for (var i=0; i<arr.length; ++i) {
            var content = [];
            content.push('<div class="attender-row">');
            content.push('<div class="attender-left">');
            content.push('<img src="'+arr[i].thumbnail+'" class="img-circle" style="height:100%;">');
            content.push('</div><div class="attender-middle">');
            content.push('<p class="attender-name">'+arr[i].nick+'</p>');
            content.push('<p>'+format_time(arr[i].charge_time)+'</p>');
            content.push('</div><div class="attender-right xlmm-orange">');
            if (i == arr.length-1) {
                content.push('<p class="signup-status">奖励30元</p>');
            } else {
                content.push('<p class="signup-status">奖励30元</p>');
            }
            content.push('</div></div>');
            $("#id-invite-list").append(content.join(''));
        }
    }
}

function loadTrialMamaNextPage() {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    var windowHeight = $(window).height();
    var documentHeight = $(document).height();

    if (scrollTop >= documentHeight - windowHeight) {
        console.log(scrollTop, documentHeight, windowHeight);
        if (trial_mama_next_page) {
            $.ajax({url:trial_mama_next_page, success:renderTrialMamaList});
        }
    }
}

function loadMamaProfile() {
    var profile_url = '/rest/v1/users/profile';
    var url = BASE_URL + profile_url;
    var callback = function (res) {
        if (res) {
            var budget = res['user_budget'];
            var budget_cash = budget.budget_cash;
            $("#id-budget")[0].innerHTML = "零钱:" + budget_cash + "元";
        }
    };
    $.ajax({url:url, success:callback});    
}

function loadMamaFortuneBrief() {
    var fortune_url = '/rest/v2/mama/fortune/get_brief_info';
    var url = BASE_URL + fortune_url;

    var callback = function (res) {
        if (res) {
            var content = [];
            content.push('<div><img class="img-circle head-thumbnail" src="'+res['thumbnail']+'"</></div>');
            content.push('<div style="margin-top:16px"><span>ID: ' + res['mama_id']+'</span></div>');
            if (res['left_days'] > 0) {
                content.push('<div><span>专业店铺（剩余' + res['left_days'] + '天）</span></div>');
            } else {
                content.push('<div><span>普通店铺</span></div>');
            }
            
            $("#id-profile").append(content.join(''));

            content = [];
            content.push('<div class="xlmm-carry"><b>累计收益: '+ res['carry_value'] + '元</b></div>');
            $("#id-fortune").append(content.join(''));
        }
    };
    $.ajax({url:url, success:callback});
}


function loadTrialMama(){
    var trial_mama_url = '/rest/v1/pmt/xlmm/get_referal_mama?last_renew_type=trial';
    var url = BASE_URL + trial_mama_url;
    $.ajax({url:url, success:renderTrialMamaList});
}

function checkClickCarry() {
    var click_carry_url = '/rest/v2/mama/clickcarry?page_size=1&page=1';
    var url = BASE_URL + click_carry_url;

    var callback = function (res) {
        if (res) {
            var arr = res['results'];
            $("#id-task2-status")[0].innerHTML = "已完成("+arr[0].click_num+"位访客)";
            $("#id-task2-status").addClass("xlmm-orange");
        }
    };

    $.ajax({url:url, success:callback});
}

$(document).ready(function() {
    loadMamaFortuneBrief();
    loadTrialMama();
    //checkClickCarry();

    $(window).on("scroll", function () {
        loadTrialMamaNextPage();
    });
});

