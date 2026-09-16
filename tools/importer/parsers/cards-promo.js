/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo. Base: cards (no-images variant).
 * Source: https://www.vyepti.com/how-vyepti-works (.columncontainer:nth-of-type(6))
 * Generated: 2026-09-16
 *
 * The source cards contain no standalone card image — the only <img> elements are
 * arrow icons embedded inside the CTA links. Per the library description, when no
 * images are present the "no images" Cards variant applies: 1 column, each row is
 * one card whose single cell holds the text content (heading, description, CTA).
 *
 * Structure (cards, no images): first row = block name; each subsequent row = one card.
 *   Cell: kicker/heading, description, call-to-action link.
 */
export default function parse(element, { document }) {
  // Each card = the inner .bgcard-parsys. Note .bgcardparsys (no hyphen) is the outer
  // wrapper — selecting both would produce duplicate/empty rows, so match only the inner.
  let cardEls = Array.from(element.querySelectorAll('.bgcard-parsys'));
  if (!cardEls.length) {
    cardEls = Array.from(element.querySelectorAll('.row > [class*="col-"]'));
  }

  const cells = [];

  cardEls.forEach((card) => {
    const contentCell = [];
    // Text content: kicker + title + description.
    const textRoot = card.querySelector('.description-after') || card;
    textRoot
      .querySelectorAll('h1, h2, h3, h4, h5, h6, p')
      .forEach((el) => contentCell.push(el));
    // Call-to-action link.
    card
      .querySelectorAll('.boxed-link a, a.button-primary, a.button, a.cta')
      .forEach((a) => contentCell.push(a));

    if (contentCell.length) {
      // 1-column: one cell per card holding all its content.
      cells.push([contentCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
