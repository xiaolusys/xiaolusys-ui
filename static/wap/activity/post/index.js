$(document).ready(function() {

  $(function() {
    FastClick.attach(document.body);
  });

  var activityId = 5;

  var topTen = [{
    id: 81908903008,
    name: '韩系印花连衣裙',
    productId: 39238,
  }, {
    id: 81928970006,
    name: '显瘦开衩连衣裙',
    productId: 38157,
  }, {
    id: 82028792010,
    name: '白搭字母T',
    productId: 38736,
  }, {
    id: 82118368002,
    name: '破洞牛仔裤',
    productId: 34499,
  }, {
    id: 82028979003,
    name: '简约衬衫',
    productId: 36917,
  }, {
    id: 91428993005,
    name: '旗袍复古公主裙',
    productId: 39424,
  }, {
    id: 91428993004,
    name: '小清新印花连衣裙',
    productId: 38838,
  }, {
    id: 81928914001,
    name: '中式棉麻风',
    productId: 35277,
  }, {
    id: 82128807001,
    name: '瘦腿弹力丝袜',
    productId: 33051,
  }, {
    id: 82228970006,
    name: '减龄卡通套装',
    productId: 38941,
  }, ];

  var render = function() {
    var h = [];
    $.each(topTen, function(index, item) {
      h.push('<li>');
      h.push('<img class="js-buy col-xs-12" data-productid=' + item.productId + ' src="./images/' + item.productId + '.png">');
      h.push('</li>');
    });
    $('#container ul').append(h.join(''));
  };

  var bindEvents = function() {
    $(document).on('click', '.js-buy', function(e) {
      var $target = $(e.currentTarget);
      if (isAndroid() && typeof window.AndroidBridge !== 'undefined') {
        window.AndroidBridge.jumpToNativeLocation('{"target_url":"com.jimei.xlmm://app/v1/products?product_id=' + $target.data('productid') + '"}');
      } else if (isIOS()) {
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('jumpToNativeLocation', {
            target_url: 'com.jimei.xlmm://app/v1/products?product_id=' + $target.data('productid')
          }, function(response) {});
        })
      } else {
        window.location.href = '/static/wap/pages/shangpinxq.html?id=' + $target.data('productid');
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

  var share = function() {
    if (isIOS()) {
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
    h.push('<img class="js-redpacket col-xs-12" src="./images/redpacket.png">')
    h.push('<img class="js-share col-xs-8 col-xs-offset-2 mragin-top-xs" src="./images/share-btn.png">')
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
