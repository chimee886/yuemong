$(function() {
    var mySwiper = new Swiper('.swiper-container', {
        //direction: 'vertical', // 垂直切换选项
        loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        }
        // 如果需要前进后退按钮
        /* navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }, */

        // 如果需要滚动条
        /* scrollbar: {
            el: '.swiper-scrollbar',
        }, */
    })
    var swiper = new Swiper('.albums-container', {
        slidesPerView: 2.3,
        spaceBetween: 10,
        freeMode: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper

        observeParents: true //修改swiper的父元素时，自动初始化swiper
    });
})