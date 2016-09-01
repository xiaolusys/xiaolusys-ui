//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

var trial_mama_next_page = null;

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
        }
        var invite_award = invite_num * 12 + 8;
        $("#id-invite-num")[0].innerHTML = invite_award+'元/'+invite_num+'人';
        
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
            content.push('</div><div class="attender-right">');
            if (i == 0) {
                content.push('<p class="signup-status">奖励20元</p>');
            } else {
                content.push('<p class="signup-status">奖励12元</p>');
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

function loadMamaFortune() {
    var fortune_url = '/rest/v2/mama/fortune';
    var url = BASE_URL + fortune_url;

    var callback = function (res) {
        if (res) {
            var fortune = res['mama_fortune'];
            var extra = fortune['extra_info'];
            
            var content = [];
            content.push('<div><img class="img-circle head-thumbnail" src="'+extra.thumbnail+'"</></div>');
            content.push('<div style="margin-top:8px"><span>ID: ' + fortune.mama_id+'</span></div>');
            content.push('<div><span>店主期限:  ' + extra.surplus_days + '天</span></div>');
            $("#id-profile").append(content.join(''));

            content = [];
            content.push('<div class="xlmm-carry"><b>累计收益: '+ fortune.carry_value + '元</b></div>');
            $("#id-fortune").append(content.join(''));

            if (extra.surplus_days > 15) {
                $("#id-award").hide();
            }
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
    var click_carry_ulr = '/rest/v2/mama/clickcarry?page_size=1&page=1';
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
    loadMamaFortune();
    loadTrialMama();
    checkClickCarry();

    $(window).on("scroll", function () {
        loadTrialMamaNextPage();
    });
});

