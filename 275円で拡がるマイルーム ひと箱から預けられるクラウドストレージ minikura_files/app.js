$(window).on('load', function () {
    var webfont = document.getElementById('gfont');
    webfont.rel = 'stylesheet';
});

var Speed = 500;
var Ease = 'easeInOutExpo';
mediaQuery = matchMedia('(max-width: 959px)');

var App = {

    lnkPagetop: function () {
        $(window).scroll(function () {
            if ($(window).scrollTop() > 300) {
                $('#scrollTop').addClass('active');
            } else {
                $('#scrollTop').removeClass('active');
            }
        });
    },

    smoothScroll: function () {
        $('a[href^="#"]').click(function () {
            var href = $(this).attr("href");
            var target = $(href == "#" || href == "" ? 'html' : href);
            var position = target.offset().top;
            $('body,html').animate({ scrollTop: position }, Speed, Ease);
            return false;
        });
    },


    blockFade: function () {

        var ctr = new ScrollMagic.Controller();

        var yPlus5 = document.querySelectorAll('.y-plus5');
        for (var i = 0; i < yPlus5.length; i++) {
            var classToggle = new ScrollMagic.Scene({
                triggerHook: "onEnter",
                triggerElement: yPlus5[i],
            })
                .setClassToggle(yPlus5[i], "active")
                .reverse(true)
                .addTo(ctr);
        }
        //
        var xPlus5 = document.querySelectorAll('.x-plus5');
        for (var i = 0; i < xPlus5.length; i++) {
            var classToggle = new ScrollMagic.Scene({
                triggerHook: "onEnter",
                triggerElement: xPlus5[i],
            })
                .setClassToggle(xPlus5[i], "active")
                .reverse(true)
                .addTo(ctr);
        }
        //
        var xMinus5 = document.querySelectorAll('.x-minus5');
        for (var i = 0; i < xMinus5.length; i++) {
            var classToggle = new ScrollMagic.Scene({
                triggerHook: "onEnter",
                triggerElement: xMinus5[i],
            })
                .setClassToggle(xMinus5[i], "active")
                .reverse(true)
                .addTo(ctr);
        }
        //
        var order = document.querySelectorAll('.wrapOrder');
        for (var i = 0; i < order.length; i++) {
            var classToggle = new ScrollMagic.Scene({
                triggerHook: "onEnter",
                triggerElement: order[i],
            })
                .setClassToggle(order[i], "bound")
                .reverse(true)
                .addTo(ctr);
        }
        //
        var op0 = document.querySelectorAll('.op0');
        for (var i = 0; i < op0.length; i++) {
            var classToggle = new ScrollMagic.Scene({
                triggerHook: "onEnter",
                triggerElement: op0[i],
            })
                .setClassToggle(op0[i], "active")
                .reverse(true)
                .addTo(ctr);
        }
    },

    blockFadeBranch: function () {
        if ($('.blockfade').length) {
            App.blockFade();
            console.log('blockFade')
        } else {
            console.log('no blockFade')
        }
    },

    followupLoad: function () {
        if ($('#followup').length) {
            console.log('has followup');
            setTimeout(function () {
                $('.l-bnr-followup').addClass('display');
            }, 2000);
            $(document).on('click', '#followup-close', function () {
                $('.l-bnr-followup').removeClass('display');
            });
            return false;
        } else {
            return false;
        }
    },

    cookieAuthentication: function () {
        if ($.cookie('access') == undefined) {
            console.log('1st access');
            // App.followupLoad();
            $.cookie('access', 'onece', { expires: 1 });
        } else {
            //App.followupLoad();
            console.log('2nd access');
        }
    },

    mainimgSwitch: function () {
        $('.l-dtl-thumb:first-of-type .lnk-thum').addClass('active');
        $('.main1').addClass('active').fadeIn();
        $('.lnk-thum').click(function () {
            thumID = $(this).attr("id");
            thumNum = thumID.replace('thum', '');
            $(this).parents().siblings('.ls-main').find('.l-dtl-main').removeClass('active');
            $(this).parents().siblings('.ls-main').find('.main' + thumNum).addClass('active');
            $(this).parents('.ls-thumb').find('.l-dtl-thumb .lnk-thum').removeClass('active');
            $(this).parents('.ls-thumb').find('#thum' + thumNum).addClass('active');
        });
        return false;
    },

    planSwitch: function () {

        handle(mediaQuery);
        mediaQuery.addListener(handle);

        function handle(mq) {
            if (mq.matches) {
                $('#lineup-nophotobox').hide();
                $('[name=planSelect]').change(function () {
                    if ($(this).val() === 'plan-photobox') {
                        $('#lineup-photobox').fadeIn(Speed, Ease);
                        $('#lineup-nophotobox').hide();
                    } else if ($(this).val() === 'plan-nophotobox') {
                        $('#lineup-photobox').hide();
                        $('#lineup-nophotobox').fadeIn(Speed, Ease);
                    }
                });
                return false;

            } else {
                $('#lineup-nophotobox').show();
                return false;
            }
        };
    },

    viewHeader: function () {
        handle(mediaQuery);
        mediaQuery.addListener(handle);
        //
        $('#viewMain,#rayMain').removeClass('display');
        //
        function handle(mq) {
            if (mq.matches) {
                $('#viewMain,#rayMain').on('click', function () {
                    $('#navSub').removeClass('display');
                    if ($('#rayMain').hasClass('display')) {
                        $('body').removeClass('fixed').css({ 'top': 0 });
                        window.scrollTo(0, scrollpos);
                        $.when(
                            $('#viewMain,#navMain').removeClass('display')
                        ).done(function () {
                            $('#rayMain').removeClass('display');
                        });
                        return false;
                    } else {
                        scrollpos = $(window).scrollTop();
                        $('body').addClass('fixed').css({ 'top': -scrollpos });
                        $.when(
                            $('#rayMain').addClass('display')
                        ).done(function () {
                            $('#viewMain,#navMain').addClass('display');
                        });
                        return false;
                    }
                });
            } else {
                $('#rayMain').removeClass('display');
            }
        };
    },

    elementLoad: function () {
        if ($('body').hasClass('news')) {
            $("#header").load('/contents/element/header.html', function () {
                App.viewHeader();
            });
            $('#footer').load('/contents/element/footer.html');
            return false;
        } else {
            return false;
        }

    },

    toggleContentsOnClick: function (clickElement, target) {
        if(!$(clickElement).length && !$(target).length) return;

        $(target).hide();
        $(clickElement).click(function () {
            $(this).parent().find(target).slideToggle(Speed, Ease);
        });
    },

    executeSliderFor: function (target) {
        if (document.querySelector(target) === null) return;

        const slideLength = document.querySelectorAll(target + ' .swiper-slide').length
        if (slideLength > 1) {
            var swiper = new Swiper(target, {
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        }
    },
};

$(function () {
    App.lnkPagetop();
    App.smoothScroll();
    App.blockFadeBranch();
    App.cookieAuthentication();
    App.mainimgSwitch();
    App.planSwitch();
    App.viewHeader();
    App.elementLoad();
    App.toggleContentsOnClick('.l-picking-fee .modal-button', '.l-toggle-contents');
    App.executeSliderFor('.l-slide-banner .swiper-container');
});