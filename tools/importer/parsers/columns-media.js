/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base: columns.
 * Source: https://www.vyepti.com/how-vyepti-works (.how-vyepti-section)
 * Generated: 2026-09-16
 *
 * Library structure (columns): first row = block name; second row defines the
 * column count; additional rows must match that column count.
 * Source is visually two columns:
 *   Left  = rich-text (h2, paragraphs, list, disclaimer).
 *   Right = media (gif image) plus a small legend list.
 * The source repeats the legend for tablet/desktop responsive variants; only one
 * copy is captured to avoid duplicate content.
 */
export default function parse(element, { document }) {
  // Left column: primary rich-text content.
  // Prefer the explicit left wrapper; fall back to the first grid column in the row.
  const row = element.querySelector('.row') || element;
  const leftWrapper = element.querySelector('.carousalLeftWrapper')
    || row.querySelector(':scope > [class*="col-"]');
  const leftCell = [];
  if (leftWrapper) {
    // Grab meaningful block-level elements once (they are not nested in each other).
    leftWrapper
      .querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')
      .forEach((el) => leftCell.push(el));
  }

  // Right column: media image + one legend list.
  const rightCell = [];
  const mediaImg = element.querySelector('.vyepti-works-gif img, .cmp-teaser__image img');
  if (mediaImg) rightCell.push(mediaImg);
  // Pick the first legend list (avoid the responsive duplicates).
  const legend = element.querySelector('.carousal-right-content-tablet ul, .carousal-right-content ul');
  if (legend) rightCell.push(legend);
  // Disclaimer beneath the media, if present as a distinct column.
  const disclaimer = element.querySelector('.how-vyepti-disclaimer-text h6, .how-vyepti-disclaimer-text');
  if (disclaimer) rightCell.push(disclaimer);

  // Empty-block guard.
  if (!leftCell.length && !rightCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    [leftCell.length ? leftCell : '', rightCell.length ? rightCell : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
