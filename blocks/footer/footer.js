/**
 * loads and decorates the footer.
 * Metadata-independent dual-fetch: /content first (localhost / aem up),
 * then root (DA/EDS production).
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  block.textContent = '';
  if (!resp.ok) return;

  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;

  // Label the three sections: legal links, disclaimer, contact + social.
  const classes = ['footer-links', 'footer-legal', 'footer-contact'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(c);
  });

  block.append(footer);
}
