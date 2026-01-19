# zhaoyu.io Documentation

Welcome to the zhaoyu.io portfolio site documentation. This directory contains comprehensive guides to help you understand, navigate, and develop the portfolio site with confidence.

> **Project**: SvelteKit portfolio site for zhaoyu.io

## For New AI Chats

**Quick onboarding for AI assistants working on this codebase:**

### Essential Rules (Always Applied)

These rules are automatically applied to all code changes:

1. **[Utilities Check Rule](.cursor/rules/utilities.mdc)** - **MANDATORY**: Always check `src/lib/utils/` before writing new utility functions to avoid duplication
2. **[Code Quality](.cursor/rules/code-quality.mdc)** - **MANDATORY**: All code must pass tests and lint before completion
3. **[Refactoring Standards](.cursor/rules/refactoring.mdc)** - **MANDATORY**: 90% test coverage and zero lint issues for refactoring

### Key Documentation

- **[Quick Reference](QUICK_REFERENCE.md)** - Common paths, commands, and patterns
- **[File Organization](FILE_ORGANIZATION.md)** - Complete directory structure and navigation
- **[Patterns](PATTERNS.md)** - Code examples for components, stores, routes, API endpoints
- **[Coding Conventions](CODING_CONVENTIONS.md)** - Code style, naming, and structure standards

### Project Structure Overview

```
src/
├── lib/
│   ├── components/    # Reusable components (ui/, layout/, features/)
│   ├── stores/        # Svelte stores (theme, etc.)
│   ├── utils/         # Utility functions (check here first!)
│   ├── services/      # API clients and services
│   ├── types/         # TypeScript type definitions
│   └── constants/ # Shared constants (routes, config)
└── routes/            # File-based routing (SvelteKit)
    ├── +page.svelte   # Pages
    ├── +layout.svelte # Layouts
    └── api/           # API routes (+server.ts)
```

### Common Tasks

- **Find code**: See [File Organization](FILE_ORGANIZATION.md) → "Locating Code" section
- **Write component**: See [Patterns](PATTERNS.md) → "Svelte Component Pattern"
- **Add utility**: Check [Utilities Rule](.cursor/rules/utilities.mdc) first, then see [Patterns](PATTERNS.md)
- **Create API route**: See [Patterns](PATTERNS.md) → "API Route Pattern"
- **Write tests**: See [Testing](TESTING.md) for patterns and [.cursor/rules/testing.mdc](.cursor/rules/testing.mdc) for standards

### Workflow Checklist

Before completing any code task:
1. ✅ Check utilities first (DRY principle)
2. ✅ Write tests if applicable (90% coverage required)
3. ✅ Run tests: `npm run test`
4. ✅ Run lint: `npm run lint` (fix all issues)
5. ✅ Verify code follows [Coding Conventions](CODING_CONVENTIONS.md)
6. ✅ Ensure theme support (light & dark modes) using CSS variables
---

## Documentation Index

### [File Organization](FILE_ORGANIZATION.md)

Directory structure and organization patterns:
- Complete directory tree
- Purpose of each directory
- File naming conventions
- Component structure standards
- Import path conventions
- **Locating code** - Navigation guide for finding components, pages, utilities, and more

**Start here if**: You need to find where code lives or understand the project structure.

### [Coding Conventions](CODING_CONVENTIONS.md)

Code style and conventions:
- ESLint configuration and rules
- Prettier formatting rules
- TypeScript conventions
- Naming conventions
- Import conventions
- Component structure
- Comment guidelines

**Start here if**: You're writing new code or reviewing code.

### [Development Workflow](DEVELOPMENT_WORKFLOW.md)

Setup and development process:
- Prerequisites and installation
- Environment configuration
- Running the development server
- Development scripts
- Debugging
- Common issues and solutions

**Start here if**: You're setting up your development environment or need help with common tasks.

### [Patterns](PATTERNS.md)

Common code patterns and practices:
- Svelte component pattern
- Store pattern
- Data fetching patterns
- Layout pattern
- Styling patterns (including theme support for light & dark modes)
- API route patterns

**Start here if**: You need examples of how to implement common functionality.

### [Testing](TESTING.md)

Comprehensive testing guide:
- Test framework setup (Vitest, Svelte Testing Library)
- Test file conventions and organization
- Testing patterns for components, utilities, and stores
- Mocking strategies
- Best practices

**Start here if**: You're writing tests or need to understand testing patterns.

### [Quick Reference](QUICK_REFERENCE.md)

Quick lookup guide:
- Common file paths
- Development commands
- Links to detailed documentation

**Start here if**: You need a quick lookup for paths, commands, or patterns.

## Quick Start Guide

### For New Developers

1. Read [Development Workflow](DEVELOPMENT_WORKFLOW.md) to set up your environment
2. Read [File Organization](FILE_ORGANIZATION.md) to understand the structure and locate code
3. Refer to [Patterns](PATTERNS.md) for implementation examples
4. Follow [Coding Conventions](CODING_CONVENTIONS.md) when writing code
5. Use [Testing](TESTING.md) guide when writing tests

### For Code Reviewers

1. Check [Coding Conventions](CODING_CONVENTIONS.md) for style compliance
2. Verify patterns match [Patterns](PATTERNS.md) guide
3. Ensure file organization follows [File Organization](FILE_ORGANIZATION.md) standards
4. Review [Testing](TESTING.md) guide for test quality and patterns

### For Finding Code

1. Check [File Organization](FILE_ORGANIZATION.md) for directory structure and navigation guide
2. Check [Quick Reference](QUICK_REFERENCE.md) for common paths and commands

## Documentation Principles

This documentation follows these principles:

1. **Practical**: Focuses on actionable information
2. **Accurate**: Based on actual codebase structure
3. **Cross-referenced**: Documents link to each other
4. **Maintainable**: Organized for easy updates
5. **Comprehensive**: Covers all major aspects of the codebase

## About This Directory (`.cursor/`)

This `.cursor/` directory contains:
- **`docs/`** - Human-readable documentation (`.md` files) for developers and AI assistants
- **`rules/`** - AI agent rules (`.mdc` files) that guide code generation and quality
- **`commands/`** - Cursor-specific command documentation
**⚠️ IMPORTANT**: These files can and should be updated as the project evolves. The AI agent can edit these files when explicitly requested. When updating:
- **`.md` files**: Standard Markdown format
- **`.mdc` files**: Markdown with frontmatter metadata (see `commands/generate-cursor-rules.md`)

## Contributing to Documentation

When updating documentation:

1. **⚠️ MANDATORY**: Always ask for user acceptance before editing any markdown files (`.md` or `.mdc`) - present a summary of changes and wait for approval
2. Keep it accurate - verify against actual code
3. Update cross-references if structure changes
4. Add examples where helpful
5. Keep formatting consistent
6. Update this README if adding new documents
7. For `.mdc` rule files, preserve frontmatter metadata format

See [Documentation Handling Rule](../rules/documentation-handling.mdc) for complete guidelines.

## Getting Help

If you can't find what you're looking for:

1. Check the [Quick Reference](QUICK_REFERENCE.md) for common items
2. Review [File Organization](FILE_ORGANIZATION.md) for navigation guidance
3. Review [Patterns](PATTERNS.md) for implementation examples
4. Check the main project README

---

**Last Updated**: Documentation for zhaoyu.io portfolio site (SvelteKit).
