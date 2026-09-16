import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Feature cards: a row of self-contained items, each with a circular icon/badge,
 * a heading, and a short description. Centered text, no CTA.
 *
 * Expected authored structure: one row per card, 2 cells:
 *   cell 1 = icon/image, cell 2 = heading + description.
 * Decorate defensively — a card may omit the icon or the body.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-feature-card-icon';
      } else {
        div.className = 'cards-feature-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
