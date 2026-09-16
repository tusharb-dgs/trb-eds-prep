import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero banner: a full-bleed intro banner with a text column (eyebrow + headline
 * + optional subheading) and a decorative side image.
 *
 * Expected authored structure (1 column, up to 2 rows):
 *   row 1 (optional): decorative/background image
 *   row 2: heading content (eyebrow paragraph, heading, optional subheading)
 *
 * Authors may omit the image row (text-only banner) — decorate defensively.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Find the row that carries the decorative image (if any).
  const imageRow = rows.find((row) => row.querySelector('picture, img'));
  const textRows = rows.filter((row) => row !== imageRow);

  // Text column: everything that isn't the image.
  const text = document.createElement('div');
  text.className = 'hero-banner-text';
  textRows.forEach((row) => {
    // unwrap the cell wrapper, keep its content
    [...row.children].forEach((cell) => {
      while (cell.firstChild) text.append(cell.firstChild);
    });
    if (!row.children.length) {
      while (row.firstChild) text.append(row.firstChild);
    }
  });

  // Treat the first paragraph before the heading as an eyebrow.
  const firstHeading = text.querySelector('h1, h2, h3, h4, h5, h6');
  if (firstHeading) {
    const eyebrow = firstHeading.previousElementSibling;
    if (eyebrow && eyebrow.tagName === 'P') {
      eyebrow.classList.add('hero-banner-eyebrow');
    }
  }

  block.textContent = '';

  // Media column (optional).
  if (imageRow) {
    const media = document.createElement('div');
    media.className = 'hero-banner-media';
    const img = imageRow.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(
        img.src,
        img.alt || '',
        false,
        [{ width: '750' }],
      );
      media.append(optimized);
    } else {
      const picture = imageRow.querySelector('picture');
      if (picture) media.append(picture);
    }
    block.append(media);
  } else {
    block.classList.add('no-image');
  }

  block.append(text);
}
