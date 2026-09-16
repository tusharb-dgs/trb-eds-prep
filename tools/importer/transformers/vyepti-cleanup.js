/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: vyepti site-wide cleanup.
 * Removes non-authorable site shell so the import contains only page-level
 * authorable content (the sections under `.root.responsivegrid`).
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Relocate the full ISI (Important Safety Information) panel into the main
    // section grid so it survives shell removal and lands as the LAST section —
    // matching the source page, where the expanded ISI closes the content.
    // The ISI fragment holds two panels: a collapsed sticky bar and the full
    // expanded panel `.safetyInfo.isiFocus` (starts with "APPROVED USE"). We keep
    // only the expanded panel and move it into `.root.responsivegrid > .aem-Grid`.
    // This runs before the sections transformer's beforeTransform (cleanup is
    // first in the transformer array), so the section <hr> is inserted correctly.
    const isiPanel = element.querySelector('.safetyInfo.isiFocus');
    const grid = element.querySelector('.root.responsivegrid > .aem-Grid')
      || element.querySelector('.root.responsivegrid');
    if (isiPanel && grid) {
      grid.append(isiPanel);
    }

    // Overlays/modals removed before block parsing so they never block matching.
    // - Cookie consent banner/modal (cleaned.html line 2: #cookie-information-template-wrapper).
    // - Interstitial / redirect / popup modals (cleaned.html lines 2568-2672):
    //   `.interstitialmodal`, `.popupinterstitialmodal`, each wrapping
    //   `.modal.fade.header-modal` (#internal-link-modal, #external-link-modal,
    //   #patient-site-modal, #prescription-modal) with `.modal-dialog`.
    //   Redirect dialogs ("Clicking OK will redirect you...", "You are about to leave
    //   VYEPTI.com...", HCP redirect, "Have you been prescribed VYEPTI?" Yep/Nope).
    //   Defensive: selectors may match zero or more elements.
    WebImporter.DOMUtils.remove(element, [
      '#cookie-information-template-wrapper',
      '.interstitialmodal',
      '.popupinterstitialmodal',
      '.modal.fade.header-modal',
      '.modal-dialog',
      '.modal.fade',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (all shared experience fragments / global shell,
    // not authored per page):
    // - Header experience fragment (cleaned.html lines 1578-1579): wrapper
    //   `.experiencefragment` containing `.cmp-experiencefragment--header`.
    //   Holds teal utility strip ("For the preventive treatment of migraine in
    //   adults.", Patient/Prescribing Information + HCP Site links, social icons)
    //   and desktop+mobile nav. Removing `.cmp-experiencefragment--header` takes
    //   the whole header block. Legacy `header.header-section` kept for safety.
    // - Standalone teal strips (`section.info-teal-strip-section`, lines 1583/1647)
    //   and nav bars (`nav.navbar`, lines 1676/1691) removed defensively in case
    //   any survive outside the header fragment.
    // - ISI experience fragment (cleaned.html lines 2296-2309): wrapper
    //   `.footer.iparsys.parsys` containing `.cmp-experiencefragment--isi` and the
    //   `.isi` column ("IMPORTANT SAFETY INFORMATION", "APPROVED USE", allergic
    //   reactions / constipation / Raynaud's — duplicated desktop+mobile copies).
    //   Target the fragment and column directly so it is removed even if the
    //   `.footer.iparsys.parsys` wrapper class order differs on the live page.
    // - Footer experience fragment (`.cmp-experiencefragment--footer`, line 2476 /
    //   footer#footer) and any `<header>`/`<footer>` tags.
    // - Tracking-pixel images (line 2673: googleadservices; bat.bing defensive).
    WebImporter.DOMUtils.remove(element, [
      // Header shell
      '.cmp-experiencefragment--header',
      'header.header-section',
      'section.info-teal-strip-section',
      'nav.navbar',
      // ISI safety-information shell
      '.cmp-experiencefragment--isi',
      '.footer.iparsys.parsys',
      '.isi',
      // Footer shell
      '.cmp-experiencefragment--footer',
      'header',
      'footer',
      // Tracking pixels
      'img[src*="googleadservices.com"]',
      'img[src*="bat.bing.com"]',
      'img[src*="doubleclick.net"]',
      // Generic non-authorable elements
      'iframe',
      'noscript',
      'link',
      'style',
      'script',
    ]);
  }
}
