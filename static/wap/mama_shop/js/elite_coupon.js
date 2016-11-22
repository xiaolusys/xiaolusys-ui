//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumm.com';
var BASE_URL = 'https://m.xiaolumeimei.com';


function enable_elite_coupon() {
    var url = '/rest/v2/mama/enable_elite_coupon';
    var url = BASE_URL + url;
    var callback = function (res) {
        alert(res["info"]);
    };
    var template_id = $("#id-template-id").val();
    var coupon_product_model_id = $("#id-coupon-product-model-id").val();
    var product_model_id = $("#id-product-model-id").val();
    var code = $("#id-code").val();

    var data = {"template_id":template_id, "coupon_product_model_id":coupon_product_model_id, "product_model_id":product_model_id, "code":code};
    $.ajax({url:url, data:data, success:callback, type:"post"});
}

