/**
 * CTA columns: a single wide callout card with a text column (eyebrow, heading,
 * paragraph) on one side and a CTA button on the other.
 *
 * Expected authored structure: 1 row with 2 cells.
 * Decorate defensively — column count is derived, the CTA cell is optional.
 */
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
      // Treat the first paragraph before the heading as an eyebrow.
      const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        const eyebrow = heading.previousElementSibling;
        if (eyebrow && eyebrow.tagName === 'P') {
          eyebrow.classList.add('columns-cta-eyebrow');
        }
      }
    });
  });
}
