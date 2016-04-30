var _ = _ || false;
var $ = $ || false;
var Qiniu = Qiniu || false;

var ADD_ITEM_TEMPLATE = _.template('<li class="upload-add" style="width: <%= width %>;height: <%= height %>;">' +
                                   '<div class="uploader-btn"></div>' +
                                   '<span class="uploader-tip">上传中</span>' +
                                   '<a class="uploader-cancel" href="javascript:;"></a>' +
                                   '</li>');
var ITEM_TEMPLATE = _.template('<li style="width: <%= width %>;height: <%= height %>;">' +
                               '<a href=<%= value %> target="_blank"><img src=<%= value %>></a>' +
                               '<a class="uploader-del" href="javascript:;"></a>' +
                               '</li>');

$.fn.uploader = function(options, param){
    if(typeof options == 'string'){
        if($.isFunction($.fn.uploader.methods[options])){
            return $.fn.uploader.methods[options](this, param);
        }
    }

    var $that = $(this);
    var id = $(this).attr('id') || 'upload';
    options = $.extend(options || {}, {id: id});
    $that.data('options', options);

    var $uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        max_file_size: '100mb',
        flash_swf_url: 'js/plupload/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        uptoken_url: '/mm/qiniu/?format=json',
        domain: options.domain,
        auto_start: true,
        init: {
            FileUploaded: function (up, file, info) {
                var data = up.getOption('domain') + $.parseJSON(info).key;
                $that.uploader('addItem', data);
            },
            Key: function (up, file) {
                return FileNameHandler(file.name);
            }
        }
    });

    if(!$(this).is('ul')){
        $(this).on('click', function(){
            $('.moxie-shim input[type="file"]').click();
        });
        return $(this);
    }

    return $(this).each(function(index, element){
        var $this = $(this);
        var opts = $.extend({}, $.fn.uploader.defaults, options);

        $this.html(ADD_ITEM_TEMPLATE({
            width: opts.width,
            height: opts.height
        }));

        opts.success = function(data){
            $this.data('data', data);
            $.fn.uploader.methods.addItem($that, data);
        };
        $this.on('click', '.uploader-btn', function(){
            $('.moxie-shim input[type="file"]').click();
        });

        $this.on('click', '.uploader-del', function(){
            $.fn.uploader.methods.removeItem($that, $(this).closest('li'));
        });

        $this.on('click', '.uploader-cancel', function(){
        });
    });
};

$.fn.uploader.methods = {
    options: function($target){
        return $.data($target[0], 'options');
    },

    getSize: function($target){
        return $target.find('li:not(.upload-add)').length;

    },
    getData: function($target){
        var data = [];
        $target.find('li:not(.upload-add)').each(function(){
            data.push($(this).data('data'));
        });
        return data;
    },
    setData: function($target, data){
        var that = this;
        this.clear($target);
        if(!_.isArray(data))
            this.addItem($target, data);
        else{
            _.each(data, function(item){
                that.addItem($target, item);
            });
        }
    },
    removeItem: function($target, $item){
        var options = this.options($target);
        $item.remove();
        if(this.getSize($target) < options.maxLength)
            $target.find('.upload-add').show();
        $target.trigger('change');
    },
    addItem: function($target, data){
        var options = this.options($target);
        if(options.maxLength < this.getSize($target) + 1)
            return;

        var url = options.imageOp ? data + '?' + options.imageOp : data;
        var $item = $(ITEM_TEMPLATE({
            value: url,
            width: options.width,
            height: options.height
        }));
        $item.data('data', data);
        var $add = $target.find('.upload-add');
        $add.before($item);

        if(options.maxLength == this.getSize($target))
            $add.hide();
        $target.trigger('change');
    },
    clear: function($target){
        var options = this.options($target);
        if(this.getSize($target) >= options.maxLength)
            $target.find('.upload-add').show();
        $target.find('li:not(.upload-add)').remove();
    }
};
