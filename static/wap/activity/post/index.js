$(document).ready(function() {

  $(function() {
    FastClick.attach(document.body);
  });

  var activityId = 5;

  var setupWebViewJavascriptBridge = function(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  };

  var topTen = [{
    id: 81908903008,
    name: '韩系印花连衣裙',
    productId: 39238,
    modelId: 10965,
  }, {
    id: 81928970006,
    name: '显瘦开衩连衣裙',
    productId: 38157,
    modelId: 0,
  }, {
    id: 82028792010,
    name: '白搭字母T',
    productId: 38736,
    modelId: 10770,
  }, {
    id: 82118368002,
    name: '破洞牛仔裤',
    productId: 34499,
    modelId: 8985,
  }, {
    id: 82028979003,
    name: '简约衬衫',
    productId: 36917,
    modelId: 10007,
  }, {
    id: 91428993005,
    name: '旗袍复古公主裙',
    productId: 39424,
    modelId: 11045,
  }, {
    id: 91428993004,
    name: '小清新印花连衣裙',
    productId: 38838,
    modelId: 10804,
  }, {
    id: 81928914001,
    name: '中式棉麻风',
    productId: 35277,
    modelId: 9290,
  }, {
    id: 82128807001,
    name: '瘦腿弹力丝袜',
    productId: 33051,
    modelId: 8413,
  }, {
    id: 82228970006,
    name: '减龄卡通套装',
    productId: 38941,
    modelId: 10848,
  }, ];

  var render = function() {
    var h = [];
    $.each(topTen, function(index, item) {
      h.push('<li>');
      h.push('<img class="js-buy col-xs-12 col-md-6 col-md-offset-3" data-modelid=' + item.modelId + ' data-productid=' + item.productId + ' src="./images/' + item.productId + '.png">');
      h.push('</li>');
    });
    $('#container ul').append(h.join(''));
  };

  var bindEvents = function() {
    $(document).on('click', '.js-buy', function(e) {
      var $target = $(e.currentTarget);
      var productId = $target.data('productid');
      var modelId = Number($target.data('modelid'));
      var url = '';
      var webUrl = '';
      if (modelId) {
        webUrl = '/tongkuan.html?id=' + modelId;
        url = 'com.jimei.xlmm://app/v1/products/modelist?model_id=' + modelId;
      } else {
        webUrl = '/pages/shangpinxq.html?id=' + productId;
        url = 'com.jimei.xlmm://app/v1/products?product_id=' + productId;
      }
      if (isAndroid() && typeof window.AndroidBridge !== 'undefined') {
        window.AndroidBridge.jumpToNativeLocation(url);
      } else if (isIOS() && !isWechat()) {
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('jumpToNativeLocation', {
            target_url: url
          }, function(response) {});
        })
      } else {
        window.location.href = webUrl;
      }
    });

    $(document).on('click', '.js-get-coupon', function(e) {
      $.ajax({
          url: '/rest/v1/usercoupons',
          type: 'post',
          data: {
            template_id: 41
          }
        })
        .done(function(resp) {
          if (resp.code === 0) {
            popUp();
          } else {
            window.Toast.show(resp.res);
          }
        })
        .fail(function(resp) {
          if (resp.status = 403) {
            window.Toast.show('领取失败,请登录后再领取!');
          } else {
            window.Toast.show('领取失败,请重试!');
          }
        });
    });
  };

  var test = function(ua) {
    return window.navigator.userAgent.indexOf(ua) >= 0;
  };

  var isIOS = function() {
    return test('iPhone') || test('iPad') || test('iPod');
  };

  var isAndroid = function() {
    return test('Android');
  };
  var isWechat = function() {
    return test('MicroMessenger');
  }

  var share = function() {
    if (isIOS() && !isWechat()) {
      setupWebViewJavascriptBridge(function(bridge) {
        var data = {
          'share_to': '',
          'active_id': activityId
        };
        bridge.callHandler('callNativeShareFunc', data, function(response) {
          console.log("callNativeShareFunc called with:", data);
        });
      })
    } else if (isAndroid() && window.AndroidBridge) {
      var data = {
        'share_to': '',
        'active_id': activityId
      };
      window.AndroidBridge.callNativeShareFunc(data.share_to, data.active_id);
    }
  };

  var popUp = function() {
    var h = [];
    h.push('<div class="popup">');
    h.push('<div class="content">');
    h.push('<img class="js-redpacket  col-xs-12 col-md-6 col-md-offset-3" src="./images/redpacket.png">')
    h.push('<img class="js-share col-md-4 col-md-offset-4 col-xs-8 col-xs-offset-2 mragin-top-xs" src="./images/share-btn.png">')
    h.push('</div>');
    h.push('<div class="popup-overlay">');
    h.push('</div>');
    $('body').append(h.join(''));
    $(document).off('click', '.popup-overlay').on('click', '.popup-overlay', function(e) {
      $('.popup').remove();
      return false;
    });
    $(document).off('click', '.js-redpacket').on('click', '.js-redpacket', function(e) {
      $('.popup').remove();
      return false;
    });

    $(document).off('click', '.js-share').on('click', '.js-share', function(e) {
      share();
      return false;
    });
  };

  var getTimeRemaining = function(endtime) {
    var totals = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((totals / 1000) % 60);
    var minutes = Math.floor((totals / 1000 / 60) % 60);
    var hours = Math.floor((totals / (1000 * 60 * 60)) % 24);
    var days = Math.floor(totals / (1000 * 60 * 60 * 24));
    return {
      totals: totals,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }


  var countDown = function(ts) {
    var eventTime = new Date(ts);
    var timeinterval = setInterval(function() {
      var tr = getTimeRemaining(eventTime);
      $('.js-days').text(tr.days);
      $('.js-hours').text(tr.hours);
      $('.js-minutes').text(tr.minutes);
      $('.js-seconds').text(tr.seconds);
      if (tr.total <= 0) {
        clearInterval(timeinterval);
      }
    }, 1000);
  };

  var fetchEvent = function() {
    $.ajax({
      url: '/sale/promotion/apply/' + activityId + '/',
      type: 'get',
    }).done(function(resp) {
      if (resp.end_time) {
        countDown(resp.end_time);
      }
    });
  };

  render();
  bindEvents();
  fetchEvent();

});
