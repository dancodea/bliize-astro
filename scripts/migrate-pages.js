import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const SOURCE_DIR = '/home/daniel-favour/Documents/project/bliize/bliize';
const TARGET_DIR = '/home/daniel-favour/Documents/project/bliize/bliize-astro/src/pages';

const URL_MAP = {
  'index': '/',
  'bliize-classic-architecture': '/bliize-classic-architecture',
  'bliize-modern-architecture-s2': '/bliize-modern-architecture-s2',
  'bliize-classic-architecture-dark': '/bliize-classic-architecture-dark',
  'bliize-classic-interior-design': '/bliize-classic-interior-design',
  'bliize-classic-interior-design-s2': '/bliize-classic-interior-design-s2',
  'bliize-classic-interior-design-dark': '/bliize-classic-interior-design-dark',
  'bliize-renovation': '/bliize-renovation',
  'bliize-modern-woocommerce': '/bliize-modern-woocommerce',
  'bliize-minimal-woocommerce': '/bliize-minimal-woocommerce',
  'bliize-costruction': '/bliize-costruction',
  'bliize-costruction-s2': '/bliize-costruction-s2',
  'bliize-costruction-profile': '/bliize-costruction-profile',
  'bliize-urban-planning': '/bliize-urban-planning',
  'bliize-frelancer-architect': '/bliize-frelancer-architect',
  'about': '/about',
  'services': '/services',
  'service-single': '/service-single',
  'projects': '/projects',
  'project-single': '/project-single',
  'team': '/team',
  'team-single': '/team-single',
  'pricing': '/pricing',
  'blog': '/blog',
  'blog-left-sidebar': '/blog-left-sidebar',
  'blog-fullwidth': '/blog-fullwidth',
  'blog-single': '/blog-single',
  'blog-single-left-sidebar': '/blog-single-left-sidebar',
  'blog-single-fullwidth': '/blog-single-fullwidth',
  'shop': '/shop',
  'shop-single': '/shop-single',
  'cart': '/cart',
  'wishlist': '/wishlist',
  'checkout': '/checkout',
  'contact': '/contact',
  'login': '/login',
  'register': '/register',
  'forgot': '/forgot',
  'terms': '/terms',
  'privacy': '/privacy',
  '404': '/404'
};

