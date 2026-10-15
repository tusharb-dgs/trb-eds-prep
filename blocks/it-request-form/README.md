# IT Request Form

Styled variant of the generic `form` block ("IT Equipment Purchase" card). It imports
`blocks/form/form.js` and `blocks/form/form.css` rather than copying them, so the base form
handles rendering, validation and submission. (This is a deliberate exception to the
"only `fragment.js` is imported across blocks" rule.)

## Authoring

Same two rows as the `form` block; the first cell of each row is an optional label.

| IT Request Form | |
|---|---|
| Sign Up Form Sheet URL | `https://main--trb-eds-prep--tusharb-dgs.aem.live/lu-launch/it-request-sheet.json` |
| Endpoint | `https://www.vyeptihcp.com/api/registration` |

Absolute sheet links on another host (aem.page / aem.live) are rewritten to the current site,
so the same page works locally, on preview and on live. The endpoint must accept a cross-origin
JSON `POST` of `{ "data": { ... } }`.

## Sheet columns

`Type`, `Name`, `Label`, `Placeholder`, `Value`, `Mandatory` (`TRUE`/`x`), `Options`, `Style`,
`Fieldset` — see `blocks/form/form-fields.js` for supported types.

- `select` options: comma list, or an `https://…json` sheet URL with an `Option` (and optional
  `Value`) column. Use a sheet when option text contains commas.
- `select` with a `Placeholder` and empty `Value` shows the placeholder as a disabled first choice.
- `fieldset` rows group following rows whose `Fieldset` equals the fieldset's `Name`.

## Style classes

| Class | Effect |
|---|---|
| `col-1` … `col-12` | Column span on a 12-column grid from 600px up (full width when omitted) |
| `inline` | Label beside its control; on a `fieldset`, its fields sit in one row |
| `checked` | Pre-selects a radio / checkbox |
| `sub-heading` | `h3` instead of `h2` for a `heading` row (base form behavior) |

Combine with spaces, e.g. `inline col-6`.

## Sheet matching the design

`it-request-sheet`:

| Type | Name | Label | Placeholder | Value | Mandatory | Options | Style | Fieldset |
|---|---|---|---|---|---|---|---|---|
| heading | formTitle | IT Equipment Purchase | | | | | | |
| fieldset | employee | Are you a Field Representative or Virtual Employee? | | | | | inline | |
| radio | repOrVir | Yes | | Yes | | | checked | employee |
| radio | repOrVir | No | | No | | | | employee |
| select | ol | Office Location | | | | https://main--trb-eds-prep--tusharb-dgs.aem.live/lu-launch/office-locations.json | inline | employee |
| text | address1 | Address line 1 | | | TRUE | | col-6 | |
| text | address2 | Address line 2 | | | | | col-6 | |
| text | city | City | | | TRUE | | col-6 | |
| select | state | State | --Select-- | | TRUE | *(state list below)* | col-3 | |
| text | zip | ZIP Code | | | TRUE | | col-3 | |
| submit | submitBtn | Proceed | | Proceed | | | | |

`office-locations` (column `Option`):

- US Headquarters (Deerfield, IL)
- Lundbeck La Jolla Research Center (San Diego, CA)
- Lundbeck Seattle BioPharmaceuticals, Inc. (Bothell, WA)

State `Options` value:

```
Alabama,Alaska,Arizona,Arkansas,California,Colorado,Connecticut,Delaware,District of Columbia,Florida,Georgia,Hawaii,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Ohio,Oklahoma,Oregon,Pennsylvania,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virginia,Washington,West Virginia,Wisconsin,Wyoming
```

Submitted payload: `{ "data": { "repOrVir", "ol", "address1", "address2", "city", "state", "zip" } }`.
