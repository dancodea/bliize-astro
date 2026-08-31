(function ($) {

    "use strict";


    /*------------------------------------------
        = ALL ESSENTIAL FUNCTIONS
-------------------------------------------*/

    // Cached selectors
    const $navigationHolder = $(".navigation-holder");
    const $mobileMenuOpenBtn = $(".mobail-menu .open-btn");
    const $mobileMenuToggleBtn = $(".mobail-menu .navbar-toggler");
    const $mainNavUl = $("#navbar > ul");
    const $body = $("body");
    const $menuCloseBtns = $(".menu-close");

    /**
     * Toggle mobile navigation
     */
    function toggleMobileNavigation() {
        $mobileMenuOpenBtn.on("click", (e) => {
            e.stopImmediatePropagation();
            $navigationHolder.toggleClass("slideInn");
            $mobileMenuToggleBtn.toggleClass("x-close");
            return false;
        });
    }
    toggleMobileNavigation();

    /**
     * Debounce helper
     */
    function debounce(func, wait = 150) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Toggle class for small nav based on window width
     */
    function toggleClassForSmallNav() {
        const windowWidth = window.innerWidth;
        if (windowWidth <= 991) {
            $mainNavUl.addClass("small-nav");
        } else {
            $mainNavUl.removeClass("small-nav");
        }
    }

    /**
     * Small navigation submenu toggle functionality
     */
    function smallNavFunctionality() {
        const windowWidth = window.innerWidth;
        const $smallNav = $navigationHolder.find("> .small-nav");
        const $subMenus = $smallNav.find(".sub-menu");
        const $megaMenus = $smallNav.find(".mega-menu");
        const $menuItemsWithChildren = $smallNav.find(".menu-item-has-children > a");

        if (windowWidth <= 991) {
            $subMenus.hide();
            $megaMenus.hide();

            $menuItemsWithChildren.off("click").on("click", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $(this).siblings().slideToggle();
                $(this).toggleClass("rotate");
            });
        } else {
            $navigationHolder.find(".sub-menu").show();
            $navigationHolder.find(".mega-menu").show();
            $menuItemsWithChildren.off("click");
        }
    }

    /**
     * Close navigation menu and toggle button states
     */
    function closeNavigation() {
        $navigationHolder.removeClass("slideInn");
        $mobileMenuToggleBtn.removeClass("x-close");
    }

    // Initialize functions on load and bind event listeners
    function initEssentialFunctions() {
        toggleClassForSmallNav();
        smallNavFunctionality();

        $(window).on(
            "resize",
            debounce(() => {
                toggleClassForSmallNav();
                smallNavFunctionality();
            })
        );

        $body.on("click", closeNavigation);
        $menuCloseBtns.on("click", closeNavigation);
    }

    initEssentialFunctions();

    /**
     * Other UI toggle handlers
     */

    $("#toggle1").on("click", () => {
        $(".create-account").slideToggle();
        $(".caupon-wrap.s1").toggleClass("active-border");
    });

    $("#toggle2").on("click", () => {
        $("#open2").slideToggle();
        $(".caupon-wrap.s2").toggleClass("coupon-2");
    });

    $("#toggle3").on("click", () => {
        $("#open3").slideToggle();
        $(".caupon-wrap.s2").toggleClass("coupon-2");
    });

    $("#toggle4").on("click", () => {
        $("#open4").slideToggle();
        $(".caupon-wrap.s3").toggleClass("coupon-2");
    });

    $(".payment-select .addToggle").on("click", () => {
        $(".payment-name").addClass("active");
        $(".payment-option").removeClass("active");
    });

    $(".payment-select .removeToggle").on("click", () => {
        $(".payment-option").addClass("active");
        $(".payment-name").removeClass("active");
    });

    /**
     * Initialize tooltips (Bootstrap 5)
     */
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

    /*------------------------------------------
       = TEAM SECTION
    -------------------------------------------*/
    const $singleMember = $(".social");
    $singleMember.on("click", function () {
        $(this).toggleClass("active");
    });

    /**
     * Parallax background effect
     */
    function bgParallax() {
        if ($(".parallax").length) {
            $(".parallax").each(function () {
                const height = $(this).position().top;
                const resize = height - $(window).scrollTop();
                const doParallax = -(resize / 5);
                const positionValue = doParallax + "px";
                const img = $(this).data("bg-image");

                $(this).css({
                    backgroundImage: "url(" + img + ")",
                    backgroundPosition: "50% " + positionValue,
                    backgroundSize: "cover",
                });
            });
        }
    }

    /**
     * HERO SLIDER
     */
    const menu = [];
    jQuery(".swiper-slide").each(function () {
        menu.push(jQuery(this).find(".slide-inner").attr("data-text"));
    });

    const interleaveOffset = 0.5;

    const swiperOptions = {
        loop: true,
        speed: 1000,
        parallax: true,
        autoplay: {
            delay: 6500,
            disableOnInteraction: false,
        },
        watchSlidesProgress: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: "fraction",
            renderFraction: function (currentClass, totalClass) {
                return (
                    '<span class="' + currentClass + '"></span>' +
                    " / " +
                    '<span class="' + totalClass + '"></span>'
                );
            },
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        on: {
            progress: function () {
                const swiper = this;
                for (let i = 0; i < swiper.slides.length; i++) {
                    const slideProgress = swiper.slides[i].progress;
                    const innerOffset = swiper.width * interleaveOffset;
                    const innerTranslate = slideProgress * innerOffset;
                    swiper.slides[i].querySelector(".slide-inner").style.transform =
                        "translate3d(" + innerTranslate + "px, 0, 0)";
                }
            },
            touchStart: function () {
                const swiper = this;
                for (let i = 0; i < swiper.slides.length; i++) {
                    swiper.slides[i].style.transition = "";
                }
            },
            setTransition: function (speed) {
                const swiper = this;
                for (let i = 0; i < swiper.slides.length; i++) {
                    swiper.slides[i].style.transition = speed + "ms";
                    swiper.slides[i].querySelector(".slide-inner").style.transition = speed + "ms";
                }
            },
            slideChange: function () {
                updateFractionNumbers();
            },
            init: function () {
                updateFractionNumbers();
            },
        },
    };

    const swiper = new Swiper(".swiper-container", swiperOptions);

    // DATA BACKGROUND IMAGE
    const sliderBgSetting = $(".slide-bg-image");
    sliderBgSetting.each(function () {
        if ($(this).attr("data-background")) {
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });

    /**
     * Update fraction numbers with leading zeros
     */
    function updateFractionNumbers() {
        const currentElement = document.querySelector(".swiper-pagination-current");
        const totalElement = document.querySelector(".swiper-pagination-total");

        if (currentElement) {
            currentElement.textContent = String(swiper.realIndex + 1).padStart(2, "0");
        }
        if (totalElement) {
            totalElement.textContent = String(swiper.slides.length - 2).padStart(2, "0"); // -2 due to loop mode duplication
        }
    }


    /*------------------------------------------
         = HIDE PRELOADER
 -------------------------------------------*/
    function preloader() {
        const $preloader = $('.preloader');
        if ($preloader.length) {
            $preloader.delay(100).fadeOut(500, function () {
                // active wow
                wow.init();
            });
        }
    }

    /*------------------------------------------
            = WOW ANIMATION SETTING
    -------------------------------------------*/
    const wow = new WOW({
        boxClass: 'wow',           // default
        animateClass: 'animated',  // default
        offset: 0,                 // default
        mobile: true,              // default
        live: true                 // default
    });

    /*------------------------------------------
            = ACTIVE POPUP IMAGE
    -------------------------------------------*/
    if ($(".fancybox").length) {
        $(".fancybox").fancybox({
            openEffect: "elastic",
            closeEffect: "elastic",
            wrapCSS: "project-fancybox-title-style"
        });
    }

    /*------------------------------------------
            = POPUP VIDEO
    -------------------------------------------*/
    if ($(".video-btn").length) {
        $(".video-btn").on("click", function () {
            $.fancybox({
                href: this.href,
                type: $(this).data("type"),
                title: this.title,
                helpers: {
                    title: { type: 'inside' },
                    media: {}
                },
                beforeShow: function () {
                    $(".fancybox-wrap").addClass("gallery-fancybox");
                }
            });
            return false;
        });
    }

    /*------------------------------------------
            = ACTIVE GALLERY POPUP IMAGE
    -------------------------------------------*/
    if ($(".popup-gallery").length) {
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: { enabled: true },
            zoom: {
                enabled: true,
                duration: 300,
                easing: 'ease-in-out',
                opener: function (openerElement) {
                    return openerElement.is('img') ? openerElement : openerElement.find('img');
                }
            }
        });
    }

    /*------------------------------------------
            = FUNCTION FORM SORTING GALLERY
    -------------------------------------------*/
    function sortingGallery() {
        if ($(".sortable-gallery .gallery-filters").length) {
            const $container = $('.gallery-container');
            $container.isotope({
                filter: '*',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false,
                }
            });

            $(".gallery-filters li a").on("click", function () {
                $('.gallery-filters li .current').removeClass('current');
                $(this).addClass('current');
                const selector = $(this).attr('data-filter');
                $container.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false,
                    }
                });
                return false;
            });
        }
    }
    sortingGallery();

    /*------------------------------------------
            = MASONRY GALLERY SETTING
    -------------------------------------------*/
    function masonryGridSetting() {
        if ($('.masonry-gallery').length) {
            const $grid = $('.masonry-gallery').masonry({
                itemSelector: '.grid-item',
                columnWidth: '.grid-item',
                percentPosition: true
            });

            $grid.imagesLoaded().progress(function () {
                $grid.masonry('layout');
            });
        }
    }
    // masonryGridSetting();

    /*------------------------------------------
          = FUNFACT
    -------------------------------------------*/
    if ($(".odometer").length) {
        $('.odometer').appear();
        $(document.body).on('appear', '.odometer', function () {
            $(".odometer").each(function () {
                const countNumber = $(this).attr("data-count");
                $(this).html(countNumber);
            });
        });
    }

    /*------------------------------------------
            = STICKY HEADER
    -------------------------------------------*/
    // Function for clone an element for sticky menu
    function cloneNavForStickyMenu($ele, $newElmClass) {
        $ele.addClass('original').clone().insertAfter($ele).addClass($newElmClass).removeClass('original');
    }

    // clone home style 1 navigation for sticky menu
    if ($('.wpo-site-header .navigation').length) {
        cloneNavForStickyMenu($('.wpo-site-header .navigation'), "sticky-header");
    }

    let lastScrollTop = 0;
    function stickyMenu($targetMenu, $toggleClass) {
        const st = $(window).scrollTop();
        if (st > 1000) {
            if (st > lastScrollTop) {
                // hide sticky menu on scroll down
                $targetMenu.removeClass($toggleClass);
            } else {
                // active sticky menu on scroll up
                $targetMenu.addClass($toggleClass);
            }
        } else {
            $targetMenu.removeClass($toggleClass);
        }
        lastScrollTop = st;
    }

    /*------------------------------------------
            = Header search toggle
    -------------------------------------------*/
    if ($(".header-search-form-wrapper").length) {
        const searchToggleBtn = $(".search-toggle-btn");
        const searchToggleBtnIcon = $(".search-toggle-btn i");
        const searchContent = $(".header-search-form");
        const $body = $("body");

        searchToggleBtn.on("click", function (e) {
            searchContent.toggleClass("header-search-content-toggle");
            searchToggleBtnIcon.toggleClass("fi flaticon-loupe fi ti-close");
            e.stopPropagation();
        });

        $body.on("click", function () {
            searchContent.removeClass("header-search-content-toggle");
        }).find(searchContent).on("click", function (e) {
            e.stopPropagation();
        });
    }

    /*------------------------------------------
            = Header user toggle
    -------------------------------------------*/
    if ($(".header-user-wrapper").length) {
        const userToggleBtn = $(".user-toggle-btn");
        const userToggleBtnIcon = $(".user-toggle-btn i");
        const userContent = $(".header-user-form");
        const $body = $("body");

        userToggleBtn.on("click", function (e) {
            userContent.toggleClass("header-user-content-toggle");
            userToggleBtnIcon.toggleClass("fi flaticon-loupe fi ti-close");
            e.stopPropagation();
        });

        $body.on("click", function () {
            userContent.removeClass("header-user-content-toggle");
        }).find(userContent).on("click", function (e) {
            e.stopPropagation();
        });
    }

    /*------------------------------------------
            = Header shopping cart toggle
    -------------------------------------------*/
    if ($(".mini-cart").length) {
        const cartToggleBtn = $(".cart-toggle-btn");
        const cartContent = $(".mini-cart-content");
        const cartCloseBtn = $(".mini-cart-close");
        const $body = $("body");

        cartToggleBtn.on("click", function (e) {
            cartContent.toggleClass("mini-cart-content-toggle");
            e.stopPropagation();
        });

        cartCloseBtn.on("click", function (e) {
            cartContent.removeClass("mini-cart-content-toggle");
            e.stopPropagation();
        });

        $body.on("click", function () {
            cartContent.removeClass("mini-cart-content-toggle");
        }).find(cartContent).on("click", function (e) {
            e.stopPropagation();
        });
    }

    /*------------------------------------------
            = RECENT CASE SECTION SHOW HIDE
    -------------------------------------------*/
    if ($('.service-thumbs').length) {
        $('.service-thumb').on('click', function (e) {
            e.preventDefault();
            const target = $($(this).attr('data-case'));
            $('.service-thumb').removeClass('active-thumb');
            $(this).addClass('active-thumb');
            $('.service-content .service-data').hide(0);
            $('.service-data').fadeOut(300).removeClass('active-service-data');
            target.fadeIn(300).addClass('active-service-data');
        });
    }

    /*------------------------------------------
            = Testimonial SLIDER
    -------------------------------------------*/
    if ($(".wpo-testimonial-wrap").length) {
        $(".wpo-testimonial-wrap").owlCarousel({
            autoplay: false,
            smartSpeed: 300,
            margin: 20,
            loop: true,
            fade: true,
            autoplayHoverPause: true,
            dots: true,
            nav: false,
            items: 1,
        });
    }

    if ($(".wpo-service-slider").length) {
        $(".wpo-service-slider").owlCarousel({
            autoplay: false,
            smartSpeed: 300,
            margin: 20,
            loop: true,
            autoplayHoverPause: true,
            dots: true,
            nav: false,
            responsive: {
                0: { items: 1, dots: true, nav: false },
                500: { items: 1, dots: true, nav: false },
                768: { items: 2 },
                1200: { items: 3 },
                1400: { items: 4 },
            }
        });
    }

    if ($(".wpo-happy-client-slide").length) {
        $(".wpo-happy-client-slide").owlCarousel({
            autoplay: true,
            smartSpeed: 300,
            margin: 0,
            loop: true,
            autoplayHoverPause: true,
            dots: false,
            nav: false,
            items: 4
        });
    }

    if ($(".testimonial-slider").length) {
        $('.testimonial-slider').owlCarousel({
            loop: true,
            nav: true,
            dots: false,
            items: 1,
            autoplay: true,
            smartSpeed: 300,
            responsive: {
                0: { dots: true },
                991: { dots: true },
            }
        });
    }

    if ($(".inner-slider").length) {
        $('.inner-slider').owlCarousel({
            loop: true,
            nav: false,
            dots: false,
            items: 5,
            margin: 20,
            autoplay: true,
            smartSpeed: 300,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                992: { items: 3 },
                1200: { items: 4 },
                1400: { items: 5 },
            }
        });
    }

    if ($(".testimonial-slider-s2").length) {
        $('.testimonial-slider-s2').owlCarousel({
            loop: true,
            nav: true,
            dots: false,
            items: 2,
            autoplay: true,
            smartSpeed: 300,
            margin: 20,
            responsive: {
                0: { dots: true },
                991: { dots: true },
            }
        });
    }

    if ($(".testimonial-slider-s3").length) {
        $('.testimonial-slider-s3').owlCarousel({
            loop: true,
            nav: true,
            dots: false,
            items: 2,
            autoplay: true,
            smartSpeed: 300,
            margin: 20,
            responsive: {
                0: { dots: true, items: 1, margin: 0 },
                991: { dots: true },
            }
        });
    }

    if ($(".testimonial-slider-s4").length) {
        $('.testimonial-slider-s4').owlCarousel({
            loop: true,
            nav: true,
            dots: false,
            items: 1,
            autoplay: true,
            smartSpeed: 300,
            responsive: {
                0: { dots: true, items: 1, margin: 0 },
                991: { dots: true },
            }
        });
    }

    if ($(".testimonial-slider-s5").length) {
        $('.testimonial-slider-s5').owlCarousel({
            loop: true,
            nav: true,
            dots: false,
            items: 1,
            autoplay: true,
            smartSpeed: 300,
            responsive: {
                0: { dots: true, items: 1, margin: 0 },
                991: { dots: true, items: 1 },
            }
        });
    }


    $(document).ready(function () {

        // Replace repeated selectors with const
        const $heroSlider = $('.hero-slider-s12');
        const $partnersSlider = $('.partners-slider');

        // Hero Slider
        if ($heroSlider.length) {
            $heroSlider.slick({
                infinite: true,
                autoplay: true,
                arrows: false,
                dots: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true
            });
        }

        // Partners Slider
        if ($partnersSlider.length) {
            $partnersSlider.slick({
                infinite: true,
                autoplay: true,
                arrows: false,
                dots: false,
                slidesToShow: 5,
                slidesToScroll: 1,
                responsive: [
                    { breakpoint: 1199, settings: { slidesToShow: 4 } },
                    { breakpoint: 991, settings: { slidesToShow: 3 } },
                    { breakpoint: 757, settings: { slidesToShow: 2 } },
                    { breakpoint: 575, settings: { slidesToShow: 1 } }
                ]
            });
        }
    });

    /*------------------------------------------
       = BACK TO TOP BTN SETTING
   -------------------------------------------*/
    $("body").append("<a href='#' class='back-to-top'><i class='ti-arrow-up'></i></a>");

    function toggleBackToTopBtn() {
        const amountScrolled = 1000;
        if ($(window).scrollTop() > amountScrolled) {
            $("a.back-to-top").fadeIn("slow");
        } else {
            $("a.back-to-top").fadeOut("slow");
        }
    }

    $(".back-to-top").on("click", function () {
        $("html,body").animate({
            scrollTop: 0
        }, 700);
        return false;
    })


    /*==========================================================================
        ON SCROLL
    ==========================================================================*/
    let scrollTimeout;
    $(window).on("scroll", () => {
        if ($(".wpo-site-header").length) {
            stickyMenu($('.wpo-site-header .navigation'), "sticky-on");
        }

        // Throttle: Prevent too many calls to toggleBackToTopBtn
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                toggleBackToTopBtn();
                scrollTimeout = null;
            }, 100); // adjust delay if needed
        }
    });


    /*==========================================================================
        ON RESIZE
    ==========================================================================*/
    let resizeTimer;
    $(window).on("resize", () => {
        toggleClassForSmallNav(); // Immediate application

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            smallNavFunctionality(); // Debounced application
        }, 200);
    });


    /*==========================================================================
        HERO PROJECT SLIDER
    ==========================================================================*/
    function initHeroProjectSlider() {
        const $heroProject = $('.hero-project');
        if ($heroProject.length) {
            $heroProject.slick({
                infinite: true,
                autoplay: true,
                arrows: false,
                dots: false,
                autoplaySpeed: 1500,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                    { breakpoint: 1399, settings: { slidesToShow: 2 } },
                    { breakpoint: 991, settings: { slidesToShow: 2 } },
                    { breakpoint: 757, settings: { slidesToShow: 1 } }
                ]
            });
        }
    }


    /*==========================================================================
        HERO PROJECT STYLE 2 (LEFT/RIGHT)
    ==========================================================================*/
    if ($(".hero-project-s2").length) {
        $('.left-slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            autoplay: true,
            autoplaySpeed: 2000,
            asNavFor: '.right-slider'
        });

        $('.right-slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.left-slider',
            dots: false,
            arrows: false,
            focusOnSelect: true,
            vertical: true,
            verticalSwiping: true,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 2000,
            responsive: [
                { breakpoint: 1599, settings: { slidesToShow: 2 } },
                { breakpoint: 400, settings: { slidesToShow: 2 } }
            ]
        });
    }


    /*==========================================================================
        HERO RIGHT SLIDER
    ==========================================================================*/
    function initHeroRightSlider() {
        if ($(".heroRight").length) {
            $('.hero-single-slider').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                autoplay: false,
                autoplaySpeed: 3000,
                asNavFor: '.hero-multiple-slider'
            });

            $('.hero-multiple-slider').slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                asNavFor: '.hero-single-slider',
                dots: false,
                arrows: false,
                focusOnSelect: true,
                vertical: true,
                verticalSwiping: true,
                infinite: true,
                autoplay: false,
                autoplaySpeed: 3000,
                responsive: [
                    { breakpoint: 1599, settings: { slidesToShow: 3 } },
                    {
                        breakpoint: 1199,
                        settings: { vertical: false, verticalSwiping: false }
                    },
                    {
                        breakpoint: 575,
                        settings: { slidesToShow: 2, vertical: false, verticalSwiping: false }
                    }
                ]
            });
        }
    }


    /*==========================================================================
        POST SLIDER
    ==========================================================================*/
    if ($(".post-slider").length) {
        $(".post-slider").owlCarousel({
            mouseDrag: false,
            smartSpeed: 500,
            margin: 30,
            loop: true,
            nav: true,
            navText: [
                '<i class="fi ti-angle-left"></i>',
                '<i class="fi ti-angle-right"></i>'
            ],
            dots: false,
            items: 1
        });
    }


    /*------------------------------------------
    = CONTACT FORM SUBMISSION
-------------------------------------------*/
    if ($("#consultancy-form, #contact-form").length) {
        $("#consultancy-form, #contact-form").validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                email: {
                    required: true,
                    email: true
                },
                address: {
                    required: true
                },
                service: {
                    required: true
                },
                note: {
                    required: true
                }
            },
            messages: {
                name: "Please enter your name.",
                email: {
                    required: "Please enter your email address.",
                    email: "Please enter a valid email address."
                },
                address: "Please enter your address.",
                service: "Please select your contact service.",
                note: "Please enter your message or note."
            },
            submitHandler: function (form) {
                $.ajax({
                    type: "POST",
                    url: "mail-contact.php",
                    data: $(form).serialize(),
                    beforeSend: function () {
                        $("#loader").show();
                    },
                    success: function (response) {
                        $("#loader").hide();
                        if (response.status === 'success') {
                            $("#success").slideDown("slow");
                            setTimeout(function () {
                                $("#success").slideUp("slow");
                            }, 3000);
                            form.reset();
                        } else {
                            $("#error").text(response.message).slideDown("slow");
                            setTimeout(function () {
                                $("#error").slideUp("slow");
                            }, 3000);
                        }
                    },
                    error: function (xhr) {
                        $("#loader").hide();
                        $("#error").text("Server error. Please try again later.").slideDown("slow");
                        setTimeout(function () {
                            $("#error").slideUp("slow");
                        }, 3000);
                    }
                });
                return false;
            }
        });
    }

    /*==========================================================================
        ON WINDOW LOAD
    ==========================================================================*/
    $(window).on('load', () => {
        preloader();
        initHeroRightSlider();
        initHeroProjectSlider();
        sortingGallery();
        toggleMobileNavigation();
        smallNavFunctionality();
    });



})(window.jQuery);

