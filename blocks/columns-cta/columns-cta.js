/**
 * CTA columns: a single wide callout card. The text column holds a decorative
 * accent shape, an eyebrow heading, a title and a paragraph; the action column
 * holds a single CTA button.
 *
 * Expected authored structure: 1 row with 2 cells.
 * Decorate defensively — column count is derived, cells and pieces are optional.
 */
/**
 * Normalize a CTA paragraph whose label text sits OUTSIDE the anchor.
 * The source authors the CTA as "Label <arrow-image>" inside one link, but the
 * runtime can split it into a bare text node followed by an <a> wrapping only
 * the arrow image. Pull that leading label text back into the anchor so the
 * whole pill (label + arrow) is one clickable, styleable unit.
 */
function normalizeCta(container) {
  container.querySelectorAll('p').forEach((p) => {
    const a = p.querySelector('a');
    if (!a) return;
    const anchorHasText = a.textContent.trim().length > 0;
    const anchorHasImage = !!a.querySelector('picture, img');
    if (anchorHasText || !anchorHasImage) return;

    const leading = [...p.childNodes].slice(0, [...p.childNodes].indexOf(a));
    const label = leading
      .map((node) => (node.textContent ? node.textContent.trim() : ''))
      .filter(Boolean);
    leading.forEach((node) => node.remove());
    if (!label.length) return;
    a.insertBefore(document.createTextNode(`${label.join(' ')} `), a.firstChild);
  });
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-cta-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Mark the CTA column (a cell whose main content is a link/button).
      const link = col.querySelector('a');
      if (link && !col.querySelector('h1, h2, h3, h4, h5, h6, ul, ol')) {
        col.classList.add('columns-cta-action-col');
      }

      // Repair any CTA whose label text was split out of the anchor.
      normalizeCta(col);

      // A paragraph whose only content is an image is the decorative accent shape.
      [...col.children].forEach((child) => {
        if (child.tagName === 'P') {
          const pic = child.querySelector('picture, img');
          const text = child.textContent.trim();
          if (pic && text === '') {
            child.classList.add('columns-cta-accent');
          }
        }
      });
    });
  });
}
