/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-how-vyepti-works.js
  var import_how_vyepti_works_exports = {};
  __export(import_how_vyepti_works_exports, {
    default: () => import_how_vyepti_works_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".cmp-teaser__image img, picture img, img");
    const contentRoot = element.querySelector(".cmp-teaser__content, .cmp-teaser__description") || element;
    const title = contentRoot.querySelector("h1, h2, .cmp-teaser__title");
    const kicker = Array.from(contentRoot.querySelectorAll("h3, h4, h5, p")).find((el) => el !== title);
    const ctaLinks = Array.from(
      contentRoot.querySelectorAll(".cmp-teaser__action-link, a.button, a.cta, a")
    );
    if (!title && !kicker && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (kicker) contentCell.push(kicker);
    if (title) contentCell.push(title);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document: document2 }) {
    let cardEls = Array.from(element.querySelectorAll(".cmp-teaser"));
    if (!cardEls.length) {
      cardEls = Array.from(element.querySelectorAll('.row > [class*="col-"], .teaser'));
    }
    const cells = [];
    cardEls.forEach((card) => {
      const image = card.querySelector(".cmp-teaser__image img, picture img, img");
      const contentRoot = card.querySelector(".cmp-teaser__description, .cmp-teaser__content") || card;
      const contentCell = [];
      const heading = contentRoot.querySelector("h1, h2, h3, h4, .cmp-teaser__title");
      if (heading) contentCell.push(heading);
      contentRoot.querySelectorAll("p").forEach((p) => contentCell.push(p));
      contentRoot.querySelectorAll(".cmp-teaser__action-link, a.button, a.cta").forEach((a) => contentCell.push(a));
      if (image || contentCell.length) {
        cells.push([image || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse3(element, { document: document2 }) {
    const row = element.querySelector(".row") || element;
    const leftWrapper = element.querySelector(".carousalLeftWrapper") || row.querySelector(':scope > [class*="col-"]');
    const leftCell = [];
    if (leftWrapper) {
      leftWrapper.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol").forEach((el) => leftCell.push(el));
    }
    const rightCell = [];
    const mediaImg = element.querySelector(".vyepti-works-gif img, .cmp-teaser__image img");
    if (mediaImg) rightCell.push(mediaImg);
    const legend = element.querySelector(".carousal-right-content-tablet ul, .carousal-right-content ul");
    if (legend) rightCell.push(legend);
    const disclaimer = element.querySelector(".how-vyepti-disclaimer-text h6, .how-vyepti-disclaimer-text");
    if (disclaimer) rightCell.push(disclaimer);
    if (!leftCell.length && !rightCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [leftCell.length ? leftCell : "", rightCell.length ? rightCell : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse4(element, { document: document2 }) {
    const row = element.querySelector(".row") || element;
    const columns = Array.from(row.querySelectorAll(':scope > [class*="col-"]'));
    const leftEl = columns[0] || element.querySelector(".rteComponent");
    const leftCell = [];
    if (leftEl) {
      const img = leftEl.querySelector("img");
      if (img) leftCell.push(img);
      leftEl.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((el) => leftCell.push(el));
    }
    const rightEl = columns[1] || element.querySelector(".cta, .cta-component");
    const rightCell = [];
    if (rightEl) {
      rightEl.querySelectorAll("a.button-primary, a.button, a.cta, a").forEach((a) => rightCell.push(a));
    }
    if (!leftCell.length && !rightCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [leftCell.length ? leftCell : "", rightCell.length ? rightCell : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-quote.js
  function parse5(element, { document: document2 }) {
    let slides = Array.from(
      element.querySelectorAll(".slick-slide:not(.slick-cloned)")
    );
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".quotes-card, .columncontainer"));
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".vyepti-patient-image, img.vyepti-patient-image") || slide.querySelector("img");
      const textRoot = slide.querySelector(".rteComponent") || slide;
      const textCell = [];
      textRoot.querySelectorAll("h1, h2, h3, h4, h5, h6, hr, p, blockquote").forEach((el) => textCell.push(el));
      if (image || textCell.length) {
        cells.push([image || "", textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-quote", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse6(element, { document: document2 }) {
    let cardEls = Array.from(element.querySelectorAll(".bgcard-parsys"));
    if (!cardEls.length) {
      cardEls = Array.from(element.querySelectorAll('.row > [class*="col-"]'));
    }
    const cells = [];
    cardEls.forEach((card) => {
      const contentCell = [];
      const textRoot = card.querySelector(".description-after") || card;
      textRoot.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((el) => contentCell.push(el));
      card.querySelectorAll(".boxed-link a, a.button-primary, a.button, a.cta").forEach((a) => contentCell.push(a));
      if (contentCell.length) {
        cells.push([contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/isi.js
  function parse7(element, { document: document2 }) {
    const scope = element.querySelector(".container") || element;
    const wanted = "h1, h2, h3, h4, h5, h6, p, ul, ol";
    const nodes = [...scope.querySelectorAll(wanted)].filter((n) => {
      if (n.closest("li")) return false;
      return true;
    });
    const cell = document2.createElement("div");
    nodes.forEach((n) => {
      if (!n.textContent.trim() && !n.querySelector("a, img")) return;
      cell.append(n.cloneNode(true));
    });
    if (!cell.childNodes.length) {
      cell.append(scope.cloneNode(true));
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "isi",
      cells: [[cell]]
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/vyepti-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const isiPanel = element.querySelector(".safetyInfo.isiFocus");
      const grid = element.querySelector(".root.responsivegrid > .aem-Grid") || element.querySelector(".root.responsivegrid");
      if (isiPanel && grid) {
        grid.append(isiPanel);
      }
      WebImporter.DOMUtils.remove(element, [
        "#cookie-information-template-wrapper",
        ".interstitialmodal",
        ".popupinterstitialmodal",
        ".modal.fade.header-modal",
        ".modal-dialog",
        ".modal.fade"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Header shell
        ".cmp-experiencefragment--header",
        "header.header-section",
        "section.info-teal-strip-section",
        "nav.navbar",
        // ISI safety-information shell
        ".cmp-experiencefragment--isi",
        ".footer.iparsys.parsys",
        ".isi",
        // Footer shell
        ".cmp-experiencefragment--footer",
        "header",
        "footer",
        // Tracking pixels
        'img[src*="googleadservices.com"]',
        'img[src*="bat.bing.com"]',
        'img[src*="doubleclick.net"]',
        // Generic non-authorable elements
        "iframe",
        "noscript",
        "link",
        "style",
        "script"
      ]);
    }
  }

  // tools/importer/transformers/vyepti-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-how-vyepti-works.js
  var parsers = {
    "hero-banner": parse,
    "cards-feature": parse2,
    "columns-media": parse3,
    "columns-cta": parse4,
    "carousel-quote": parse5,
    "cards-promo": parse6,
    "isi": parse7
  };
  var PAGE_TEMPLATE = {
    name: "how-vyepti-works",
    description: "How VYEPTI Works informational page",
    urls: [
      "https://www.vyepti.com/how-vyepti-works"
    ],
    blocks: [
      { name: "hero-banner", instances: [".sub-banner-teaser"] },
      { name: "cards-feature", instances: [".what-vyepti-section"] },
      { name: "columns-media", instances: [".how-vyepti-section"] },
      { name: "columns-cta", instances: [".narrowCardCta"] },
      { name: "carousel-quote", instances: [".quotescardcarousel"] },
      { name: "cards-promo", instances: [".columncontainer:nth-of-type(6)"] },
      { name: "isi", instances: [".safetyInfo.isiFocus"] }
    ],
    sections: [
      { id: "rc3", name: "hero-sub-banner", selector: [".sub-banner-teaser"], style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "rc4", name: "what-is-vyepti-features", selector: [".what-vyepti-section"], style: null, blocks: ["cards-feature"], defaultContent: [] },
      { id: "rc5", name: "how-vyepti-works-moa", selector: [".section-powder-blue-bg-desktop.how-vyepti-section", ".how-vyepti-section"], style: "powder-blue", blocks: ["columns-media"], defaultContent: [] },
      { id: "rc6", name: "talk-to-a-nurse-cta", selector: [".narrowCardCta"], style: null, blocks: ["columns-cta"], defaultContent: [] },
      { id: "rc7", name: "patient-testimonial", selector: [".quotescardcarousel"], style: null, blocks: ["carousel-quote"], defaultContent: [] },
      { id: "rc8", name: "promo-cards", selector: [".columncontainer:nth-of-type(6)"], style: null, blocks: ["cards-promo"], defaultContent: [] },
      { id: "rc9", name: "important-safety-information", selector: [".safetyInfo.isiFocus"], style: null, blocks: ["isi"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_how_vyepti_works_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_how_vyepti_works_exports);
})();
