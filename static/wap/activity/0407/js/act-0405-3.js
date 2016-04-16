$(document).ready(function() {
	var $top = $('.act-0405-3-top')[0];
	var screenWidth = document.body.clientWidth;
	$top.style.height = screenWidth * 1.28 + 'px';
	//倒计时
	var timer = function(intDiff) {
		window.setInterval(function() {
			var day,
				hour,
				minute,
				second;
			if (intDiff <= 0) {
				window.location.href = '../html/act-0405-4.html';
			}
			//时间默认值		
			if (intDiff > 0) {
				day = Math.floor(intDiff / (60 * 60 * 24));
				hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
				minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
				second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
			}
			$('#day_show').html('<img  src="../img/' + (Math.floor(day / 10)) + '.svg" /> <img  src="../img/' + ((day / 10).toString().split('.')[1] || 0) + '.svg" />');
			$('#hour_show').html('<img  src="../img/' + (Math.floor(hour / 10)) + '.svg" /> <img  src="../img/' + ((hour / 10).toString().split('.')[1] || 0) + '.svg" />');
			$('#minute_show').html('<img  src="../img/' + (Math.floor(minute / 10)) + '.svg" /> <img  src="../img/' + ((minute / 10).toString().split('.')[1] || 0) + '.svg" />');
			$('#second_show').html('<img  src="../img/' + (Math.floor(second / 10)) + '.svg" /> <img  src="../img/' + ((second / 10).toString().split('.')[1] || 0) + '.svg" />');
			intDiff--;
		}, 1000);
	};

	//请求初始数据
	var requestData = function() {
		var end_time, current_time, rest_time;
		$.ajax({
			type: 'GET',
			url: '/sale/promotion/apply/3/',
			success: function(res) {
				//set rest time of activity
				end_time = res.end_time;
				current_time = (new Date()).getTime();
				rest_time = parseInt((end_time - current_time) / 1000);
				timer(rest_time);
			}
		});
		$.ajax({
			type: 'GET',
			url: '/sale/promotion/main/3/',
			success: function(resp) {
				var h = [];
				//1.查看拼图是否完成
				//2.查看优惠劵状态，现实对应图片
				//status == 0拼图完成
				if (resp.num_cards == 9) {
					h.push('<img src="../img/receive.png" class="receive-coupon" data-numCards="' + resp.num_cards + '">');
				} else {
					//add cards
					h.push('<div class="act-cards-container" data-numCards="' + resp.num_cards + '">');
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
				}
				$('.act-0405-time').after(h.join(''));

				//add envelopes
				var envNum = resp.envelopes.length + '';
				var envLen = envNum.length;
				h = [];
				h.push('<div class="act-0405-3-envelopes"><div class="env-num">');
				for (var i = 0; i < envLen; i++) {
					h.push('<img src="../img/' + envNum.substr(i, 1) + '.png">');
				}
				h.push('</div></div>');
				h.push('<div class="act-evelops-container collapse">');
				resp.envelopes.forEach(function(envelope) {
					h.push('<div class="col-xs-4 no-padding text-center act-evelops">');
					if (envelope.status === 'open' && envelope.type === 'card') {
						h.push('<img class="act-icon act-evelop" src="../img/act-0405-26.png" data-id = "' + envelope.id + '" data-status="' + envelope.status + '"/>');
						h.push('<p>拼图</p>');
					} else if (envelope.status === 'open' && envelope.type === 'cash') {
						h.push('<img class="act-icon act-evelop" src="../img/act-0405-25.png" data-id = "' + envelope.id + '" data-status="' + envelope.status + '"/>');
						h.push('<p>' + envelope.yuan_value + '</p>');
					} else {
						h.push('<img class="act-icon act-evelop" src="../img/act-0405-27.png" data-id = "' + envelope.id + '" data-status="' + envelope.status + '"/>');
						h.push('<p>未拆开</p>');
					}
					h.push('</div>');
				});

				//add envelopes of inactives
				resp.inactives.forEach(function(inactive) {
					h.push('<div class="col-xs-4 no-padding text-center act-evelops">');
					if (inactive.headimgurl == '') {
						h.push('<img class="act-icon act-inactive" src="../img/act-0405-33.png" />');
					} else {
						h.push('<img class="act-icon act-inactive" src="' + inactive.headimgurl + '" />');
					}

					h.push('<p>未激活</p>');
					h.push('</div>');
				});
				h.push('</div');
				$('.act-0405-3-invite').after(h.join(''));

				//add  sleepbags records
				var awardNum = resp.award_left + '';
				var len = awardNum.length;
				h = [];
				h.push('<div class="act-0405-3-sleepbags"><div class="bags-num">');
				for (var i = 0; i < len; i++) {
					h.push('<img src="../img/' + awardNum.substr(i, 1) + '.svg">');
				}
				h.push('</div></div>')
				h.push('<div class="act-sleepbags-container collapse">');
				resp.award_list.forEach(function(award) {
					h.push('<div class="col-xs-10 no-padding text-left act-0405-3-sleepbags-record">');
					h.push('<p>' + award.customer_nick + ',打开第' + award.invite_num + '个信封，获得最后一张“拼”图，成功拼成一条浴巾</p>');
					h.push('</div>');
				});
				h.push('</div>');
				h.push('<div class="col-xs-12">');
				h.push('<img src="../img/act-0405-21.png" class="act-0405-show" data-toggle="collapse" data-target=".act-sleepbags-container">');
				h.push('</div>');
				$('.act-0405-show').after(h.join(''));
			}
		});
	};
	//打开信封
	var openEnvelope = function(event) {
		var envelope_id, $eventTarget;
		$eventTarget = $(event.target);
		envelope_id = $eventTarget.attr('data-id');
		$.ajax({
			type: 'GET',
			url: '/sale/promotion/open_envelope/' + envelope_id + '/',
			success: function(resp) {
				var h = [];
				h.push('<div class="act-popup" data-numCards="' + resp.num_cards + '">');
				if (resp.friend_img == '') {
					h.push('<img src="../img/act-0405-33.png" class="act-customer-img"/>');
				} else {
					h.push('<img src="' + resp.friend_img + '" class="act-customer-img"/>');
				}
				h.push('<p>成功邀请 ' + resp.friend_nick + ' </p>');
				if (resp.type == 'card') {
					h.push('<img src="../img/cardGet_' + resp.value + '.png" class="act-card-get"/>');
				} else {
					h.push('<div class="act-cash-get">');
					h.push('<p>' + resp.yuan_value + '</p>');
					h.push('</div>');
				}

				h.push('</div>');
				$('body').append(h.join(''));
				//show card
				if (resp.type == 'card' && resp.status == 'open') {
					var $img = $('.card_' + resp.value);
					$('.card_' + resp.value).removeClass('card-hide');
					$img[0].src = '../img/card_' + resp.value + '.png';
				}
				//change envelop status
				var $openedImg = $('img[data-id=' + resp.id + ']');
				if (resp.type == 'card') {
					$openedImg[0].src = '../img/act-0405-26.png';
					$openedImg.siblings().text('拼图');
				} else if (resp.type == 'cash') {
					$openedImg[0].src = '../img/act-0405-25.png';
					$openedImg.siblings().text(resp.yuan_value);
				}
			},
			error: function(resp) {}
		});

	};
	//dropdown popup
	var closePopup = function() {
		var $popup = $('.act-popup');
		var old_num_cards;
		if ($('.act-cards-container').length) {
			old_num_cards = $('.receive-coupon').attr('data-numCards');
		} else {
			old_num_cards = $('.act-cards-container').attr('data-numCards');
		}
		var new_num_cards = $popup.attr('data-numCards');
		if ($('.receive-coupon').length) {
			$('.receive-coupon').attr('data-numCards', new_num_cards);
		}
		if ($('.act-cards-container').length) {
			$('.act-cards-container').attr('data-numCards', new_num_cards);
		}

		$popup.remove();
		if (old_num_cards == 8 && new_num_cards == 9) {
			if (!$('.receive-coupon').length) {
				var h = [];
				h.push('<div class="act-popup" >');
				h.push('<img src="../img/act-0405-37.png" class="complete-cards"/>');
				h.push('</div>');
				$('body').append(h.join(''));
			}
		}
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

	requestData();
	$(document).on('click', '.act-evelops-container .act-evelop', openEnvelope);
	$(document).on('click', '.act-card-get', closePopup);
	$(document).on('click', '.act-cash-get', closePopup);
	$(document).on('click', '.complete-cards', function() {
		$('.act-popup').remove();
		$('.act-cards-container').remove();
		var h = [];
		if (!$('.receive-coupon').length) {
			h.push('<img src="../img/receive.png" class="receive-coupon">');
		}
		$('.act-0405-time').after(h.join(''));
	});
	$(document).on('click', '.act-0405-3-invite img', function() {
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
	$(document).on('click', '.receive-coupon', function() {
		$.ajax({
			data: {
				'template_id': 40
			},
			type: 'POST',
			url: '/rest/v1/usercoupons',
			success: function(resp) {

				if (resp.code == 0) {
					var os = OSTest();
					console.log('os share:', os)
					if (os == 'iOS') {
						setupWebViewJavascriptBridge(function(bridge) {
							var data = {
								'url': 'com.jimei.xlmm://app/v1/usercoupons/method',
							};
							bridge.callHandler('jumpToNativeLocation', data, function(response) {
								console.log("jumpToNativeLocation called with:", data);
							});
						})
					} else {
						if (window.AndroidBridge) {
							var data = {
								'url': 'com.jimei.xlmm://app/v1/usercoupons/method',
							};
							window.AndroidBridge.jumpToNativeLocation(data.url);
						}
					}
				} else if (resp.code == 1) {
					var h = [];
					h.push('<div class="act-popup act-coupon" >');
					h.push('<p>优惠劵领取受限，欢迎参加本次活动。您的红包可以提现也可在商城消费</p>');
					h.push('<img src="../img/receive.png">');
					h.push('</div>');
					$('body').append(h.join(''));
				} else {
					var h = [];
					h.push('<div class="act-popup act-coupon" >');
					h.push('<p>优惠卷没有发放。您的红包可以提现也可在商城消费</p>');
					h.push('<img src="../img/receive.png">');
					h.push('</div>');
					$('body').append(h.join(''));
				}
			}
		});
	});
	$(document).on('click', '.act-coupon', function() {
		$('.act-popup').remove();
	})
});