function cleanDom($) {
  // 1. Remove duplicate sticky headers
  $('nav.sticky-header').remove();

  // 2. Remove back to top links
  $('a.back-to-top').remove();

  // 3. Remove preloader from page content if inside body
  $('.preloader').remove();
  $('.cursor, .cursor2').remove();

  // 4. Clean Rolling Text
  $('.rolling-text').each((_, el) => {
    const $el = $(el);
    const firstBlock = $el.find('.block').first();
    let text = firstBlock.length ? firstBlock.text() : $el.text();
    text = text.trim();
    $el.empty().text(text);
  });

  // 5. Clean Odometer
  $('.odometer').each((_, el) => {
    const $el = $(el);
    const count = $el.attr('data-count') || '';
    $el.find('.odometer-inside').remove();
    $el.removeClass('odometer-auto-theme odometer-theme-default');
    $el.text(count);
  });

  // 6. Clean Swiper
  $('.swiper-slide-duplicate').remove();
  $('.swiper-container').removeClass('swiper-container-horizontal swiper-container-initialized');
  $('.swiper-wrapper').removeAttr('style');
  $('.swiper-slide').each((_, el) => {
    const $el = $(el);
    $el.removeClass('swiper-slide-active swiper-slide-prev swiper-slide-next swiper-slide-duplicate-active swiper-slide-duplicate-prev swiper-slide-duplicate-next');
    $el.removeAttr('style');
    $el.find('.slide-inner').removeAttr('style');
    $el.find('.slide-sub-title').removeAttr('style');
  });

  // 7. Clean Slick Sliders
  $('.slick-cloned').remove();
  $('.slick-initialized').each((_, el) => {
    const $slider = $(el);
    $slider.removeClass('slick-initialized slick-slider');
    const $track = $slider.find('.slick-track');
    if ($track.length) {
      const children = $track.children();
      const $list = $slider.find('.slick-list');
      if ($list.length) {
        $list.replaceWith(children);
      } else {
        $track.replaceWith(children);
      }
    }
  });
  $('.slick-slide').removeClass('slick-slide slick-active slick-current').removeAttr('style').removeAttr('tabindex').removeAttr('aria-hidden').removeAttr('aria-live').removeAttr('data-slick-index');

  // 8. Clean Owl Carousel
  $('.owl-item.cloned').remove();
  $('.owl-loaded').each((_, el) => {
    const $owl = $(el);
    $owl.removeClass('owl-loaded owl-drag');
    const $stage = $owl.find('.owl-stage');
    if ($stage.length) {
      const items = $stage.find('.owl-item').children();
      $owl.find('.owl-stage-outer').replaceWith(items);
    }
    $owl.find('.owl-nav, .owl-dots').remove();
  });

  // 9. Clean GSAP fade_bottom, scroll-text-animation, and new_img-animet inline styles
  $('.fade_bottom, .scroll-text-animation, .new_img-animet, [data-animation]').each((_, el) => {
    const $el = $(el);
    const style = $el.attr('style') || '';
    if (style.includes('translate') || style.includes('opacity') || style.includes('transform') || style.includes('scale') || style.includes('rotate')) {
      $el.removeAttr('style');
    }
  });

  // 10. Clean Poort Text (extract pure text, remove nested character divs with opacity:0)
  $('.poort-text').each((_, el) => {
    const $el = $(el);
    const text = $el.text().replace(/\s+/g, ' ').trim();
    $el.empty().text(text);
    $el.removeAttr('style');
  });

  // 11. Clean SplitText Lines (remove residual line transforms and opacities)
  $('.splittext-line').each((_, el) => {
    const $el = $(el);
    $el.removeAttr('style');
    $el.find('div[style]').each((_, div) => {
      const $div = $(div);
      const style = $div.attr('style') || '';
      if (style.includes('translate') || style.includes('opacity') || style.includes('rotate') || style.includes('transform')) {
        $div.removeAttr('style');
      }
    });
  });

  // 12. Remove any remaining poort-line wrappers
  $('.poort-line').each((_, el) => {
    const $el = $(el);
    $el.replaceWith($el.contents());
  });

  // 11. Replace URLs and Asset paths
  $('a[href]').each((_, el) => {
    const $a = $(el);
    const href = $a.attr('href') || '';
    for (const [key, cleanRoute] of Object.entries(URL_MAP)) {
      if (href === `${key}.php` || href === `${key}.html`) {
        $a.attr('href', cleanRoute);
        break;
      }
    }
  });

  $('[src]').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src') || '';
    if (src.startsWith('assets/')) {
      $el.attr('src', `/${src}`);
    }
  });

  $('[href]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';
    if (href.startsWith('assets/')) {
      $el.attr('href', `/${href}`);
    }
  });

  $('[data-background]').each((_, el) => {
    const $el = $(el);
    const bg = $el.attr('data-background') || '';
    if (bg.startsWith('assets/')) {
      $el.attr('data-background', `/${bg}`);
    }
  });

  $('[data-bg-image]').each((_, el) => {
    const $el = $(el);
    const bg = $el.attr('data-bg-image') || '';
    if (bg.startsWith('assets/')) {
      $el.attr('data-bg-image', `/${bg}`);
    }
  });
}

const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} HTML files with Cheerio...`);

for (const file of files) {
  const filePath = path.join(SOURCE_DIR, file);
  const rawHtml = fs.readFileSync(filePath, 'utf-8');
  const baseName = file.replace('.html', '');
  const targetAstroFile = path.join(TARGET_DIR, `${baseName}.astro`);

  const $ = cheerio.load(rawHtml, { decodeEntities: false });

  // Extract title
  const title = $('title').text().trim() || 'Bliize | Architecture Construction Template';

  // Handle Auth Pages
  if (['login', 'register', 'forgot'].includes(baseName)) {
    cleanDom($);
    const content = $('.wpo-login-area, .wpo-register-area, .wpo-forgot-area').parent().html() || $('.page-wrapper').html() || $('body').html();
    const cleanContent = cleanHtmlString(content);

    const astroContent = `---
import AuthLayout from "../layouts/AuthLayout.astro";
---

<AuthLayout title="${title}">
  ${cleanContent}
