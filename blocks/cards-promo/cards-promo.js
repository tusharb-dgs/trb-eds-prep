/**
 * Promo cards: a row of image-less promotional cards, each with an eyebrow,
 * heading, short paragraph and a CTA button, plus a bottom accent bar.
 *
 * Expected authored structure: one row per card, a single cell holding
 * eyebrow + heading + description + CTA link.
 * Decorate defensively — the eyebrow and CTA are optional.
 */

/**
 * Normalize a CTA paragraph whose label text sits OUTSIDE the anchor.
 * The source authors the CTA as "Label <arrow-image>" inside one link, but the
 * runtime can split it into a bare text node followed by an <a> wrapping only
 * the arrow image. Pull that leading label text back into the anchor so the
 * whole pill (label + arrow) is one clickable, styleable unit.
 */
function normalizeCta(p) {
  const a = p.querySelector('a');
  if (!a) return;
  // Only act when the anchor's visible content is an image with no text label.
  const anchorHasText = a.textContent.trim().length > 0;
  const anchorHasImage = !!a.querySelector('picture, img');
  if (anchorHasText || !anchorHasImage) return;

  // Collect the leading label text nodes that precede the anchor, then remove them.
  const leading = [...p.childNodes].slice(0, [...p.childNodes].indexOf(a));
  const label = leading
    .map((node) => (node.textContent ? node.textContent.trim() : ''))
    .filter(Boolean);
  leading.forEach((node) => node.remove());
  if (!label.length) return;

  a.insertBefore(document.createTextNode(`${label.join(' ')} `), a.firstChild);
}

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

    // Repair any CTA whose label text was split out of the anchor.
    li.querySelectorAll('p').forEach(normalizeCta);

    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
