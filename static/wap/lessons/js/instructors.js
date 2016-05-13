//var BASE_URL = 'http://127.0.0.1:8000';
//var BASE_URL = 'http://staging.xiaolumeimei.com';
var BASE_URL = 'http://m.xiaolumeimei.com';

var nextPage = null;



function renderSingleData(data) {
    var content = [];
    
    if (data.status == 1) {
        content.push('<div class="attender-row">');
    } else {
        content.push('<div class="attender-row duplicate">');
    }
    content.push('<div class="attender-left">');
    content.push('<img src="'+data.image+'" class="img-circle" style="height:100%;">');
    content.push('</div><div class="attender-middle">');
    content.push('<p class="attender-name">'+data.name+'</p>');
    content.push('<p>'+data.apply_date+'</p>');
    content.push('</div><div class="attender-right">');
    content.push('<p class="signup-status">'+data.status_display+'</p>');
    content.push('</div></div>');
    $("#id-instructor-list").append(content.join(''));
}


function renderDataList(res) {
    if (res) {
        var arr = res.results
        nextPage = res.next;
        console.log(res.count);
        $("#id-instructor-num")[0].innerHTML = res.count+' 名';
        
        for(var i=0; i<arr.length; i++) {
            renderSingleData(arr[i]);
        }
    }
}


function loadInstructorMyself(unionid) {
    if (!unionid) unionid = '';
    var url = BASE_URL + '/rest/lesson/instructor/get_instructor?unionid='+unionid;
    var callback = function (res) {
        if (res) {
            renderSingleData(res);
        }
    };
    
    $.ajax({url:url, success: callback});
}


function loadInstructors(unionid) {
    if (!unionid) unionid = '';
    var record_url = '/rest/lesson/instructor?unionid='+unionid;
    var url = BASE_URL + record_url;
    $.ajax({url:url, success:renderDataList});
}


function loadNextPage() {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    var windowHeight = $(window).height();
    var documentHeight = $(document).height();

    if (scrollTop == documentHeight - windowHeight) {
        if (nextPage) {
            $.ajax({url:nextPage, success:renderDataList});
        }
    }
    
}

function getUnionIdParam() { 
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    
    if (url.indexOf("?") != -1) { 
        var str = url.substr(1); 
        strs = str.split("&"); 
        for(var i = 0; i < strs.length; i ++) {
            pair = strs[i].split("=")
            if (pair[0] == 'unionid') {
                return pair[1];
            }
        } 
    } 
    return null;
}


$(document).ready(function() {
    var union_id = getUnionIdParam();
    if (union_id) {
        loadInstructorMyself(union_id);
    }
    loadInstructors(union_id);
    $(window).on("scroll", function () {
        loadNextPage();
    });
});

