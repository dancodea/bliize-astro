// src/scripts/main.js
// Orchestrates all UI interactions, animations, and sliders with Astro View Transitions / ClientRouter lifecycle

export function initAll() {
  initRollingText();
  initMobileNav();
  initStickyHeader();
  initHeaderPopups();
  initBackToTop();
  initCursor();
  initPreloader();
  initSwiperSliders();
  initOwlSliders();
  initSlickSliders();
  initGSAPAnimations();
  initFancyboxAndPopups();
  initIsotopeGallery();
  initOdometer();
  initTogglesAndForms();
}

export function cleanupBeforeSwap() {
  if (window.ScrollTrigger) {
    window.ScrollTrigger.getAll().forEach(t => t.kill());
  }
}

/**
 * 1. Rolling Text Animation
 */
function initRollingText() {
  const elements = document.querySelectorAll(".rolling-text");
  elements.forEach((element) => {
    // Avoid duplicate re-wrapping
    const firstBlock = element.querySelector(".block");
    let text = "";
    if (firstBlock) {
      text = firstBlock.textContent || "";
    } else {
      text = element.textContent || "";
    }
    text = text.trim();
    if (!text) return;

    element.innerHTML = "";

    const textContainer = document.createElement("div");
    textContainer.classList.add("block");

    for (const letter of text) {
      const span = document.createElement("span");
      span.innerText = letter === " " ? "\xa0" : letter;
      span.classList.add("letter");
      textContainer.appendChild(span);
    }

    element.appendChild(textContainer);
    element.appendChild(textContainer.cloneNode(true));

    element.addEventListener("mouseover", () => {
      element.classList.remove("play");
    });
  });
}

/**
 * 2. Mobile Navigation
 */
function initMobileNav() {
  const $ = window.jQuery;
  if (!$) return;

  const $navigationHolder = $(".navigation-holder");
  const $mobileMenuOpenBtn = $(".mobail-menu .open-btn");
  const $mobileMenuToggleBtn = $(".mobail-menu .navbar-toggler");
  const $mainNavUl = $("#navbar > ul");
  const $menuCloseBtns = $(".menu-close");

  $mobileMenuOpenBtn.off("click").on("click", (e) => {
    e.stopImmediatePropagation();
    $navigationHolder.toggleClass("slideInn");
    $mobileMenuToggleBtn.toggleClass("x-close");
    return false;
  });

  function toggleClassForSmallNav() {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 991) {
      $mainNavUl.addClass("small-nav");
    } else {
      $mainNavUl.removeClass("small-nav");
    }
  }

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

  function closeNavigation() {
    $navigationHolder.removeClass("slideInn");
    $mobileMenuToggleBtn.removeClass("x-close");
  }

  toggleClassForSmallNav();
  smallNavFunctionality();

  $(window).off("resize.nav").on("resize.nav", () => {
    toggleClassForSmallNav();
    smallNavFunctionality();
  });

  $("body").off("click.navClose").on("click.navClose", closeNavigation);
  $menuCloseBtns.off("click").on("click", closeNavigation);
}

/**
 * 3. Sticky Header
 */
function initStickyHeader() {
  const $ = window.jQuery;
  if (!$) return;

  let lastScrollTop = 0;
  $(window).off("scroll.sticky").on("scroll.sticky", () => {
    const $targetMenu = $(".wpo-site-header .navigation");
    if (!$targetMenu.length) return;

    const st = $(window).scrollTop();
    if (st > 200) {
      if (st > lastScrollTop && st > 500) {
        $targetMenu.removeClass("sticky-on");
      } else {
        $targetMenu.addClass("sticky-on");
      }
    } else {
      $targetMenu.removeClass("sticky-on");
    }
    lastScrollTop = st;
  });
}

/**
 * 4. Header Popups (Search, User, Cart)
 */
