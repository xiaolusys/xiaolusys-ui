$(document).ready(function() {
	var $top = $('.act-0405-4-top')[0];
	var screenWidth = document.body.clientWidth;
	$top.style.height = screenWidth * 1.28 + 'px';

	var requestData = function() {
		$.ajax({
			type: 'GET',
			url: '/sale/promotion/stats/3/',
			success: function(resp) {
				var num_cards =0;
				var cards =resp.cards;
				for(var i =0;i<cards.length;i++){
					if(cars[i]==1){
						num_cards = num_cards+1;
					}
				} 
				var h = [];
				h.push('<div class="act-0405-4-text">');
				h.push('<p>您邀请了' + resp.invite_num + '位好友，获得了'+resp.total+'元红包。');
				if (num_cards == 9) {
					h.push('您完成了拼图,');
				} else {
					h.push('您没有完成拼图,');
				}
				h.push('您的现金红包还可以在商场消费或提现。</p>')

				h.push('</div>');

				//add cards
				h.push('<div class="act-cards-container">');
				for (var i = 0; i < 9; i++) {
					h.push('<div class="col-xs-4 no-padding act-card">');
					var j = i + 1;
					if (resp.cards[i] == 1) {
						h.push('<img src="../img/card_' + j + '.png" class="card_' + j + '">');
					} else {
						h.push('<img src="../img/card_hide_' + j + '.png" class="card_' + j + ' card-hide">');
					}
					h.push('</div>');
				}
				h.push('</div>');

				$('.act-0405-4-end').after(h.join(''));


				h = [];
				var totalMoney = resp.total + '';
				var len = totalMoney.length;
				h.push('<div class="act-0405-4-packet"><div class="totalMoney">');
				for (var i = 0; i < len; i++) {
					if (!isNaN(totalMoney.substr(i, 1))) {
						h.push('<img src="../img/' + totalMoney.substr(i, 1) + '.svg">');
					} else {
						h.push('<img src="../img/point.svg">');
					}
				}
				h.push('</div></div>');
				$('.act-0405-4-top').after(h.join(''));
			}
		});
	};
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
	var OSTest = function() { // 客户端平台检测　返回
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if (isAndroid == true) {
			return 'Android';
		} else if (isiOS == true) {
			return 'iOS';
		} else {
			return 'web'
		}
	};
	$(document).on('click', '.act-0405-4-share', function() {
		var os = OSTest();
		console.log('os share:', os)
		if (os == 'iOS') {
			setupWebViewJavascriptBridge(function(bridge) {
				var data = {
					'share_to': '',
					'active_id': '3'
				};
				bridge.callHandler('callNativeShareFunc', data, function(response) {
					console.log("callNativeShareFunc called with:", data);
				});
			})
		} else {
			if (window.AndroidBridge) {
				var data = {
					'share_to': '',
					'active_id': '3'
				};
				window.AndroidBridge.callNativeShareFunc(data.share_to, data.active_id);
			}
		}
	});
	requestData();
});