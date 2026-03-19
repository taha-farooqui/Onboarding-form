# Spacing & Font Size Consistency Audit

Full analysis of all spacings and font sizes across the multi-step form.

---

## Font Size Tokens (from :root)

| Token | Default | 1919px | 1799px | 1399px | 1024px | 767px | 479px |
|---|---|---|---|---|---|---|---|
| `--alpha-heading-h4` | 32px | 30px | 28px | 26px | 24px | 22px | 20px |
| `--alpha-heading-h5` | 24px | 24px | 22px | 20px | 20px | 18px | 16px |
| `--alpha-body-large` | 32px | 30px | 28px | 24px | 22px | 20px | 18px |
| `--alpha-body-medium` | 24px | 24px | 22px | 20px | 18px | 18px | 16px |
| `--alpha-body-small` | 20px | 20px | 18px | 18px | 18px | 16px | 15px |
| `--alpha-body-xs` | 16px | 16px | 15px | 15px | 14px | 14px | 13px |

---

## Font Sizes by Element

### Consistent (using design tokens)

| Element | Token | Status |
|---|---|---|
| `.step-title` | `--alpha-heading-h4` | OK |
| `.step-description` | `--alpha-body-xs` | OK |
| `.step-hint` | `--alpha-body-xs` | OK |
| `.field-label` | `--alpha-body-xs` | OK |
| `.field-hint` | `--alpha-body-xs` | OK |
| `.field-subsection` | `--alpha-body-xs` | OK |
| `.field-input / .field-textarea / .field-select` | `--alpha-body-xs` | OK |
| `.custom-select-value` | `--alpha-body-xs` | OK |
| `.custom-select-option` | `--alpha-body-xs` | OK |
| `.option-card` | `--alpha-body-xs` | OK |
| `.btn` | `--alpha-body-xs` | OK |
| `.btn-back` | `--alpha-body-xs` | OK |
| `.info-box` | `--alpha-body-xs` | OK |
| `.upload-label` | `--alpha-body-xs` | OK |
| `.phone-code` | `--alpha-body-xs` | OK |
| `.country-search` | `--alpha-body-xs` | OK |
| `.country-item` | `--alpha-body-xs` | OK |
| `.btn-add-row` | `--alpha-body-xs` | OK |
| `.field-error` | `--alpha-body-xs` | OK |
| `.intro-footer-contact` | `--alpha-body-xs` | OK |
| `.thankyou-contact` | `--alpha-body-xs` | OK |
| `.intro-checklist li` | `--alpha-body-small` | OK |
| `.form-shell.is-intro .btn-next` | `--alpha-body-medium` | OK |

### INCONSISTENT (hardcoded values)

| Element | Value | Issue | Fix |
|---|---|---|---|
| `.upload-formats` | `12px` | Hardcoded, won't scale with breakpoints | Consider a smaller token or keep as-is (decorative helper text) |
| `.upload-file-item` | `13px` | Hardcoded, won't scale | Should use `--alpha-body-xs` for consistency |
| `.option-key` | `12px` | Hardcoded | Acceptable — decorative keyboard shortcut badge |
| `.user-row-remove` | `18px` | Hardcoded | Acceptable — icon-like button |
| `.upload-file-remove` | `16px` | Hardcoded | Acceptable — icon-like button |
| `@media 600px .option-card` | `13px` | Hardcoded override | Should scale via token, not hardcode |

---

## Spacing Analysis

### Layout Spacing

| Element | Property | Value | Notes |
|---|---|---|---|
| `.form-shell` | padding | `0 1.5rem` | Horizontal page padding |
| `.form-card` | padding | `2.5rem 2.5rem 1rem` | Card padding |
| `.form-card` (tablet) | padding | `2rem 2rem 1rem` | Consistent scale-down |
| `.form-card` (mobile) | padding | `1.5rem 1.25rem 0.75rem` | Consistent scale-down |
| `.form-card` | margin | `2rem 0` | Vertical breathing room |
| `.form-main` | padding | `0.5rem 0 0` | Top space below header |
| `.form-footer` | padding | `1.5rem 0 0.5rem` | Space above/below buttons |

