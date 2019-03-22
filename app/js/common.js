$(document).ready(function() {

    var top_show = 190;//при каком положении кнопка появляется
    var delay = 400; // Задержка прокрутки

    $(window).scroll(function () {
        if ($(this).scrollTop() > top_show) $('.ontop').fadeIn();
        else $('.ontop').fadeOut();
    });
    $('.ontop').click(function () {
        $('body, html').animate({
            scrollTop: 0
        }, delay);
    });

    // menu fixed
    var width = $(window).width();

    if(width >= 980) {
        var h_hght = 191 - 60;
        var h_mrgn = 0;

        $(window).scroll(function(){
            var top = $(this).scrollTop();
            var elem = $('.top_nav');
            if(top + h_mrgn > h_hght){
                $('.top_nav').addClass('fix');
                $('.nav_mob').removeClass('fix');
            }else{
                $('.top_nav').removeClass('fix');
            }
        });
    }

    if(width <= 979) {
        var h_hght = 59;
        var h_mrgn = 0;

        $(window).scroll(function(){
            var top = $(this).scrollTop();
            var elem = $('.nav_mob');
            if(top + h_mrgn > h_hght){
                $('.nav_mob').addClass('fix').slideDown(500);
                $('.top_nav').removeClass('fix');
            }else{
                $('.nav_mob').removeClass('fix');
            }
        });
    }

    // //humburger animation
    $('.nav_mob__humburger').on('click', function() {
        $('.nav_mob__line').toggleClass('animate');
        $('.nav_mob__slide').slideToggle(500);
        if($('.nav_mob__line').hasClass('animate')) {
            $('.parent_modal').fadeIn(500);
        }else{
            $('.parent_modal').fadeOut(500);
        }
    });

    // callback form click event

    function scrollbarWidth() {
        var div = $('<div style="width:50px; height:50px; overflow:hidden; position:absolute; top:-200px; left:-200px;"><div style="height:100px;"></div></div>').appendTo('body');
        var w1 = $('div', div).innerWidth();
        div.css('overflow-y', 'scroll');
        var w2 = $('div', div).innerWidth();
        $(div).remove();
        return (w1 - w2);
    }

    var body = $('body').hasClass();
    if(body === 'fancybox-active'){
        $('.top_nav').css('overflow', 'scroll !important');
    }else{
        $('.top_nav').removeAttr('style');
    }

    $('.js-callback').on('click', function() {
        $('.fix').addClass('compensate');
    });


    $('[data-fancybox]').fancybox({
        arrows: false,
        infobar: false,
        parentEl: "body",
        afterClose: function() {
            $('.fix').removeClass('compensate'); }
    });



    // callback form send
    $('#cb_form').submit(function (e) {
        e.preventDefault();
        var data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: 'send.php',
            data: data,
            success: function () {
                $('.modal__input').val('');
                $.fancybox.close();
                $.fancybox.open({
                    src: "#success"
                }, 300);
                setTimeout(function() {
                    $.fancybox.close();
                }, 3000);
            }
        });
    });

    // phone input mask
    $(".phone").inputmask("+7(999)-999-99-99");

    // top form steps script
    var jsbtn = $('.js-btn');
    var textarea = $('.js-textarea');
    var txthide = $('.js-txthide');
    var speptxt = $('.js-speptxt');
    var step1 = $('.js-step1');
    var step2 = $('.js-step2');



    // step form
    jsbtn.on('click', function() {
        if(textarea.val() === ''){
            textarea.attr('placeholder', 'Пожалуйста, оставьте свое сообщение');
            textarea.css('border', '1px solid #ff827d');
        }else{
            textarea.removeAttr('style');
            speptxt.text('Оператор получит Ваше сообщение и готов Вам помочь. Укажите контактные данные, для того чтобы мы с Вами связались');
            var txt = textarea.val(); //value textarea
            txthide.val(txt); //append text at textarea hide
            step1.css('display', 'none'); //hide step1
            step2.css('display', 'block'); //show step2
        }

    });

    textarea.on('focus', function () {
        textarea.removeAttr('style')
        textarea.attr('placeholder', 'Текст вашего вопроса...');
    })

    // send forms
    $('#form1').submit(function(e) {
        e.preventDefault();
        var data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: 'help.php',
            data: data,
            success: function () {
                $('.step_input, textarea').val('');
                $.fancybox.open({
                    src: "#success"
                }, 300);
                setTimeout(function() {
                    $.fancybox.close();
                }, 3000);
                step2.css('display', 'none'); //show step2
                step1.css('display', 'block'); //hide step1
            }
        });
    });



    //conter options and initialisation
    function rand(min, max) {
        return (max-min)*Math.random()+min
    }


    var clock1;
    var clock2;

    clock1 = new FlipClock($('.js-count1'), 107, {
        clockFace: 'Counter'
    });

    clock2 = new FlipClock($('.js-count2'), 007, {
        clockFace: 'Counter'
    });

    if(flag === '1') {
        clock1.setValue(112);
        clock2.setValue(002);
    }else{
        setInterval(function () {
            if(clock1.getTime() < 112){
                clock1.increment();
            }
        }, rand(5000, 8000));

        setInterval(function () {
            if(clock2.getTime() > 2){
            clock2.decrement();
            }
        }, rand(5000, 8000));
    }

    // anchor code slide
    var $page = $('html, body');
    $('a[href*="#"]').on('click', function() {
        event.preventDefault();
        $page.animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 70
        }, 1000);
        $('.nav_mob__line').toggleClass('animate');
        $('.nav_mob__slide').slideToggle(500);
        $('.parent_modal').fadeOut(500);
        return false;
    });

});