$(document).ready(function() {
	var $addImg = $('.act-0405-add img');
	var $addBkg = $('.act-0405-add');
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
			$('#day_show').html('<img  src="../img/' + (Math.floor(day / 10)) + '.png" /> <img  src="../img/' + ((day / 10).toString().split('.')[1] || 0) + '.png" />');
			$('#hour_show').html('<img  src="../img/' + (Math.floor(hour / 10)) + '.png" /> <img  src="../img/' + ((hour / 10).toString().split('.')[1] || 0) + '.png" />');
			$('#minute_show').html('<img  src="../img/' + (Math.floor(minute / 10)) + '.png" /> <img  src="../img/' + ((minute / 10).toString().split('.')[1] || 0) + '.png" />');
			$('#second_show').html('<img  src="../img/' + (Math.floor(second / 10)) + '.png" /> <img  src="../img/' + ((second / 10).toString().split('.')[1] || 0) + '.png" />');
			intDiff--;

		}, 1000);
	};
	//add activity
	var add = function() {
		var $addImg = $('.act-0405-add img');
		var celNum = $('input').val();
		$.ajax({
			data: {
				'mobile': celNum
			},
			type: 'post',
			url: '/sale/promotion/apply/3/',
			success: function(res) {
				if (res.rcode == 0) {
					if (res.next == 'download') {
						window.location.href = '../html/act-0405-2.html';
					} else if (res.next == 'mainpage') {
						window.location.href = '../html/act-0405-3.html';
					} else if (res.next == 'snsauth') {
						window.location.href = '/sale/promotion/weixin_snsauth_join/3/';
					} else if (res.next == 'activate') {
						window.location.href = '/sale/promotion/activate/3/';
					}

				} else {
					$('input').val('');
					$('input')[0]['placeholder'] = '请重新输入';
				}
			},
			error: function(res) {
				console.log(res);
			}
		});
	};

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
				//cellNumber input
				var $cellNum = $('.act-0405-celNumber');
				if (res.mobile_required && $cellNum.hasClass('act-0405-hide')) {
					$cellNum.removeClass('act-0405-hide');
				}
				//show customer img
				var h = [];
				h.push('<img src="' + res.img + '">');
				h.push('<div class="act-0405-beInvited－text">');
				h.push('有福同享！我在集拼图换浴巾，送你一片拼图，快来一起加入吧～');
				h.push('</div>');
				$('.act-0405-beInvited').append(h.join(''));
			},
			error: function(res) {
				$('input')[0]['placeholder'] = '请重新输入';
			}
		});
	};
	requestData();
	$(document).on('click', '.act-0405-add img', add);
});