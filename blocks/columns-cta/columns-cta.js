/**
 * CTA columns: a single wide callout card. The text column holds a decorative
 * accent shape, an eyebrow heading, a title and a paragraph; the action column
 * holds a single CTA button.
 *
 * Expected authored structure: 1 row with 2 cells.
 * Decorate defensively — column count is derived, cells and pieces are optional.
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
