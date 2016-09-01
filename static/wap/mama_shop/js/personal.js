//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

var trial_mama_next_page = null;

function renderTrialMamaList(res) {
    if (res) {
        var invite_num = res['count'];
        trial_mama_next_page = res['next'];
        var arr = res['results'];
        for (var i=0; i<arr.length; ++i) {
            content.push('<div class="attender-row">');
            content.push('<div class="attender-left">');
            content.push('<img src="'+arr[i].thumbnail+'" class="img-circle" style="height:100%;">');
            content.push('</div><div class="attender-middle">');
            content.push('<p class="attender-name">'+arr[i].nick+'</p>');
            content.push('<p>'+get_time(arr[i].charge_time)+'</p>');
            content.push('</div><div class="attender-right">');
            if (i == 0) {
                content.push('<p class="signup-status">奖励20元</p>');
            } else {
                content.push('<p class="signup-status">奖励12元</p>');
            }
            content.push('<p>'+get_date(arr[i].charge_time)+'</p>');
            content.push('</div></div>');
            $("#id-invite-list").append(content.join(''));
        }
    }
}

function loadTrialMamaNextPage() {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    var windowHeight = $(window).height();
    var documentHeight = $(document).height();

    if (scrollTop >= documentHeight - windowHeight - 20) {
        if (nextPage) {
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

function get_time(charge_time) {
    var idx = charge_time.search('T');
    return charge_time.substr(idx+1);
}

function get_date(charge_time) {
    var idx = charge_time.search('T');
    return charge_time.substr(0,idx);
}

function loadTrialMama(){
    var fortune_url = '/rest/v2/pmt/xlmm/get_referal_mama?last_renew_type=trial';
    var url = BASE_URL + fortune_url;
    $.ajax({url:url, success:renderTrialMamaList});
}


function getParamValue(key) { 
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    
    if (url.indexOf("?") != -1) { 
        var str = url.substr(1); 
        strs = str.split("&"); 
        for(var i = 0; i < strs.length; i ++) {
            pair = strs[i].split("=")
            if (pair[0] == key) {
                return pair[1];
            }
        } 
    } 
    return null;
}

$(document).ready(function() {
    loadMamaFortune();
    loadTrialMama();

    $(window).on("scroll", function () {
        loadTrialMamaNextPage();
    });

});