### Section Spacing

| Element | Property | Value | Notes |
|---|---|---|---|
| `.step-content` | gap | `1.75rem` | Between field groups |
| `.intro-content` | gap | `2rem` | Intro screen has more breathing room |
| `.step-heading` | gap | `0.5rem` | Title to description |
| `.step-heading` | padding-bottom | `0.5rem` | Heading to first field group |
| `.form-card-header` | gap | `1.25rem` | Logo to progress dots |
| `.form-card-header` | padding-bottom | `1.5rem` | Header to content below |
| `.form-card-header` | margin-bottom | `0.5rem` | Additional header spacing |

### Field Group Internal Spacing

| Element | Property | Value | Notes |
|---|---|---|---|
| `.field-group` | gap | `0.7rem` | Between label → input/options → error |
| `.field-hint` | margin-top | `-0.2rem` | Reduces label→hint gap to ~0.5rem |
| (hint → options/input) | effective | `0.7rem` | Natural gap after hint |
| `.options-grid` | gap | `0.5rem` | Between option cards |
| `.user-list` | gap | `0.5rem` | Between user rows |

### Input Padding (vertical x horizontal)

| Element | Padding | Status |
|---|---|---|
| `.field-input` / `.field-select` | `0.65rem 0.9rem` | BASELINE |
| `.field-textarea` | `0.75rem 1rem` | DIFFERENT — slightly larger |
| `.custom-select-trigger` | `0.65rem 0.9rem` | Matches baseline |
| `.option-card` | `0.6rem 1rem` | DIFFERENT — vertical 0.6 vs 0.65 |
| `.phone-prefix` | `0.65rem 0.75rem` | Matches vertical, different horizontal |
| `.intro-checklist li` | `0.65rem 1rem` | Matches vertical |
| `.user-row .field-input` | `0.55rem 0.8rem` | DIFFERENT — compact variant |
| `.user-role-select .custom-select-trigger` | `0.55rem 0.8rem` | Matches user-row compact |
| `.btn-add-row` | `0.6rem 1rem` | DIFFERENT — close to option-card |
| `.custom-select-option` | `0.75rem 1rem` | Matches textarea |
| `.country-search` | `0.5rem 0.7rem` | Compact — inside dropdown |
| `.country-item` | `0.5rem 0.75rem` | Compact — inside dropdown |
| `.upload-file-item` | `0.5rem 0.75rem` | Compact — inside upload list |
| `.btn` | `0.75rem 2rem` | Button — distinct spacing |

### Component Internal Gaps

| Element | Property | Value |
|---|---|---|
| `.intro-heading` | gap | `0.75rem` |
| `.intro-checklist` | gap | `0.6rem` |
| `.info-box` | gap | `0.5rem` |
| `.upload-zone` | gap | `1rem` |
| `.upload-content` | gap | `0.4rem` |
| `.upload-files` | gap | `0.4rem` |
| `.user-row` | gap | `0.75rem` |
| `.intro-footer-contact` | gap | `0.4rem` |
| `.thankyou-contact` | gap | `0.4rem` |

---

## Border Consistency

### Border Width