function initHeaderPopups() {
  const $ = window.jQuery;
  if (!$) return;

  // Search Toggle
  if ($(".header-search-form-wrapper").length) {
    const searchToggleBtn = $(".search-toggle-btn");
    const searchToggleBtnIcon = $(".search-toggle-btn i");
    const searchContent = $(".header-search-form");

    searchToggleBtn.off("click").on("click", function (e) {
      searchContent.toggleClass("header-search-content-toggle");
      searchToggleBtnIcon.toggleClass("fi flaticon-loupe fi ti-close");
      e.stopPropagation();
    });

    $("body").off("click.search").on("click.search", function () {
      searchContent.removeClass("header-search-content-toggle");
    }).find(searchContent).off("click").on("click", function (e) {
      e.stopPropagation();
    });
  }

  // User Toggle
  if ($(".header-user-wrapper").length) {
    const userToggleBtn = $(".user-toggle-btn");
    const userContent = $(".header-user-form");

    userToggleBtn.off("click").on("click", function (e) {
      userContent.toggleClass("header-user-content-toggle");
      e.stopPropagation();
    });

    $("body").off("click.user").on("click.user", function () {
      userContent.removeClass("header-user-content-toggle");
    }).find(userContent).off("click").on("click", function (e) {
      e.stopPropagation();
    });
  }

  // Mini Cart Toggle
  if ($(".mini-cart").length) {
    const cartToggleBtn = $(".cart-toggle-btn");
    const cartContent = $(".mini-cart-content");
    const cartCloseBtn = $(".mini-cart-close");

    cartToggleBtn.off("click").on("click", function (e) {
      cartContent.toggleClass("mini-cart-content-toggle");
      e.stopPropagation();
    });

    cartCloseBtn.off("click").on("click", function (e) {
      cartContent.removeClass("mini-cart-content-toggle");
      e.stopPropagation();
    });

    $("body").off("click.cart").on("click.cart", function () {
      cartContent.removeClass("mini-cart-content-toggle");
    }).find(cartContent).off("click").on("click", function (e) {
      e.stopPropagation();
    });
  }
}

/**
 * 5. Back to Top Button
 */
function initBackToTop() {
  const $ = window.jQuery;
  if (!$) return;

  const $btn = $(".back-to-top");
  if (!$btn.length) return;

  $(window).off("scroll.backtop").on("scroll.backtop", () => {
    if ($(window).scrollTop() > 300) {
      $btn.fadeIn("slow");
    } else {
      $btn.fadeOut("slow");
    }
  });

  $btn.off("click").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 700);
    return false;
  });
}

/**
 * 6. Custom Cursor
 */
function initCursor() {
  const cursor = document.querySelector(".cursor");
  const cursorInner = document.querySelector(".cursor2");
  if (!cursor || !cursorInner) return;

  document.addEventListener("mousemove", (e) => {
    const { clientX: x, clientY: y } = e;
    cursor.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
    cursorInner.style.left = `${x}px`;
    cursorInner.style.top = `${y}px`;
  });

  document.addEventListener("mousedown", () => {
    cursor.classList.add("click");
    cursorInner.classList.add("cursorinnerhover");
  });

  document.addEventListener("mouseup", () => {
    cursor.classList.remove("click");
    cursorInner.classList.remove("cursorinnerhover");
  });

  document.querySelectorAll("a, button, input[type='submit']").forEach((link) => {
    link.addEventListener("mouseover", () => {
      cursor.classList.add("hover");
    });
    link.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
    });
  });
}

/**
 * 7. Preloader
 */
function initPreloader() {
  const $ = window.jQuery;
  if (!$) return;

  const $preloader = $(".preloader");
  if ($preloader.length) {
    $preloader.delay(100).fadeOut(500, function () {
      if (window.WOW) {
        new window.WOW().init();
      }
    });
  }
}

/**
 * 8. Swiper Sliders
 */
function initSwiperSliders() {
  if (typeof window.Swiper === "undefined") return;

  // Hero Slider with parallax & fraction
  if (document.querySelector(".swiper-container")) {
    const interleaveOffset = 0.5;
    const heroSwiper = new window.Swiper(".swiper-container", {
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
            const innerEl = swiper.slides[i].querySelector(".slide-inner");
            if (innerEl) {
              innerEl.style.transform = "translate3d(" + innerTranslate + "px, 0, 0)";
            }
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
            const innerEl = swiper.slides[i].querySelector(".slide-inner");
            if (innerEl) innerEl.style.transition = speed + "ms";
          }
        },
        slideChange: function () {
          const currentElement = document.querySelector(".swiper-pagination-current");
          const totalElement = document.querySelector(".swiper-pagination-total");
          if (currentElement) {
            currentElement.textContent = String(this.realIndex + 1).padStart(2, "0");
          }
          if (totalElement) {
            totalElement.textContent = String(this.slides.length - 2).padStart(2, "0");
          }
        },
      },
    });

    // Set background images
    document.querySelectorAll(".slide-bg-image").forEach((el) => {
      const bg = el.getAttribute("data-background");
      if (bg) el.style.backgroundImage = `url(${bg})`;
    });
  }

  // Top Continuous Marquee Swiper
  if (document.querySelector(".swiper--top")) {
    new window.Swiper(".swiper--top", {
      spaceBetween: 0,
      centeredSlides: true,
      speed: 9000,
      autoplay: { delay: 1 },
      loop: true,
      slidesPerView: "auto",
      allowTouchMove: false,
      disableOnInteraction: true,
    });
  }

  // Hero Slider S4
  if (document.querySelector(".hero-slider-s4")) {
    new window.Swiper(".hero-slider-s4", {
      spaceBetween: 30,
      slidesPerView: "auto",
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: { delay: 3000, disableOnInteraction: false },
    });
  }

  // Project Slider S7
  if (document.querySelector(".project-slider-s7")) {
    new window.Swiper(".project-slider-s7", {
      spaceBetween: 30,
      slidesPerView: "auto",
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: { delay: 3000, disableOnInteraction: false },
    });
  }
}

