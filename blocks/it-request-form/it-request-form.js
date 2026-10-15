/**
 * IT Request Form: a styled variant of the generic form block.
 *
 * Authored like the form block: one row with the form sheet (.json) link and
 * one row with the submit endpoint link. Fields, labels, placeholders, options
 * and layout (Style / Fieldset columns) all come from the sheet; rendering,
 * validation and submission are delegated to blocks/form.
 */
import decorateForm from '../form/form.js';

/**
 * The base form only accepts a sheet link on the current origin. Authors may
 * paste an absolute aem.page / aem.live URL, so point .json links at this site.
 */
function localizeSheetLinks(block) {
  block.querySelectorAll('a[href]').forEach((a) => {
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin && url.pathname.endsWith('.json')) {
      a.href = `${window.location.origin}${url.pathname}`;
    }
  });
}

export default async function decorate(block) {
  // base form styles are scoped to .form
  block.classList.add('form');
  localizeSheetLinks(block);

  try {
    await decorateForm(block);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('it-request-form: failed to build form', e);
    return;
  }

  const form = block.querySelector('form');
  if (!form) return;

  // fieldsets are only for grouping; drop their name so it isn't submitted
  form.querySelectorAll('fieldset[name]').forEach((fieldset) => fieldset.removeAttribute('name'));

  // Style "checked" on a radio/checkbox row pre-selects it
  form.querySelectorAll('.selection-wrapper.checked input').forEach((input) => {
    input.checked = true;
  });
}
