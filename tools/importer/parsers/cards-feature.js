/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://www.vyepti.com/how-vyepti-works (.what-vyepti-section)
 * Generated: 2026-09-16
 *
 * Library structure (cards): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each subsequent row = one card: [image/icon, text content (title, description, CTA)].
 * Source: .row > .col-* each wrapping a .cmp-teaser with
 *   .cmp-teaser__image img and .cmp-teaser__description (h2 + p).
 */
export default function parse(element, { document }) {
  // Each card is a teaser column. Prefer explicit teaser wrappers, fall back to grid columns.
  let cardEls = Array.from(element.querySelectorAll('.cmp-teaser'));
  if (!cardEls.length) {
    cardEls = Array.from(element.querySelectorAll('.row > [class*="col-"], .teaser'));
  }

  const cells = [];

  cardEls.forEach((card) => {
    // First cell: image / icon.
    const image = card.querySelector('.cmp-teaser__image img, picture img, img');

    // Second cell: text content (heading, description, optional CTA).
    const contentRoot = card.querySelector('.cmp-teaser__description, .cmp-teaser__content') || card;
    const contentCell = [];
    const heading = contentRoot.querySelector('h1, h2, h3, h4, .cmp-teaser__title');
    if (heading) contentCell.push(heading);
    contentRoot.querySelectorAll('p').forEach((p) => contentCell.push(p));
    contentRoot
      .querySelectorAll('.cmp-teaser__action-link, a.button, a.cta')
      .forEach((a) => contentCell.push(a));

    // Only add a card row if it has content.
    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