/**
 * 9. OwlCarousel Sliders
 */
function initOwlSliders() {
  const $ = window.jQuery;
  if (!$ || !$.fn.owlCarousel) return;

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
      },
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
      items: 4,
    });
  }

  if ($(".testimonial-slider").length) {
    $(".testimonial-slider").owlCarousel({
      loop: true,
      nav: true,
      dots: false,
      items: 1,
      autoplay: true,
      smartSpeed: 300,
      responsive: {
        0: { dots: true },
        991: { dots: true },
      },
    });
  }

  if ($(".testimonial-slider-s2").length) {
    $(".testimonial-slider-s2").owlCarousel({
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
      },
    });
  }

  if ($(".testimonial-slider-s3").length) {
    $(".testimonial-slider-s3").owlCarousel({
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
      },
    });
  }

  if ($(".testimonial-slider-s4").length) {
    $(".testimonial-slider-s4").owlCarousel({
      loop: true,
      nav: true,
      dots: false,
      items: 1,
      autoplay: true,
      smartSpeed: 300,
      responsive: {
        0: { dots: true, items: 1, margin: 0 },
        991: { dots: true },
      },
    });
  }

  if ($(".testimonial-slider-s5").length) {
    $(".testimonial-slider-s5").owlCarousel({
      loop: true,
      nav: true,
      dots: false,
      items: 1,
      autoplay: true,
      smartSpeed: 300,
      responsive: {
        0: { dots: true, items: 1, margin: 0 },
        991: { dots: true, items: 1 },
      },
    });
  }

  if ($(".inner-slider").length) {
    $(".inner-slider").owlCarousel({
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
      },
    });
  }

  if ($(".post-slider").length) {
    $(".post-slider").owlCarousel({
      mouseDrag: false,
      smartSpeed: 500,
      margin: 30,
      loop: true,
      nav: true,
      navText: ['<i class="fi ti-angle-left"></i>', '<i class="fi ti-angle-right"></i>'],
      dots: false,
      items: 1,
    });
  }
}

/**
 * 10. Slick Sliders
 */
function initSlickSliders() {
  const $ = window.jQuery;
  if (!$ || !$.fn.slick) return;

  if ($(".hero-slider-s12").length) {
    $(".hero-slider-s12").slick({
      infinite: true,
      autoplay: true,
      arrows: false,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
    });
  }

  if ($(".partners-slider").length) {
    $(".partners-slider").slick({
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
        { breakpoint: 575, settings: { slidesToShow: 1 } },
      ],
    });
  }

  if ($(".hero-project").length) {
    $(".hero-project").slick({
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
        { breakpoint: 757, settings: { slidesToShow: 1 } },
      ],
    });
  }

  if ($(".hero-project-s2").length) {
    $(".left-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      autoplay: true,
      autoplaySpeed: 2000,
      asNavFor: ".right-slider",
    });

    $(".right-slider").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: ".left-slider",
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
        { breakpoint: 400, settings: { slidesToShow: 2 } },
      ],
    });
  }

  if ($(".heroRight").length) {
    $(".hero-single-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      autoplay: false,
      autoplaySpeed: 3000,
      asNavFor: ".hero-multiple-slider",
    });

    $(".hero-multiple-slider").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: ".hero-single-slider",
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
        { breakpoint: 1199, settings: { vertical: false, verticalSwiping: false } },
        { breakpoint: 575, settings: { slidesToShow: 2, vertical: false, verticalSwiping: false } },
      ],
    });
  }
}

/**
 * 11. GSAP Animations (ScrollTrigger, SplitText, fade_bottom, poort-text, etc.)
 */
