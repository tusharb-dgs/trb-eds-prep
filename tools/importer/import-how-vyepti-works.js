/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsMediaParser from './parsers/columns-media.js';
import columnsCtaParser from './parsers/columns-cta.js';
import carouselQuoteParser from './parsers/carousel-quote.js';
import cardsPromoParser from './parsers/cards-promo.js';
import isiParser from './parsers/isi.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/vyepti-cleanup.js';
import sectionsTransformer from './transformers/vyepti-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-feature': cardsFeatureParser,
  'columns-media': columnsMediaParser,
  'columns-cta': columnsCtaParser,
  'carousel-quote': carouselQuoteParser,
  'cards-promo': cardsPromoParser,
  'isi': isiParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'how-vyepti-works',
  description: 'How VYEPTI Works informational page',
  urls: [
    'https://www.vyepti.com/how-vyepti-works',
  ],
  blocks: [
    { name: 'hero-banner', instances: ['.sub-banner-teaser'] },
    { name: 'cards-feature', instances: ['.what-vyepti-section'] },
    { name: 'columns-media', instances: ['.how-vyepti-section'] },
    { name: 'columns-cta', instances: ['.narrowCardCta'] },
    { name: 'carousel-quote', instances: ['.quotescardcarousel'] },
    { name: 'cards-promo', instances: ['.columncontainer:nth-of-type(6)'] },
    { name: 'isi', instances: ['.safetyInfo.isiFocus'] },
  ],
  sections: [
    { id: 'rc3', name: 'hero-sub-banner', selector: ['.sub-banner-teaser'], style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'rc4', name: 'what-is-vyepti-features', selector: ['.what-vyepti-section'], style: null, blocks: ['cards-feature'], defaultContent: [] },
    { id: 'rc5', name: 'how-vyepti-works-moa', selector: ['.section-powder-blue-bg-desktop.how-vyepti-section', '.how-vyepti-section'], style: 'powder-blue', blocks: ['columns-media'], defaultContent: [] },
    { id: 'rc6', name: 'talk-to-a-nurse-cta', selector: ['.narrowCardCta'], style: null, blocks: ['columns-cta'], defaultContent: [] },
    { id: 'rc7', name: 'patient-testimonial', selector: ['.quotescardcarousel'], style: null, blocks: ['carousel-quote'], defaultContent: [] },
    { id: 'rc8', name: 'promo-cards', selector: ['.columncontainer:nth-of-type(6)'], style: null, blocks: ['cards-promo'], defaultContent: [] },
    { id: 'rc9', name: 'important-safety-information', selector: ['.safetyInfo.isiFocus'], style: null, blocks: ['isi'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, sections after (sections only when 2+ sections)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - DOM element to transform (typically document.body)
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by a prior parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
