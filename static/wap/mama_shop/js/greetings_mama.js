//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumm.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

function getAdminQrcode() {
    var url = '/rest/v2/mama/administrator';
    var url = BASE_URL + url;
    var callback = function (res) {
        if (res) {
            var qrcode = res["qr_img"];
            $("#id-manager-qrcode").attr("src", qrcode);
        }
    };

    $.ajax({url:url, success:callback});
}
$(document).ready(function() {
    getAdminQrcode();
});