function initGSAPAnimations() {
  const gsap = window.gsap;
  if (!gsap) return;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }
  if (window.SplitText) {
    gsap.registerPlugin(window.SplitText);
  }

  // SplitText lines
  if (window.SplitText && window.ScrollTrigger) {
    const splitTextLines = gsap.utils.toArray(".splittext-line");
    splitTextLines.forEach((splitTextLine) => {
      if (splitTextLine.split) {
        try { splitTextLine.split.revert(); } catch (e) {}
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      });

      const itemSplitted = new window.SplitText(splitTextLine, { type: "lines" });
      splitTextLine.split = itemSplitted;
      gsap.set(splitTextLine, { perspective: 400 });

      tl.from(itemSplitted.lines, {
        duration: 0.8,
        opacity: 0,
        rotationX: -60,
        force3D: true,
        transformOrigin: "top center -50",
        stagger: 0.1,
      });
    });
  }

  // Poort Text
  if (window.SplitText && window.ScrollTrigger && window.jQuery) {
    const poortTexts = window.jQuery(".poort-text");
    if (poortTexts.length > 0) {
      poortTexts.each((_, el) => {
        if (el.split) {
          try { el.split.revert(); } catch (e) {}
        }
        const $el = window.jQuery(el);
        const cleanText = $el.text().replace(/\s+/g, " ").trim();
        if (cleanText) {
          $el.empty().text(cleanText);
        }

        el.split = new window.SplitText(el, { type: "lines,words,chars", linesClass: "poort-line" });
        gsap.set(el, { perspective: 600 });

        if ($el.hasClass("poort-in-right")) {
          gsap.set(el.split.chars, { opacity: 0, x: 80, ease: "back.out(1.7)" });
        } else if ($el.hasClass("poort-in-left")) {
          gsap.set(el.split.chars, { opacity: 0, x: -80, ease: "circ.out" });
        } else if ($el.hasClass("poort-in-up")) {
          gsap.set(el.split.chars, { opacity: 0, y: 60, ease: "circ.out" });
        } else if ($el.hasClass("poort-in-down")) {
          gsap.set(el.split.chars, { opacity: 0, y: -60, ease: "circ.out" });
        } else {
          gsap.set(el.split.chars, { opacity: 0, x: 80, ease: "back.out(1.7)" });
        }

        gsap.to(el.split.chars, {
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
          },
          x: 0,
          y: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.02,
        });
      });
    }
  }

  // Fade Bottom
  if (document.querySelectorAll(".fade_bottom").length && window.ScrollTrigger) {
    const fadeArray = gsap.utils.toArray(".fade_bottom");
    fadeArray.forEach((item) => {
      gsap.set(item, { y: 30, opacity: 0 });
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none none",
        },
        y: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 0.8,
      });
    });
  }

  // Image Scroll Reveal Animation
  if (window.ScrollTrigger) {
    const newImgElements = document.querySelectorAll(".new_img-animet");
    newImgElements.forEach((el) => {
      const image = el.querySelector("img");
      if (!image) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 50%",
        },
      });

      tl.set(el, { autoAlpha: 1 });
      tl.from(el, {
        duration: 1.5,
        xPercent: -100,
        ease: "power2.out",
      });
      tl.from(image, {
        duration: 1.5,
        xPercent: 100,
        scale: 1.3,
        delay: -1.5,
        ease: "power2.out",
      });
    });
  }

  // Button move parallax
  if (window.jQuery) {
    const allBtns = gsap.utils.toArray(".btn-wrapper");
    const allBtnCircles = gsap.utils.toArray(".btn-move");

    allBtns.forEach((btn, i) => {
      const $btn = window.jQuery(btn);
      let throttledMove = false;
      $btn.on("mousemove", (e) => {
        if (!throttledMove) {
          const relX = e.pageX - $btn.offset().left;
          const relY = e.pageY - $btn.offset().top;
          if (allBtnCircles[i]) {
            gsap.to(allBtnCircles[i], {
              duration: 0.5,
              x: ((relX - $btn.width() / 2) / $btn.width()) * 80,
              y: ((relY - $btn.height() / 2) / $btn.height()) * 80,
              ease: "power2.out",
            });
          }
          throttledMove = true;
          setTimeout(() => { throttledMove = false; }, 16);
        }
      });

      $btn.on("mouseleave", () => {
        if (allBtnCircles[i]) {
          gsap.to(allBtnCircles[i], {
            duration: 0.5,
            x: 0,
            y: 0,
            ease: "power2.out",
          });
        }
      });
    });
  }
}

