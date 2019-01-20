(function ($) {

    "use strict";

    $(window).on('load', function () {
        $('[data-loader="circle-side"]').fadeOut(); // will first fade out the loading animation
        $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
        $('body').delay(350);
        $('header, #hero_in h1, #hero_in form').addClass('animated');
        $('.hero_single, #hero_in').addClass('start_bg_zoom');
        $(window).scroll();
    });
})(window.jQuery); 