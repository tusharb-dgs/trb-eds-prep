// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment as plain HTML. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

/** Collapse every open dropdown in the main nav. */
function closeAllDrops(navSections, except) {
  navSections.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    if (drop !== except) drop.setAttribute('aria-expanded', 'false');
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  if (expanded || isDesktop.matches) closeAllDrops(navSections);
}

/**
 * Wire up a group of dropdown list items (top-level <li> that contain a nested <ul>).
 * Desktop: hover opens, click toggles. Mobile: click/tap toggles (accordion).
 */
function decorateDropGroup(container, navSections, nav) {
  container.querySelectorAll(':scope > ul > li').forEach((li) => {
    if (!li.querySelector(':scope > ul')) return; // leaf link, no dropdown
    li.classList.add('nav-drop');
    li.setAttribute('aria-expanded', 'false');

    // The label is the first <p> (dropdown trigger text).
    const label = li.querySelector(':scope > p');
    if (label) label.classList.add('nav-drop-label');

    const trigger = label || li;
    trigger.addEventListener('click', (e) => {
      // let real links inside navigate normally
      if (e.target.closest('a')) return;
      const isOpen = li.getAttribute('aria-expanded') === 'true';
      closeAllDrops(navSections, li);
      li.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });

    if (isDesktop.matches) {
      li.addEventListener('mouseenter', () => {
        closeAllDrops(navSections, li);
        li.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', () => li.setAttribute('aria-expanded', 'false'));
    }
  });

  // close on outside click / escape
  document.addEventListener('click', (e) => {
    if (nav && !nav.contains(e.target)) closeAllDrops(navSections);
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeAllDrops(navSections);
  });
}

/**
 * loads and decorates the header nav.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Three sections: utility strip, brand row, main nav.
  const classes = ['utility', 'brand', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) decorateDropGroup(navSections, navSections, nav);

  // Utility strip dropdowns (Patient / Prescribing Information EN/ES).
  const navUtility = nav.querySelector('.nav-utility');
  if (navUtility) decorateDropGroup(navUtility, navUtility, nav);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // set initial state and re-init on viewport change
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, navSections, isDesktop.matches);
    if (navSections) closeAllDrops(navSections);
    const btn = hamburger.querySelector('button');
    if (btn) btn.setAttribute('aria-label', 'Open navigation');
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