/**
 * 12. Fancybox & Magnific Popup
 */
function initFancyboxAndPopups() {
  const $ = window.jQuery;
  if (!$) return;

  if ($.fn.fancybox && $(".fancybox").length) {
    $(".fancybox").fancybox({
      openEffect: "elastic",
      closeEffect: "elastic",
      wrapCSS: "project-fancybox-title-style",
    });
  }

  if ($.fn.fancybox && $(".video-btn").length) {
    $(".video-btn").off("click").on("click", function (e) {
      e.preventDefault();
      $.fancybox({
        href: this.href,
        type: $(this).data("type") || "iframe",
        title: this.title,
        helpers: {
          title: { type: "inside" },
          media: {},
        },
        beforeShow: function () {
          $(".fancybox-wrap").addClass("gallery-fancybox");
        },
      });
      return false;
    });
  }

  if ($.fn.magnificPopup && $(".popup-gallery").length) {
    $(".popup-gallery").magnificPopup({
      delegate: "a",
      type: "image",
      gallery: { enabled: true },
      zoom: {
        enabled: true,
        duration: 300,
        easing: "ease-in-out",
        opener: function (openerElement) {
          return openerElement.is("img") ? openerElement : openerElement.find("img");
        },
      },
    });
  }
}

/**
 * 13. Isotope Gallery Filtering
 */
function initIsotopeGallery() {
  const $ = window.jQuery;
  if (!$ || !$.fn.isotope) return;

  if ($(".sortable-gallery .gallery-filters").length) {
    const $container = $(".gallery-container");
    $container.isotope({
      filter: "*",
      animationOptions: {
        duration: 750,
        easing: "linear",
        queue: false,
      },
    });

    $(".gallery-filters li a").off("click").on("click", function (e) {
      e.preventDefault();
      $(".gallery-filters li .current").removeClass("current");
      $(this).addClass("current");
      const selector = $(this).attr("data-filter");
      $container.isotope({
        filter: selector,
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });
      return false;
    });
  }
}

/**
 * 14. Odometer Counters
 */
function initOdometer() {
  const $ = window.jQuery;
  if (!$ || !$(".odometer").length) return;

  if ($.fn.appear) {
    $(".odometer").appear();
    $(document.body).off("appear.odometer").on("appear.odometer", ".odometer", function () {
      $(".odometer").each(function () {
        const countNumber = $(this).attr("data-count");
        $(this).html(countNumber);
      });
    });
  } else {
    $(".odometer").each(function () {
      const countNumber = $(this).attr("data-count");
      $(this).html(countNumber);
    });
  }
}

/**
 * 15. Toggles, Accordions & Forms
 */
function initTogglesAndForms() {
  const $ = window.jQuery;
  if (!$) return;

  $("#toggle1").off("click").on("click", () => {
    $(".create-account").slideToggle();
    $(".caupon-wrap.s1").toggleClass("active-border");
  });

  $("#toggle2").off("click").on("click", () => {
    $("#open2").slideToggle();
    $(".caupon-wrap.s2").toggleClass("coupon-2");
  });

  $("#toggle3").off("click").on("click", () => {
    $("#open3").slideToggle();
    $(".caupon-wrap.s2").toggleClass("coupon-2");
  });

  $("#toggle4").off("click").on("click", () => {
    $("#open4").slideToggle();
    $(".caupon-wrap.s3").toggleClass("coupon-2");
  });

  $(".payment-select .addToggle").off("click").on("click", () => {
    $(".payment-name").addClass("active");
    $(".payment-option").removeClass("active");
  });

  $(".payment-select .removeToggle").off("click").on("click", () => {
    $(".payment-option").addClass("active");
    $(".payment-name").removeClass("active");
  });

  // Password reveal toggle
  document.querySelectorAll(".reveal").forEach((button) => {
    button.addEventListener("click", () => {
      const passwordField = button.parentNode?.previousElementSibling;
      if (passwordField && passwordField.type === "password") {
        passwordField.type = "text";
      } else if (passwordField) {
        passwordField.type = "password";
      }
    });
  });

  // Service thumb tabs
  if ($(".service-thumbs").length) {
    $(".service-thumb").off("click").on("click", function (e) {
      e.preventDefault();
      const target = $($(this).attr("data-case"));
      $(".service-thumb").removeClass("active-thumb");
      $(this).addClass("active-thumb");
      $(".service-data").fadeOut(300).removeClass("active-service-data");
      target.fadeIn(300).addClass("active-service-data");
    });
  }
}
