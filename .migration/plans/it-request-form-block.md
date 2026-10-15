# IT Request Form block plan

> **Ready to build, but this session is still in Plan mode.** Plan mode can't change files. **Switch the session to Execute mode** and say "go ahead", and I'll build the block first, as you asked. Your sheet edits can come later.

## Order of work (updated)
1. **Build the custom block now.** It only needs the sheet you have today.
2. **Test it both ways without touching your content:**
   - With your **current** sheet, to confirm it renders, submits and doesn't break.
   - With a **corrected copy** of the sheet that exists only in the test browser, to confirm the mockup layout. Nothing is saved to your site content.
3. **You update the sheet later** using the rows below. The form then picks up the mockup layout with no code changes.

**What to expect on the live page until the sheet is updated:**
- The form renders inside the mockup's card, with the title, blue Proceed button, input styling and required asterisks.
- Fields stack full width because no layout classes exist yet.
- `repOrVir` appears as a single checkbox.
- State is a text box.
- Placeholders show as authored ("Last Name*" and so on).
- Office Location's options are split at each comma, so "US Headquarters (Deerfield, IL)" appears as two entries.

## Current state (checked)
- **The `ema` branch on GitHub** has `blocks/form/` (`form.js`, `form-fields.js`, `form.css`, `form-tokens.css`, `_form.json`). It also has `blocks/it-request-form/` with **empty** `it-request-form.js` and `it-request-form.css` files. My local copy is behind, so the first step is pulling `ema`.
- **The page** `/lu-launch/it-request` is previewed and published on `ema`. Its **IT Request Form** block has two rows:
  - Sign Up Form Sheet URL: `https://main--trb-eds-prep--tusharb-dgs.aem.live/lu-launch/it-request-sheet.json`
  - Endpoint: `https://www.vyeptihcp.com/api/registration`
- **Your decision:** the sheet's values apply as authored. The block won't override them in code. Wherever the sheet doesn't match the mockup, the sheet gets corrected (rows below).

## How the base form block behaves
Everything below is from the base code on `ema`:

| Behavior | Effect on this form |
|---|---|
| `form.js` only accepts a sheet link from the **same site as the page**. | The authored `main--…aem.live` link fails on `ema--…aem.page`, on the preview host and locally. **The custom block must rewrite the link to the current site.** This is the only change it makes before the base code runs. |
| All `form.css` rules only apply inside `.form …`. | The custom block adds the `form` class to itself so the base styles apply. Its own CSS then adds the mockup look on top. |
| `form.css` limits inputs to 50vw on tablet and 33vw on desktop. | Remove this limit inside the IT Request Form, because fields have to fill their grid columns. |
| `Style` becomes the field wrapper's class. | Layout comes from the sheet, using classes like `col-6`, `col-3` and `inline` that the block's CSS defines. |
| `Fieldset` groups fields inside a `<fieldset>` with the `Label` as its legend. | The Yes/No question and Office Location share one group, as in the mockup's first row. |
| `radio`: one input per row, and its value is `Value` (or `Label` if `Value` is empty). | Yes and No are two `radio` rows with the same `Name`. |
| `select`: `Options` are split on commas, or loaded from another sheet when they start with `https://` (columns `Option`/`Value`). | **Office names contain commas**, so they need their own small options sheet. US states have no commas, so they can stay inline. |
| `select` placeholder: a disabled first option, pre-selected when `Value` is empty. | State shows "--Select--" and is required. Office Location has no placeholder, so the first office is shown. |
| Required fields: `Mandatory` = `TRUE`/`x` marks the field required and shows a red asterisk. | Already in the sheet. |
| Nothing in the sheet can mark a radio as selected by default. | **One small addition:** a `checked` value in a radio's `Style` pre-selects that radio. |

## What the block's code and styles provide
| Area | Source |
|---|---|
| Field types, labels, names, placeholders, required flags, options, default values, order | The sheet only, rendered by the base `form-fields.js` |
| Building the form, submitting, validation, and focusing the first invalid field | The base `form.js` |
| Column widths, inline rows and grouping | The sheet's `Style` and `Fieldset` values, which map to the custom block's CSS classes |
| Card frame, title, blue question, bold radio labels, input look, centered blue Proceed button, mobile stacking | The custom block's CSS (the look of the form) |

**Style classes the block's CSS supports**, documented in the README:
- `col-1` to `col-12`: column span on a 12-column grid. Rows with no Style span the full width.
- `inline`: the label sits beside its control. On a fieldset, its fields sit in one row.
- `checked`: pre-selects a radio or checkbox.
- `sub-heading`: makes a heading smaller (`h3`). This one already exists in the base code.

## Files
| File | Action |
|---|---|
| `blocks/form/*` | **No changes.** The custom block imports `form.js` and `form.css`. |
| `blocks/it-request-form/it-request-form.js` | Fill in the empty file: add the `form` class, rewrite the sheet link to the current site, call the base `decorate` from `../form/form.js`, then apply `checked` to the matching radios and checkboxes. About 20 lines. |
| `blocks/it-request-form/it-request-form.css` | Fill in the empty file: `@import url('../form/form.css');`, then the grid, `col-*`, `inline` and card/title/legend/input/button styles from the mockup, all scoped to `.it-request-form`, plus a single-column layout below 600px. |
| `blocks/it-request-form/README.md` | New. Authoring rows, sheet columns, Style classes, the office options sheet, and the state list to paste. It also notes the cross-block import, which you asked for even though `AGENTS.md` discourages it. |

