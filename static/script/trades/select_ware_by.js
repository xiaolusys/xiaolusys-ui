function select_ware_by(el){
    var wareby_id = $(el).val() - 0;
    var wareby = $(el).attr('wareby-id') - 0;
    var package_id = $(el).data('package-id');
    $.ajax({
        url: '/trades/package_order/change_wareby',
        type: 'post',
        dataType: 'json',
        data: {"ware_by": wareby_id, "pid": package_id},
        success:function(){
            alert("修改仓库成功");
        }
    });
}
