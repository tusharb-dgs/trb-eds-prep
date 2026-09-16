/**
 * Media columns: a two-column layout pairing a text column (heading, paragraphs,
 * list) with a media graphic column (image + optional legend text).
 *
 * Expected authored structure: 1 row with 2 cells.
 * Decorate defensively — column count is derived, image column is optional.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is the only content in the column
          picWrapper.classList.add('columns-media-img-col');
        }
      }
    });
  });
}