## Look from the mockup (CSS targets)
- **Card:** about 800px wide and centered, white, 1px `#ddd` border, soft shadow, about 20–24px padding.
- **Title (`h2`):** centered, `#333`, about 22px, normal weight.
- **Question (legend):** `#00539b`, about 18px.
- **Radio labels:** bold, `#555`, about 14px. The "Office Location" label is bold beside its dropdown, which is about 410px wide.
- **Field labels:** about 14px, `#333`, with a small red raised asterisk for required fields.
- **Inputs and selects:** about 34px tall, 1px `#ccc` border, 3px corner radius. The State dropdown has a light grey background.
- **Proceed button:** centered, `#00539b` background, 2px `#003a70` border, white text, square corners, about 96×36px.

## Checklist
### Build (now)
- [ ] Pull the latest `ema` into the local copy (brings in `blocks/form/` and the empty `it-request-form` files)
- [ ] Confirm the base `form.css` doesn't depend on a `.form-container` section class. Adjust the custom CSS if it does.
- [ ] Write `it-request-form.js`:
  - [ ] Add the `form` class to the block
  - [ ] Rewrite `.json` links to the current site (keep path and query)
  - [ ] `await` the base `decorate(block)` from `../form/form.js`
  - [ ] If the form didn't render (missing links or a failed fetch), exit without errors
  - [ ] Pre-select inputs inside `.selection-wrapper.checked`
- [ ] Write `it-request-form.css`: 12-column grid, `col-*`, `inline`, card, title, legend, labels, inputs, button, and the under-600px stack; remove the base 50vw/33vw input limit
- [ ] Write `README.md` with the sheet rows, Style classes, office options sheet and the 51-state list
- [ ] Run `npm run lint` and fix any issues

### Test with your current sheet
- [ ] `/lu-launch/it-request` loads with no 404s for `/blocks/form/*` or `/blocks/it-request-form/*`, and the sheet JSON loads
- [ ] The form renders with the card, title, styled inputs, required asterisks and the blue Proceed button; no console errors from the block
- [ ] Submitting empty flags the required fields and focuses the first one

### Test with the corrected sheet (in the test browser only, no content saved)
- [ ] In the test browser, swap in the corrected sheet and office options shown below, so nothing is written to your site
- [ ] Desktop layout matches the mockup: Yes/No + Office Location row, 6/6 address row, 6/3/3 City/State/ZIP row, centered button
- [ ] The two radios have different ids, so clicking the "No" label selects No. If the generated ids clash, add an `Id` column for the radios and say so in the README.
- [ ] Stacks to one column at 393px
- [ ] A valid submit posts `{ data: { repOrVir, ol, address1, address2, city, state, zip } }`. Report whether vyeptihcp accepts it or blocks it as a cross-site (CORS) request.
- [ ] Take one final screenshot next to the mockup

### Hand-off
- [ ] Commit to `ema`, then confirm with you before pushing. Include the `ema--trb-eds-prep--tusharb-dgs.aem.page/lu-launch/it-request` link for the PR.

## Sheet changes for you to make later
**1. `it-request-sheet`:** add a **Fieldset** column, then update the rows to:

| Type | Name | Label | Placeholder | Value | Mandatory | Options | Style | Fieldset |
|---|---|---|---|---|---|---|---|---|
| heading | formTitle | IT Equipment Purchase | | | | | | |
| fieldset | employee | Are you a Field Representative or Virtual Employee? | | | | | inline | |
| radio | repOrVir | Yes | | Yes | | | checked | employee |
| radio | repOrVir | No | | No | | | | employee |
| select | ol | Office Location | | | | `https://main--trb-eds-prep--tusharb-dgs.aem.live/lu-launch/office-locations.json` | inline | employee |
| text | address1 | Address line 1 | | | TRUE | | col-6 | |
| text | address2 | Address line 2 | | | | | col-6 | |
| text | city | City | | | TRUE | | col-6 | |
| select | state | State | --Select-- | | TRUE | Alabama,Alaska,Arizona,…,Wyoming (all 50 + District of Columbia; full list in the README) | col-3 | |
| text | zip | ZIP Code | | | TRUE | | col-3 | |
| submit | submitBtn | Proceed | | Proceed | | | | |

**2. A new sheet, `/lu-launch/office-locations`,** with one column, **Option**:

| Option |
|---|
| US Headquarters (Deerfield, IL) |
| Lundbeck La Jolla Research Center (San Diego, CA) |
| Lundbeck Seattle BioPharmaceuticals, Inc. (Bothell, WA) |

Preview and publish both sheets after editing.

## Notes
- **Endpoint:** if `vyeptihcp.com/api/registration` blocks cross-site requests from the browser, the error appears in the console. The server has to allow requests from the site's hosts, or you can use `https://httpbin.org/post` for testing.
- **Not in scope:** the footer and header icon 404s (`/icons/` only has `search.svg`). This can be a separate task.
- **Building this requires Execute mode.**
