$(document).ready(function() {
	var $top = $('.act-0405-4-top')[0];
	var screenWidth = document.body.clientWidth;
	$top.style.height = screenWidth * 1.28 + 'px';

	var requestData = function() {
		$.ajax({
			type: 'GET',
			url: '/sale/promotion/stats/3/',
			success: function(resp) {
				var h = [];
				h.push('<div class="act-0405-4-text">');
				h.push('<p>通过您的邀请，为小鹿美美带来了' + resp.invite_num + '位好友</p>');
				h.push('<p>您完成了拼图，获得了浴巾</p>');
				h.push('</div>');
				$('.act-0405-4-end').after(h.join(''));

				h = [];
				var totalMoney = resp.total+'';
				var len = totalMoney.length;
				h.push('<div class="act-0405-4-packet">');
				for (var i = 0; i < len; i++) {
					if(isNaN(!totalMoney.substr(i, 1))){
						h.push('<img src="../img/' + totalMoney.substr(i, 1) + '.svg">');	
					}else {
						h.push('<img src="../img/point.svg">');
					}
				}
				h.push('<p>' + resp.total + '</p>');
				h.push('</div>');
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