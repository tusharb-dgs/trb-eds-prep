/**
 * ISI (Important Safety Information): a rich-text safety/legal panel that closes
 * the page. Holds headings (APPROVED USE, IMPORTANT SAFETY INFORMATION), body
 * paragraphs, a bulleted list of side effects, and reference links.
 *
 * Expected authored structure: a single cell of rich text. Decorate defensively —
 * unwrap the table wrapper so the content flows as ordinary rich text.
 */
export default function decorate(block) {
  // Unwrap the single-cell block table into a flat rich-text container.
  const cells = block.querySelectorAll(':scope > div > div');
  if (cells.length) {
    const content = document.createElement('div');
    content.className = 'isi-content';
    cells.forEach((cell) => {
      while (cell.firstChild) content.append(cell.firstChild);
    });
    block.textContent = '';
    block.append(content);
  }
}