| Element | Border | Status |
|---|---|---|
| `.field-input` / `.field-select` | `1.5px solid var(--border-field)` | BASELINE |
| `.field-textarea` | `1.5px solid #d5d5d5` | INCONSISTENT — uses hardcoded color instead of `var(--border-field)` |
| `.custom-select-trigger` | `1.5px solid var(--border-field)` | OK |
| `.custom-select-dropdown` | `1.5px solid var(--border-field)` | OK |
| `.option-card` | `1.5px solid var(--border-field)` | OK |
| `.phone-wrapper` | `1.5px solid var(--border-field)` | OK |
| `.country-dropdown` | `1.5px solid var(--border-field)` | OK |
| `.country-search` | `1.5px solid var(--border-field)` | OK |
| `.upload-zone` | `1.5px dashed #d5d5d5` | INCONSISTENT — hardcoded color (dashed is intentional) |
| `.btn-add-row` | `1.5px dashed #d5d5d5` | Same as upload-zone |
| `.user-row` | `1.5px solid var(--border-color)` | Uses `--border-color` (rgba) not `--border-field` |
| `.upload-file-item` | `1px solid var(--border-color)` | Thinner — `1px` not `1.5px` |
| `.intro-checklist li` | `1px solid var(--border-color)` | Thinner — `1px` |
| `.info-box` | `1px solid var(--border-color)` | Thinner — `1px` |

**Note:** Two border color tokens are used:
- `--border-field: #e0e0e0` — for interactive form elements
- `--border-color: rgba(8, 8, 10, 0.08)` — for containers/decorative borders
- `#d5d5d5` is hardcoded in `.field-textarea`, `.upload-zone`, `.btn-add-row` — should use `--border-field`

### Border Radius

| Element | Radius | Status |
|---|---|---|
| `.field-input` / `.field-select` | `8px` | BASELINE |
| `.field-textarea` | `8px` | OK |
| `.custom-select-trigger` | `8px` | OK |
| `.option-card` | `8px` | OK |
| `.phone-wrapper` | `8px` | OK |
| `.user-row` | `8px` | OK |
| `.btn-add-row` | `8px` | OK |
| `.intro-checklist li` | `8px` | OK |
| `.custom-select-dropdown` | `10px` | DIFFERENT — dropdown panels use 10px |
| `.country-dropdown` | `10px` | Same as above |
| `.upload-zone` | `12px` | INCONSISTENT — should be 10px or 8px |
| `.upload-file-item` | `6px` | Smaller — nested element |
| `.country-search` | `6px` | Smaller — nested element |
| `.btn` | `99px` | Pill shape — intentional |

---

## Issues Found (Ranked by Impact)

### Must Fix

1. **`.field-textarea` border color** — Uses `#d5d5d5` instead of `var(--border-field)` (#e0e0e0). Visually different from text inputs.

2. **`.upload-file-item` font size** — Hardcoded `13px` doesn't scale with breakpoints. Should use `--alpha-body-xs`.

3. **`@media 600px .option-card` font size** — Hardcoded `13px` override breaks the token system.

### Should Fix

4. **`.upload-zone` border color** — Hardcoded `#d5d5d5` instead of `var(--border-field)`.

5. **`.btn-add-row` border color** — Same hardcoded `#d5d5d5`.

6. **`.upload-zone` border radius** — `12px` while all other form elements use `8px`.

7. **`.field-textarea` padding** — `0.75rem 1rem` vs input baseline `0.65rem 0.9rem`. The vertical difference (0.75 vs 0.65) makes textareas look slightly taller per-line than inputs.

8. **`.option-card` vertical padding** — `0.6rem` vs input baseline `0.65rem`. Very close but not identical.

### Acceptable Variations

- `.user-row` internals use compact padding (`0.55rem 0.8rem`) — intentional for dense rows
- Dropdown items (`.country-item`, `.custom-select-option`) have their own padding — intentional for list UX
- `.upload-formats` at `12px` — helper text, intentionally smaller
- `.option-key` at `12px` — decorative badge
- `.intro-content` gap `2rem` vs `.step-content` `1.75rem` — intro intentionally more spacious

---

## Summary

The form is **mostly consistent**. The design token system (`--alpha-body-xs`, `--alpha-heading-h4`, etc.) is used well across all major text elements. The main issues are:

- **3 hardcoded border colors** (`#d5d5d5`) that should use `var(--border-field)`
- **2 hardcoded font sizes** (`13px`) that should use tokens
- **1 border-radius outlier** (`.upload-zone` at `12px`)
- **Minor padding differences** between textarea/option-card and the input baseline
