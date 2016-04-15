$(document).ready(function() {
	var screenHeight = document.body.clientHeight;
	var $div = $('.act-0405-5-container')[0];
	$div.style.height = screenHeight + 'px';

	var requestData = function() {
		$.ajax({
			type: 'GET',
			url: '/sale/promotion/stats/3/',
			success: function() {

			}
		});
	};
	requestData();
});