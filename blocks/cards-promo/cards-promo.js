/**
 * Promo cards: a row of image-less promotional cards, each with an eyebrow,
 * heading, short paragraph and a CTA button, plus a bottom accent bar.
 *
 * Expected authored structure: one row per card, a single cell holding
 * eyebrow + heading + description + CTA link.
 * Decorate defensively — the eyebrow and CTA are optional.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.className = 'cards-promo-card-body';
    });

    // Treat the first paragraph before the heading as an eyebrow.
    const heading = li.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const eyebrow = heading.previousElementSibling;
      if (eyebrow && eyebrow.tagName === 'P') {
        eyebrow.classList.add('cards-promo-eyebrow');
      }
    }
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