</AuthLayout>
`;
    fs.writeFileSync(targetAstroFile, astroContent, 'utf-8');
    console.log(`✓ Auth page created: ${baseName}.astro`);
    continue;
  }

  // Detect Header properties
  const headerProps = {};
  const $header = $('header#header');
  if ($header.length) {
    const headerHtml = $header.html();
    if (headerHtml.includes('wpo-header-style-s2')) headerProps.headerStyle = 'wpo-header-style-s2';
    else if (headerHtml.includes('wpo-header-style-s3')) headerProps.headerStyle = 'wpo-header-style-s3';
    else if (headerHtml.includes('wpo-header-style-s4')) headerProps.headerStyle = 'wpo-header-style-s4';
    else if (headerHtml.includes('wpo-header-style-s5')) headerProps.headerStyle = 'wpo-header-style-s5';
    else if (headerHtml.includes('wpo-header-style-s6')) headerProps.headerStyle = 'wpo-header-style-s6';
    else if (headerHtml.includes('wpo-header-style-s9 menu-left')) headerProps.headerStyle = 'wpo-header-style-s9 menu-left';
    else if (headerHtml.includes('wpo-header-style-s10 menu-left')) headerProps.headerStyle = 'wpo-header-style-s10 menu-left';
    else if (headerHtml.includes('wpo-header-style-s11 menu-left')) headerProps.headerStyle = 'wpo-header-style-s11 menu-left';
    else if (headerHtml.includes('wpo-header-style-s11')) headerProps.headerStyle = 'wpo-header-style-s11';
    else if (headerHtml.includes('wpo-header-style-s14 bb-1')) headerProps.headerStyle = 'wpo-header-style-s14 bb-1';
    else if (headerHtml.includes('wpo-header-style-s14')) headerProps.headerStyle = 'wpo-header-style-s14';
    else headerProps.headerStyle = 'wpo-header-style';

    if (headerHtml.includes('class="topbar topbar-s2"')) {
      headerProps.topbar = true;
      headerProps.topbarStyle = 'topbar topbar-s2';
    } else if (headerHtml.includes('class="topbar topbar-s3"')) {
      headerProps.topbar = true;
      headerProps.topbarStyle = 'topbar topbar-s3';
    } else if (headerHtml.includes('class="topbar"')) {
      headerProps.topbar = true;
      headerProps.topbarStyle = 'topbar';
    }

    if (headerHtml.includes('assets/images/logo.svg')) {
      headerProps.logo = '/assets/images/logo.svg';
    } else {
      headerProps.logo = '/assets/images/logo-2.svg';
    }

    if (headerHtml.includes('mini-cart')) {
      headerProps.showCart = true;
    }
  }

  // Detect Footer properties
  const footerProps = {};
  const $footer = $('footer.wpo-site-footer');
  if ($footer.length) {
    const footerClass = $footer.attr('class') || 'wpo-site-footer';
    if (footerClass !== 'wpo-site-footer') {
      footerProps.footerClass = footerClass;
    }
  }

  // Remove header and footer from page body before cleaning
  $('header#header').remove();
  $('footer.wpo-site-footer').remove();
  $('script').remove();

  cleanDom($);

  // Extract remaining main content inside page-wrapper
  let bodyContent = $('.page-wrapper').html() || $('body').html() || '';
  bodyContent = cleanHtmlString(bodyContent);

  const headerPropsStr = JSON.stringify(headerProps, null, 2);
  const footerPropsStr = JSON.stringify(footerProps, null, 2);

  const astroContent = `---
import BaseLayout from "../layouts/BaseLayout.astro";

const headerProps = ${headerPropsStr};
const footerProps = ${footerPropsStr};
---

<BaseLayout title="${title}" headerProps={headerProps} footerProps={footerProps}>
  ${bodyContent}
</BaseLayout>
`;

  fs.writeFileSync(targetAstroFile, astroContent, 'utf-8');
  console.log(`✓ Page created: ${baseName}.astro`);
}

function cleanHtmlString(html) {
  if (!html) return '';
  let res = html;
  // Replace residual asset references
  res = res.replace(/src="assets\//g, 'src="/assets/');
  res = res.replace(/href="assets\//g, 'href="/assets/');
  res = res.replace(/data-background="assets\//g, 'data-background="/assets/');
  res = res.replace(/data-bg-image="assets\//g, 'data-bg-image="/assets/');
  return res.trim();
}
