$(document).ready(function() {
	var baseurl = 'http://staging.xiaolumeimei.com';
	var $top = $('.act-0405-2-top')[0];
	var screenWidth = document.body.clientWidth;
	$top.style.height = screenWidth * 1.28 + 'px';
	//倒计时
	var intDiff = parseInt(417729158 / 1000);

	var timer = function(intDiff) {
		window.setInterval(function() {
			var day = 0,
				hour = 0,
				minute = 0,
				second = 0;

			//时间默认值		
			if (intDiff > 0) {
				day = Math.floor(intDiff / (60 * 60 * 24));
				hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
				minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
				second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
			}
			if (day <= 9) day = '0' + day;
			if (hour <= 9) hour = '0' + hour;
			if (minute <= 9) minute = '0' + minute;
			if (second <= 9) second = '0' + second;
			$('#day_show').html(day);
			$('#hour_show').html(hour);
			$('#minute_show').html(minute);
			$('#second_show').html(second);
			intDiff--;
		}, 1000);
	};
	var requestData = function() {
		var end_time, current_time, rest_time;
		$.ajax({
			type: 'GET',
			url: baseurl + '/sale/promotion/apply/3/',
			success: function(resp) {
				//set rest time of activity
				end_time = resp.end_time;
				current_time = (new Date()).getTime();
				rest_time = parseInt((end_time - current_time) / 1000);
				console.log('end_time:' + end_time);
				console.log('current_time:' + current_time);
				timer(rest_time);
				addCard();
				popup(resp);
			}
		});
	};
	var downloadClick = function() {
		window.location.href = baseurl + '/sale/promotion/appdownload/';
	};
	var addCard = function() {
		var h = [];
		h.push('<div class="act-cards-container">');
		for (var i = 1; i < 10; i++) {
			h.push('<div class="col-xs-4 no-padding act-card">');
			h.push('<img src="../img/card_hide_' + i + '.png" class="card_' + i + '">');
			h.push('</div>');
		}
		h.push('</div>');
		$('.act-0405-2-time').after(h.join(''));
	};
	var popup = function(resp) {
		var h = [];
		h.push('<div class="act-popup" >');
		// h.push('<img src="' + resp.img + '" class="act-customer-img"/>');
		// h.push('<p>成功邀请 ' + resp.nick + ' </p>');
		h.push('<img src="../img/cardGet_1.png" class="act-card-get"/>');
		h.push('</div>');
		$('body').append(h.join(''));
	};
	var closePopup = function() {
		var $popup = $('.act-popup');
		$popup.remove();
		$('.card_1')[0].src = '../img/card_1.png';
	};
	$(document).on('click', '.act-0405-2-download', downloadClick);
	$(document).on('click', '.act-popup', closePopup);
	requestData();
});