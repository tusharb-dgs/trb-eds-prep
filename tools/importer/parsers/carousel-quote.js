/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-quote. Base: carousel.
 * Source: https://www.vyepti.com/how-vyepti-works (.quotescardcarousel)
 * Generated: 2026-09-16
 *
 * Library structure (carousel): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each subsequent row = one slide: [image, text content (title/quote, attribution, disclaimer)].
 * Source uses a slick carousel: .slick-slide items each containing a left rich-text
 * column (quote h2, attribution paragraphs) and a right column with the patient photo.
 * slick clones (.slick-cloned) are skipped to avoid duplicate slides.
 */
export default function parse(element, { document }) {
  // Real slides only (exclude slick-generated clones).
  let slides = Array.from(
    element.querySelectorAll('.slick-slide:not(.slick-cloned)'),
  );
  // Fallback if slick markup is not present (e.g. non-initialized DOM).
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.quotes-card, .columncontainer'));
  }

  const cells = [];

  slides.forEach((slide) => {
    // Image cell: the main patient/feature image for the slide.
    const image = slide.querySelector('.vyepti-patient-image, img.vyepti-patient-image')
      || slide.querySelector('img');

    // Text cell: quote heading, divider, attribution and disclaimer paragraphs.
    const textRoot = slide.querySelector('.rteComponent') || slide;
    const textCell = [];
    textRoot
      .querySelectorAll('h1, h2, h3, h4, h5, h6, hr, p, blockquote')
      .forEach((el) => textCell.push(el));

    if (image || textCell.length) {
      cells.push([image || '', textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-quote', cells });
  element.replaceWith(block);
}
