/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta. Base: columns.
 * Source: https://www.vyepti.com/how-vyepti-works (.narrowCardCta)
 * Generated: 2026-09-16
 *
 * Library structure (columns): first row = block name; second row defines column count.
 * Source is visually two columns:
 *   Left  (col-lg-8) = optional image + rich text (h4 kicker, h2 title, paragraph).
 *   Right (col-lg-4) = call-to-action button.
 */
export default function parse(element, { document }) {
  const row = element.querySelector('.row') || element;
  const columns = Array.from(row.querySelectorAll(':scope > [class*="col-"]'));

  // Left column: image + text content.
  const leftEl = columns[0] || element.querySelector('.rteComponent');
  const leftCell = [];
  if (leftEl) {
    const img = leftEl.querySelector('img');
    if (img) leftCell.push(img);
    leftEl
      .querySelectorAll('h1, h2, h3, h4, h5, h6, p')
      .forEach((el) => leftCell.push(el));
  }

  // Right column: CTA link(s).
  const rightEl = columns[1] || element.querySelector('.cta, .cta-component');
  const rightCell = [];
  if (rightEl) {
    rightEl
      .querySelectorAll('a.button-primary, a.button, a.cta, a')
      .forEach((a) => rightCell.push(a));
  }

  // Empty-block guard.
  if (!leftCell.length && !rightCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    [leftCell.length ? leftCell : '', rightCell.length ? rightCell : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
