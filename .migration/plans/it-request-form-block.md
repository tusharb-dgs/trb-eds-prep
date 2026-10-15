# IT Request Form block plan

> **Why your page isn't working:** nothing has been built yet. This session is still in Plan mode, which can't change files, so none of the code in this plan exists on the `ema` branch. **Switch the session to Execute mode** and say "go ahead", and I'll work through the checklist below.

## What your screenshot shows
I compared the console errors with the project:

| Error | Cause | Fix in this plan |
|---|---|---|
| `failed to load module for form … /blocks/form/form.js` (404) and `Refused to apply style … /blocks/form/form.css` (MIME type `text/html`) | The page uses a **Form** block, but `blocks/form/` doesn't exist on `ema`. It's only on `main`. The preview runs this branch's code, so both files return a 404 page. | Checklist step 1: copy `blocks/form/` from `main` |
| The block shows as plain text ("Sign Up Form Sheet URL" plus two links) | The block's code never loaded, so the authored rows display as they are | Fixed once the block code exists |
| Even with `form.js` present, the plain **Form** block would still do nothing | `form.js` only accepts a sheet link from the **same site as the page**. The page runs on `preview-aemcoder.adobe.io`, but the link points to `main--trb-eds-prep--tusharb-dgs.aem.live`, so `form.js` stops without an error. | The **IT Request Form** block rewrites the sheet link to the current site before building the form |
| 404s for `footer-facebook.svg`, `logo-vyepti.png`, `icon-savings.svg` and others | Not related to the form. `/icons/` only has `search.svg`, so the footer and header icons the content refers to are missing. | Out of scope. Listed under Notes as a follow-up. |

**One change on your side:** the page's block is named **Form**. To get the IT Equipment Purchase layout, rename the block to **IT Request Form** and keep the same two rows. The row labels ("Sign Up Form Sheet URL", "Endpoint") are fine because the block only reads the links.

**About your endpoint:** your page uses `https://www.vyeptihcp.com/api/registration`. A browser on another site can only post to it if that server allows cross-site requests, and many don't. If submitting fails with a blocked-request (CORS) error, use `https://httpbin.org/post` to test until the real endpoint allows it.

## Goal
Add a custom **IT Request Form** block (`it-request-form`) that renders the "IT Equipment Purchase" layout from your mockup. The generic `form` block is copied unchanged from `main`, as you asked. The custom block then imports and reuses those files and doesn't duplicate any of their code. Authors give it the same two values as the original form:
1. The form sheet JSON URL: `https://main--trb-eds-prep--tusharb-dgs.aem.live/lu-launch/it-request-sheet.json`
2. The submit endpoint: your `https://www.vyeptihcp.com/api/registration`, or `https://httpbin.org/post` for testing

## What I found
- **The form block is only on `main`.** On `main`, `blocks/form/` contains `form.js`, `form-fields.js`, `form.css`, `form-tokens.css` and `_form.json`.
  - `form.js` exports only `decorate(block)`. It reads two links from the block: a same-site `.json` link (the sheet) and any other link (the endpoint). It builds the form, then posts `{ data: {...} }` as JSON.
  - `form-fields.js` exports `createField(fd, form)`. It supports these types: `select`, `heading`, `plaintext`, `text-area`, `toggle`, `submit`, `confirmation`, `fieldset`, `checkbox` and `radio`. Any type not in that list, such as `text`, becomes an input of that type. Each field gets a `field-wrapper {type}-wrapper` wrapper. The `Style` column sets the wrapper's class, and `Mandatory` counts as required when it's `TRUE` or `x`.
- **The sheet doesn't match the mockup.** You chose to handle the differences in the block code and leave the sheet unchanged:

  | Sheet row | Sheet says | Mockup needs | Handling in the custom block |
  |---|---|---|---|
  | `repOrVir` | `checkbox`, no options | Blue question + Yes/No radios, Yes selected | Replace with a group: the question as a heading plus two radios built with `createField` (`Type: radio`, values Yes/No) |
  | `ol` (Office location) | select, placeholder "City" | Same row as the radios, first office pre-selected | Remove the "City" placeholder, select the first option, put it on the radio row |
  | `state` | `text` | Dropdown with "--Select--" | Rebuild with `createField` as a required `select` listing US states, with "--Select--" as the placeholder |
  | `address1`, `address2`, `city` | Placeholders like "Last Name*", "Email Address*" | Empty inputs | Remove the placeholders |
  | `zip` | text | Narrow input | Layout only |
- **Your choice:** all fields always show. Nothing is hidden or shown based on the Yes/No answer.
- **Conflict with the project rules:** `AGENTS.md` says `fragment.js` is the only file one block may import from another. You explicitly asked to import the form block's files, so I'll follow your request and note the two imports in the block README.