/*------------------------------------------
    Swiper - Top Scroll
------------------------------------------*/
const swiperTop = new Swiper('.swiper--top', {
    spaceBetween: 0,
    centeredSlides: true,
    speed: 9000,
    autoplay: {
        delay: 1,
    },
    loop: true,
    slidesPerView: 'auto',
    allowTouchMove: false,
    disableOnInteraction: true
});


/*------------------------------------------
    DOMContentLoaded: All Init
------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {

    /* Hero Slider S4 */
    const heroSliderS4 = new Swiper('.hero-slider-s4', {
        spaceBetween: 30,
        slidesPerView: 'auto',
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });

    /* Project Slider S7 */
    const projectSliderS7 = new Swiper('.project-slider-s7', {
        spaceBetween: 30,
        slidesPerView: 'auto',
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });

    /* Password Show/Hide */
    const passwordToggles = document.querySelectorAll('.reveal');
    passwordToggles.forEach(button => {
        button.addEventListener('click', () => {
            const passwordField = button.parentNode.previousElementSibling;
            if (passwordField && passwordField.type === 'password') {
                passwordField.type = 'text';
            } else if (passwordField) {
                passwordField.type = 'password';
            }
        });
    });

    /* Cursor Effects */
    const cursor = document.querySelector('.cursor');
    const cursorInner = document.querySelector('.cursor2');
    const links = document.querySelectorAll('a');

    if (cursor && cursorInner) {
        document.addEventListener('mousemove', e => {
            const { clientX: x, clientY: y } = e;
            cursor.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
            cursorInner.style.left = `${x}px`;
            cursorInner.style.top = `${y}px`;
        });

        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
            cursorInner.classList.add('cursorinnerhover');
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
            cursorInner.classList.remove('cursorinnerhover');
        });

        links.forEach(link => {
            link.addEventListener('mouseover', () => {
                cursor.classList.add('hover');
            });
            link.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
});
