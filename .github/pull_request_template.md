## Summary

<!-- What changed and why -->

## Verification

<!-- Commands run and their outcomes. State anything skipped and why. -->

## Checklist

- [ ] `pnpm check` · `pnpm lint` · `pnpm test` pass locally, `pnpm format` applied
- [ ] Content changes reviewed against the [publishing checklist](../PUBLISHING.md), and the
      `writer` skill was invoked before writing (skip both for code-only PRs)
- [ ] New utils/stores/services carry a colocated `*.test.ts`
- [ ] No hardcoded colour, size, radius, shadow, duration, or spacing — tokens from
      `app.css` only
- [ ] Any new external origin (fetch/fonts/images) added to the CSP in `svelte.config.js`;
      `csp.test.ts` still passes
- [ ] If `app.html`'s inline theme script changed, its sha256 in the CSP was recomputed
