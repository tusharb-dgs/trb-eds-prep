/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.vyepti.com/how-vyepti-works (.sub-banner-teaser)
 * Generated: 2026-09-16
 *
 * Library structure (hero): 1 column, 3 rows.
 *   Row 1: block name.
 *   Row 2: background image (optional).
 *   Row 3: title (heading), subheading, CTA (optional).
 * Source uses AEM teaser markup: .cmp-teaser__image > picture > img,
 * .cmp-teaser__content .cmp-teaser__description with an <h3> kicker and <h1> title.
 */
export default function parse(element, { document }) {
  // Background image (optional) — from the teaser image area.
  const bgImage = element.querySelector('.cmp-teaser__image img, picture img, img');

  // Content area — heading, subheading/kicker, optional CTA.
  const contentRoot = element.querySelector('.cmp-teaser__content, .cmp-teaser__description') || element;

  // Primary title — prefer h1, then descending heading levels.
  const title = contentRoot.querySelector('h1, h2, .cmp-teaser__title');
  // Kicker / subheading — a smaller heading or paragraph distinct from the title.
  const kicker = Array.from(contentRoot.querySelectorAll('h3, h4, h5, p'))
    .find((el) => el !== title);
  // Call-to-action links (optional).
  const ctaLinks = Array.from(
    contentRoot.querySelectorAll('.cmp-teaser__action-link, a.button, a.cta, a'),
  );

  // Empty-block guard.
  if (!title && !kicker && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (only if present).
  if (bgImage) cells.push([bgImage]);

  // Row 3: single cell holding all text/CTA content.
  const contentCell = [];
  if (kicker) contentCell.push(kicker);
  if (title) contentCell.push(title);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
