/*----------------------------------------
    Text Animation
-----------------------------------------*/
(() => {
  const elements = document.querySelectorAll(".rolling-text");

  elements.forEach((element) => {
    const innerText = element.innerText;
    element.innerHTML = "";

    const textContainer = document.createElement("div");
    textContainer.classList.add("block");

    for (const letter of innerText) {
      const span = document.createElement("span");
      span.innerText = letter.trim() === "" ? "\xa0" : letter;
      span.classList.add("letter");
      textContainer.appendChild(span);
    }

    element.appendChild(textContainer);
    element.appendChild(textContainer.cloneNode(true));
  });

  elements.forEach((element) => {
    element.addEventListener("mouseover", () => {
      element.classList.remove("play");
    });
  });
})();

/*----------------------------------------
    SplitText Animation on Scroll
-----------------------------------------*/
$(function () {
  const splitTextLines = gsap.utils.toArray(".splittext-line");
  splitTextLines.forEach((splitTextLine) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: splitTextLine,
        start: "top 90%",
        duration: 2,
        end: "bottom 60%",
        scrub: false,
        markers: false,
        toggleActions: "play none none none",
      },
    });

    const itemSplitted = new SplitText(splitTextLine, { type: "lines" });
    gsap.set(splitTextLine, { perspective: 400 });
    itemSplitted.split({ type: "lines" });

    tl.from(itemSplitted.lines, {
      duration: 1,
      delay: 0.5,
      opacity: 0,
      rotationX: -80,
      force3D: true,
      transformOrigin: "top center -50",
      stagger: 0.1,
    });
  });
});

/*----------------------------------------
    Poort Text Animation
-----------------------------------------*/
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
$(document).ready(() => {
  const poortTexts = $(".poort-text");
  if (poortTexts.length === 0) return;

  gsap.registerPlugin(SplitText);

  poortTexts.each((_, el) => {
    el.split = new SplitText(el, { type: "lines,words,chars", linesClass: "poort-line" });
    gsap.set(el, { perspective: 600 });

    if ($(el).hasClass("poort-in-right")) {
      gsap.set(el.split.chars, { opacity: 0, x: 100, ease: "back.out(1.7)" });
    }
    if ($(el).hasClass("poort-in-left")) {
      gsap.set(el.split.chars, { opacity: 0, x: -100, ease: "circ.out" });
    }
    if ($(el).hasClass("poort-in-up")) {
      gsap.set(el.split.chars, { opacity: 0, y: 80, ease: "circ.out" });
    }
    if ($(el).hasClass("poort-in-down")) {
      gsap.set(el.split.chars, { opacity: 0, y: -80, ease: "circ.out" });
    }

    el.anim = gsap.to(el.split.chars, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
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
});

/*----------------------------------------
    Scroll Text Animation Utility
-----------------------------------------*/
function scrollAnimations() {
  const defaults = {
    duration: 1.2,
    ease: "power4.out",
    animation: "fade_from_bottom",
    once: false,
  };

  gsap.utils.toArray(".scroll-text-animation").forEach((box) => {
    const gsapObj = {};
    const settings = {
      duration: box.dataset.animationDuration || defaults.duration,
    };

    const animations = {
      fade_from_bottom: { y: 180, opacity: 0 },
      fade_from_top: { y: -180, opacity: 0 },
      fade_from_left: { x: -180, opacity: 0 },
      fade_from_right: { x: 180, opacity: 0 },
      fade_in: { opacity: 0 },
      rotate_up: { y: 180, rotation: 10, opacity: 0 },
    };

    const scrollTrigger = {
      scrollTrigger: {
        trigger: box,
        once: defaults.once,
        start: "top bottom+=20%",
        toggleActions: "play none none reverse",
        markers: false,
      },
    };

    Object.assign(gsapObj, settings, animations[box.dataset.animation || defaults.animation], scrollTrigger);
    gsap.from(box, gsapObj);
  });
}
scrollAnimations();

/*----------------------------------------
    Fade Bottom Animation based on Device Width
-----------------------------------------*/
const deviceWidth = window.innerWidth;

gsap.set(".fade_bottom", { y: 30, opacity: 0 });

if (deviceWidth < 1023) {
  const fadeArray = gsap.utils.toArray(".fade_bottom");
  fadeArray.forEach((item) => {
    const fadeTl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top center+=200",
      },
    });
    fadeTl.to(item, {
      y: 0,
      opacity: 1,
      ease: "power2.out",
      duration: 1.5,
    });
  });
} else {
  gsap.to(".fade_bottom", {
    scrollTrigger: {
      trigger: ".fade_bottom",
      start: "top center+=300",
      markers: false,
    },
    y: 0,
    opacity: 1,
    ease: "power2.out",
    duration: 1,
    stagger: { each: 0.2 },
  });
}

