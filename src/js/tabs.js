$(function() {
    $(".page-container").eq(1).hide()
    $(".page-container").eq(2).hide()
    $(".touchbar div").click(function() {
        // 链式编程操作
        $(this).addClass("active").siblings().removeClass("active");
        // 2.点击的同时，得到当前li 的索引号
        let index = $(this).index();
        // 3.让下部里面相应索引号的item显示，其余的item隐藏
        $(".page-container").eq(index).show().siblings().hide();
    });
})