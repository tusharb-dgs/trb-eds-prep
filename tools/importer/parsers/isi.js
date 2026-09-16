/* eslint-disable */
/* global WebImporter */

/**
 * Parser: isi (Important Safety Information).
 * The source panel `.safetyInfo.isiFocus` holds an optional sticky-top toggle
 * plus a `.container` with the real rich-text content: APPROVED USE + IMPORTANT
 * SAFETY INFORMATION headings (h5), body paragraphs, a bulleted side-effects
 * list, and reference links. We collect the block-level content in reading
 * order into a single rich-text cell.
 */
export default function parse(element, { document }) {
  const scope = element.querySelector('.container') || element;

  // Collect block-level content nodes in document order. Deduplicate by walking
  // top-down and skipping nodes already captured inside an ancestor we took.
  const wanted = 'h1, h2, h3, h4, h5, h6, p, ul, ol';
  const nodes = [...scope.querySelectorAll(wanted)].filter((n) => {
    // keep a list, but drop its <li> children being matched separately (ul/ol only)
    if (n.closest('li')) return false; // paragraphs inside list items stay with the list
    // avoid capturing a <p> that is nested inside another captured <p> (rare)
    return true;
  });

  const cell = document.createElement('div');
  nodes.forEach((n) => {
    // Skip empty nodes
    if (!n.textContent.trim() && !n.querySelector('a, img')) return;
    cell.append(n.cloneNode(true));
  });

  // Fallback: if nothing matched, take the whole container.
  if (!cell.childNodes.length) {
    cell.append(scope.cloneNode(true));
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'isi',
    cells: [[cell]],
  });

  element.replaceWith(block);
}
