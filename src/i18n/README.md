# i18n Structure

## Goal
- `messages/` is the structured translation source for app content.
- `ui-translations/` is the phrase map for legacy/shared raw UI text.
- Add a new language by adding one file in each place you need.

## Add A New Language
1. Add the language code to `APP_LANGUAGES`.
2. Create `src/i18n/messages/<lang>.ts`.
3. Register it in `src/i18n/dictionaries.ts`.
4. If the new language should also translate raw labels like `Create Driver`, `Search...`, `Vehicle KPL`, create `src/i18n/ui-translations/<lang>.ts`.
5. Register it in `src/i18n/ui.ts`.

## Which File To Edit
- If code uses `t('namespace', 'key')` or `dictionary.namespace.key`: edit `messages/<lang>.ts`.
- If code passes raw text like `label="Vehicle KPL"` or `title="Search..."`: edit `ui-translations/<lang>.ts`.

## Enterprise Rule
- New feature code should prefer `t('namespace', 'key')` or `dictionary.namespace.key`.
- Navigation labels, page titles, section headings, product copy, status labels, and domain text should go to `messages/<lang>.ts`.
- `ui-translations/<lang>.ts` is for raw shared UI strings, legacy literals, and generic component labels that are still passed as plain text.
- Do not add new product-facing copy to `ui-translations` if you can reasonably give it a real message key.
- Treat `ui-translations` as a compatibility and migration layer, not the primary source of truth.

## Decision Guide
- Use `messages/<lang>.ts` when the text has semantic meaning in the product.
- Use `messages/<lang>.ts` when the text belongs to a known namespace like `header`, `footer`, `admin`, `pages`, `blog`, or a future domain namespace.
- Use `messages/<lang>.ts` when you want strong translator context and long-term maintainability.
- Use `ui-translations/<lang>.ts` when a shared component currently receives a raw string literal and refactoring it to `t(...)` is not practical right now.
- Use `ui-translations/<lang>.ts` for strings like `Search...`, `Create Driver`, `Edit`, `Delete`, `Vehicle KPL`, and similar direct labels passed into reusable components.

## Example
- Good structured usage:
```ts
const navLinks = [
  { name: t('header', 'home'), href: '/' },
  { name: t('header', 'about'), href: '/about-us' },
]
```
- This belongs in `messages/<lang>.ts` because it is product navigation content.

- Legacy/shared UI usage:
```tsx
<TextInput label="Vehicle KPL" placeholder="Vehicle KPL" />
```
- This belongs in `ui-translations/<lang>.ts` because the component receives raw literals.

## Example
- `label="Vehicle KPL"` in a form:
  - add `'Vehicle KPL': '...'` in `ui-translations/<lang>.ts`
- `t('admin', 'dashboard')`:
  - add `dashboard: '...'` in `messages/<lang>.ts`

## Rule
- Keep all keys and object structure identical to English.
- Translate values only.
- Keep placeholders like `{{count}}` unchanged.

## Migration Rule For Legacy Raw Strings
- Do not block delivery by rewriting every old component to `t(...)` immediately.
- If an existing component already uses raw labels, add the missing text to `ui-translations/<lang>.ts`.
- If you are building or heavily refactoring a feature, move important product copy to `messages/<lang>.ts` instead of adding more raw literals.
- Over time, reduce dependency on `ui-translations` by replacing raw strings with explicit translation keys.
