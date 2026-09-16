/**
 * Media columns: a two-column layout pairing a text column (heading, paragraphs,
 * list) with a media graphic column (a main graphic + a labeled legend list).
 *
 * Expected authored structure: 1 row with 2 cells.
 * Decorate defensively — column count is derived, columns are classified by
 * their content so CSS can target them without relying on source order.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const list = col.querySelector('ul');

      if (pic && list) {
        // media column: a main graphic paired with a legend list
        col.classList.add('columns-media-media');
        list.classList.add('columns-media-legend');
      } else if (pic) {
        // image-only column
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-media-img-col');
        }
      } else {
        // text column
        col.classList.add('columns-media-text');
      }
    });
  });
}
