# Bliize — Premium Architecture & Construction Web Application

[![Astro](https://img.shields.io/badge/Astro-5.0-FF5D01.svg?style=flat&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02.svg?style=flat&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Playwright](https://img.shields.io/badge/Playwright-Tested-2EAD33.svg?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, high-performance web application cloned and engineered from a legacy multi-page architecture template into a blazing-fast, component-driven **Astro 5** codebase with **View Transitions (`<ClientRouter />`)**, advanced **GSAP animations**, and multi-breakpoint responsive fidelity.

---

## 🌟 Key Highlights & Engineering Achievements

- **🚀 41 Production Routes Migrated**: 100% route and asset parity spanning 15 specialized home concepts (Modern, Classic, Interior Design, Renovation, Urban Planning, Construction, WooCommerce) and 26 inner pages.
- **⚡ Instant Single-Page Navigation**: Implemented Astro View Transitions (`<ClientRouter />`) for silky-smooth, zero-refresh client-side page swaps.
- **🎭 Advanced GSAP Animation Lifecycle**: Built a centralized lifecycle manager handling `ScrollTrigger`, `SplitText`, `fade_bottom`, rolling text, interactive cursors, and magnetic button physics without memory leaks.
- **📱 True Multi-Breakpoint Responsiveness**: 100% verified layouts across Mobile (`375px`), Tablet (`768px`), and Desktop (`1440px`) with off-canvas drawers and touch-optimized carousels.
- **🛡️ Automated Playwright QA Suite**: Integrated automated end-to-end browser testing validating 120 route/breakpoint combinations with **0 console errors, 0 overflow issues, and 0 missing assets**.

---

## 🏗️ Architecture & Component Design

```text
bliize-astro/
├── public/
│   └── assets/              # Static assets (fonts, optimized images, stylesheets, vendor scripts)
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── Header.astro     # Configurable header (supports 11 styles, topbars, search, mini-cart)
│   │   ├── Footer.astro     # Modular multi-column footer with newsletter & rolling text links
│   │   ├── PageTitle.astro  # Breadcrumb header with dynamic SplitText reveal
│   │   ├── Preloader.astro  # Loading overlay
│   │   └── CustomCursor.astro # Magnetic custom dual cursor
│   ├── layouts/             # Base layouts
│   │   ├── BaseLayout.astro # Master layout with <ClientRouter /> and global stylesheets
│   │   └── AuthLayout.astro # Clean minimal layout for login/register/forgot flows
│   ├── pages/               # 41 Static Astro routes
│   └── scripts/
│       └── main.js          # Centralized client lifecycle orchestrator (Astro page-load & swap hooks)
├── scripts/
│   ├── migrate-pages.js     # Cheerio AST-based HTML sanitizer and page transformer
│   └── test-integrity.js    # Automated asset & internal link verification suite
└── astro.config.mjs
```

---

## 🛠️ Key Technical Challenges & Solutions

### 1. AST-Based DOM Sanitization (Static Clone Cleaning)
* **Problem**: The original static source files had DOM snapshots dumped while runtime jQuery plugins were active (`.slick-cloned`, `.swiper-slide-duplicate`, `.odometer-inside`, hardcoded character `<div>`s with `opacity: 0`).
* **Solution**: Developed an automated Cheerio AST script ([`scripts/migrate-pages.js`](scripts/migrate-pages.js)) that unwrapped nested character divs, cleaned phantom clones, and restored clean semantic markup before building Astro components.

### 2. View Transitions & Animation Re-synchronization
* **Problem**: In SPA / View Transitions setups, GSAP `ScrollTrigger` instances and third-party carousels often leak memory or fail to re-bind when the DOM swaps.
* **Solution**: Engineered a lifecycle orchestrator ([`src/scripts/main.js`](src/scripts/main.js)) listening to `astro:page-load` and `astro:before-swap`. It automatically kills prior triggers via `ScrollTrigger.getAll().forEach(t => t.kill())`, safely splits text freshly, and re-initializes carousels cleanly on each navigation.

### 3. Responsive Header & Navigation Engine
* **Problem**: 41 pages required diverse header configurations (transparent, dark-themed, topbar with contact info, shop mini-cart drawer, and hamburger drawer).
* **Solution**: Designed a polymorphic [`Header.astro`](src/components/Header.astro) component accepting structured props (`headerStyle`, `topbar`, `topbarStyle`, `logo`, `showCart`, `showSearch`) to render pixel-perfect variants dynamically.

---

## 🚦 Automated Quality Assurance & Testing

The codebase includes an automated audit suite to ensure zero regressions:

```bash
# Verify all 698 asset references and 363 internal links
npm test
```

### Verification Metrics:
- **Total Pages Audited**: 41 / 41
- **Asset Integrity**: 698 asset references checked — **0 missing (100% valid)**
- **Internal Link Integrity**: 363 internal routes checked — **0 broken links**
- **Compilation Speed**: Static production build generated in **1.46s**

---

## 💻 Getting Started

### Prerequisites
- Node.js `18.x` or higher
- npm `9.x` or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/bliize-astro.git

# Navigate to project directory
cd bliize-astro

# Install dependencies
npm install
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the Astro development server at `http://localhost:4321` |
| `npm run build` | Compiles the production static bundle to `./dist/` |
| `npm run preview` | Serves the production build locally for verification |
| `npm test` | Runs the automated asset & route integrity test suite |

---

## 🎨 Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation + View Transitions)
- **Styling**: Vanilla CSS, SASS, [Bootstrap 5](https://getbootstrap.com/)
- **Animation & Motion**: [GSAP 3](https://greensock.com/gsap/) (`ScrollTrigger`, `SplitText`), WOW.js, CSS Keyframes
- **Carousels & UI**: [Swiper](https://swiperjs.com/), [Slick](https://kenwheeler.github.io/slick/), [Owl Carousel](https://owlcarousel2.github.io/OwlCarousel2/), [Fancybox](https://fancyapps.com/fancybox/)
- **Testing & Tooling**: [Playwright](https://playwright.dev/), [Cheerio](https://cheerio.js.org/), Node.js

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