/*----------------------------------------
    Image Scroll Animation
-----------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
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
    tl.from(
      image,
      {
        duration: 1.5,
        xPercent: 100,
        scale: 1.3,
        delay: -1.5,
        ease: "power2.out",
      }
    );
  });
});

/*----------------------------------------
    HoverButton Class with Debounce and Throttle
-----------------------------------------*/
class HoverButton {
  constructor(el) {
    this.el = el;
    this.hover = false;
    this.calculatePosition();

    window.addEventListener("resize", this.debounce(() => this.calculatePosition(), 200));
    window.addEventListener("mousemove", this.throttle((e) => this.onMouseMove(e), 16));
  }

  calculatePosition() {
    gsap.set(this.el, { x: 0, y: 0, scale: 1 });
    const box = this.el.getBoundingClientRect();
    this.x = box.left + box.width / 2;
    this.y = box.top + box.height / 2;
    this.width = box.width;
    this.height = box.height;
  }

  onMouseMove(e) {
    let hover = false;
    const hoverArea = this.hover ? 0.7 : 0.5;
    const x = e.clientX - this.x;
    const y = e.clientY - this.y;
    const distance = Math.sqrt(x * x + y * y);

    if (distance < this.width * hoverArea) {
      hover = true;
      if (!this.hover) this.hover = true;
      this.onHover(e.clientX, e.clientY);
    }

    if (!hover && this.hover) {
      this.onLeave();
      this.hover = false;
    }
  }

  onHover(x, y) {
    gsap.to(this.el, {
      x: (x - this.x) * 0.4,
      y: (y - this.y) * 0.4,
      scale: 1.15,
      ease: "power2.out",
      duration: 0.4,
    });
    this.el.style.zIndex = "10";
  }

  onLeave() {
    gsap.to(this.el, {
      x: 0,
      y: 0,
      scale: 1,
      ease: "elastic.out(1.2, 0.4)",
      duration: 0.7,
    });
    this.el.style.zIndex = "1";
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

/*----------------------------------------
    btn-move Parallax Effect
-----------------------------------------*/
const allBtns = gsap.utils.toArray(".btn-wrapper");
const allBtnCircles = gsap.utils.toArray(".btn-move");

allBtns.forEach((btn, i) => {
  const $btn = $(btn);

  // Throttle mousemove handler for better performance
  let throttledMove = false;
  $btn.on("mousemove", (e) => {
    if (!throttledMove) {
      callParallax(e);
      throttledMove = true;
      setTimeout(() => {
        throttledMove = false;
      }, 16); // ~60fps
    }
  });

  function callParallax(e) {
    parallaxIt(e, allBtnCircles[i], 80);
  }

  function parallaxIt(e, target, movement) {
    const relX = e.pageX - $btn.offset().left;
    const relY = e.pageY - $btn.offset().top;

    gsap.to(target, {
      duration: 0.5,
      x: ((relX - $btn.width() / 2) / $btn.width()) * movement,
      y: ((relY - $btn.height() / 2) / $btn.height()) * movement,
      ease: "power2.out",
    });
  }

  $btn.on("mouseleave", () => {
    gsap.to(allBtnCircles[i], {
      duration: 0.5,
      x: 0,
      y: 0,
      ease: "power2.out",
    });
  });
});
