//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumm.com';
var BASE_URL = 'https://m.xiaolumeimei.com';

function loadProfile() {
    var url = '/rest/v2/mama/trancoupon/profile';
    var url = BASE_URL + url;
    var callback = function (res) {
        if (res) {
            if (res["is_elite_mama"] == true) {
                $("#id-trancoupon-entry").show();
            } 
        }
    };

    $.ajax({url:url, success:callback});
}
$(document).ready(function() {
    loadProfile();
});