## Layout (from the mockup)
- **Card:** centered, about 800px wide, white background, thin light-grey border, soft shadow, generous padding.
- **Title:** "IT Equipment Purchase", centered, dark grey, about 22px, normal weight.
- **Question:** blue (about `#00539b`), about 18px, left-aligned.
- **Row 1:** `● Yes  ○ No` (bold labels), then "Office Location" (bold label) and the dropdown on the same row.
- **Row 2:** Address line 1 \* | Address line 2 (equal halves).
- **Row 3:** City \* (half) | State \* (dropdown) + ZIP Code \* (narrow), sharing the other half.
- **Required marker:** small red asterisk after the label, using the base form's existing style.
- **Proceed button:** centered, solid blue with a darker blue border, white text, square corners.
- **Mobile (under 600px):** every field stacks in one column, and the radios wrap above Office Location.

## Files
| File | Action |
|---|---|
| `blocks/form/*` (5 files) | Copy unchanged from `main`. No edits. This fixes the `form.js`/`form.css` 404s. |
| `blocks/it-request-form/it-request-form.js` | New. Imports `decorate` from `../form/form.js` and `createField` from `../form/form-fields.js`. Rewrites the sheet link to the current site, runs the base form, then reshapes the fields as described above. |
| `blocks/it-request-form/it-request-form.css` | New. Loads `../form/form.css` and adds the card, grid and button styles, scoped to `.it-request-form`. If the base styles only apply to `.form`, the block will also get the `form` class so they still apply. |
| `blocks/it-request-form/README.md` | New. How to author the block, the sheet columns it expects, and the sheet differences it handles. |

## How authors use it
Rename the block on your `/lu-launch/it-request` page from **Form** to **IT Request Form**:

| IT Request Form |
|---|
| Sign Up Form Sheet URL: `https://main--trb-eds-prep--tusharb-dgs.aem.live/lu-launch/it-request-sheet.json` |
| Endpoint: `https://www.vyeptihcp.com/api/registration` |

## Checklist
- [ ] Fetch `main` and copy `blocks/form/` (all 5 files) into `ema` unchanged
- [ ] Check the copied `form.css` to see whether its styles only apply to `.form`, and choose how to load it
- [ ] Create `blocks/it-request-form/it-request-form.js`:
  - [ ] Rewrite the sheet link to the current site (path only), then call the base form's `decorate`
  - [ ] Turn `repOrVir` into the question heading plus Yes/No radios, with Yes selected
  - [ ] Office location: remove the placeholder, select the first option, put it on the radio row
  - [ ] Rebuild `state` as a required US-states dropdown with a "--Select--" placeholder
  - [ ] Remove the placeholders that don't fit from the address and city fields
  - [ ] Add the layout classes and row groups for the grid
  - [ ] Handle missing links: if either link is missing, exit without breaking the page
- [ ] Create `blocks/it-request-form/it-request-form.css` with the card, title, question, grid, required marker, button and mobile styles
- [ ] Write `blocks/it-request-form/README.md`
- [ ] Run `npm run lint` and fix any issues
- [ ] Test in the preview:
  - [ ] `/blocks/form/form.js` and `/blocks/form/form.css` load with no 404s
  - [ ] The sheet JSON loads from the current site
  - [ ] Layout matches the mockup on desktop and stacks on mobile (393px, as in your screenshot)
  - [ ] Submitting empty highlights the required fields (Address line 1, City, State, ZIP) and moves focus to the first one
  - [ ] A valid submit sends `{ data: { repOrVir, ol, address1, address2, city, state, zip } }`. Check whether the vyeptihcp endpoint accepts it. If it's blocked as a cross-site request, confirm the submit works with `https://httpbin.org/post` instead.
- [ ] Take one final screenshot to compare against the mockup
- [ ] Wait for your go-ahead before committing or pushing to `ema`. A PR needs an `ema--trb-eds-prep--tusharb-dgs.aem.page/lu-launch/it-request` preview link.

## Notes
- **Your part:** rename the page's block from **Form** to **IT Request Form**, and re-preview the page after the code is pushed.
- Leave the sheet as it is. If you later change `repOrVir` or `state` in the sheet, the block's adjustments can be removed.
- **Separate follow-up, not in this plan:** the footer and header icon 404s (`footer-*.svg`, `social-*.svg`, `logo-vyepti.png`, `icon-*.svg`) happen because `/icons/` only contains `search.svg`. I can add those icons as a separate task if you want.
- **Building this requires Execute mode.** Once the session is in Execute mode, say "go ahead" and I'll start with the first checklist item.
