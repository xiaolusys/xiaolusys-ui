//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

var trial_mama_next_page = null;
var max_wait_verifycode_time = 180;
var global_timer = null;

function format_time(charge_time) {
    var idx = charge_time.search('T');
    var content = [];
    content.push(charge_time.substr(5,5));
    content.push(charge_time.substr(idx+1,5));
    return content.join(' ');
}


function enableVerifyCodeButton() {
    $("#id-verifycode-button").removeAttr("disabled");
    $("#id-verifycode-button").val("获取验证码");
    window.clearInterval(global_timer);
}

function changeButtonDisplay() {
    var counterValue = $("#id-verifycode-button").attr("counter");
    var counter = parseInt(counterValue) + 1
    console.log(counter);
    $("#id-verifycode-button").attr("counter", counter);
    
    if (counter < max_wait_verifycode_time) {
        var seconds = max_wait_verifycode_time - counter;
        $("#id-verifycode-button").val("请等待("+seconds+"秒)");
    } else {
        enableVerifyCodeButton();
    }
}

function disableVerifyCodeButton() {
    $("#id-verifycode-button").attr("disabled", "true");
    global_timer = setInterval(changeButtonDisplay, 1000);
}


function requestCashoutVerifyCode() {
    var verify_code_url = '/rest/v2/request_cashout_verify_code';
    var url = BASE_URL + verify_code_url;
    var callback = function (res) {
        if (res['code'] == 0) {
            disableVerifyCodeButton();
            alert("您的验证码已发送成功，请耐心等待，不要短时间重复发送验证码，验证超过5次今日提现将锁定！");
        } else if (res['code'] == 1) {
            alert(res['info'] + '请先绑定手机！');
        } else {
            alert(res['info']);
        }
    };
    
    $.ajax({url:url, type:'post', success:callback});
}

function cashoutOnce() {
    var cashout_once_url = '/rest/v1/pmt/cashout/cashout_once';
    var url = BASE_URL + cashout_once_url;
    var callback = function (res) {
        if (res['code'] == 0) {
            $("#id-cashout")[0].innerHTML = "提交成功！去分享店铺赚钱吧～<br><a href='/rest/v2/mama/activate'>进入店铺 >></a>";
            $("#id-cashout").css("text-align", "center");
        } else {
            $("#id-msg")[0].innerHTML = res["info"];
            $("#id-msg").css("color", "red");
        }
    };
    var verify_code = $("#id-verifycode-input").val();
    var amount = $("#id-cashout-input").val();
    var data = {"amount":amount, "verify_code":verify_code}
    
    $.ajax({url:url, type:'post', data:data, success:callback});
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
            
            $("#id-cash-value")[0].innerHTML = res['cash_value'];
            $("#id-carry-value")[0].innerHTML = res['carry_value'];
        }
    };
    $.ajax({url:url, success:callback});
}

$(document).ready(function() {
    loadMamaFortuneBrief();

});

