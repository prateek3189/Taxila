# Contributing to FeatherKit

Thank you for your interest in contributing to FeatherKit! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/featherkit.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm 9+

### Available Scripts

- `npm run dev` - Start development server for docs
- `npm run build` - Build all packages
- `npm run test` - Run tests
- `npm run lint` - Run linting
- `npm run format` - Format code

## Project Structure

```
featherkit/
├── packages/
│   ├── core/           # Design tokens, utilities, base styles
│   ├── components/     # Web components
│   ├── icons/          # Icon components and registry
│   ├── themes/         # Theme definitions
│   └── adapters/       # Framework adapters (optional)
├── apps/
│   └── docs/           # Documentation site
└── scripts/            # Build and utility scripts
```

## Component Development

### Creating a New Component

1. Create a new directory in `packages/components/src/`
2. Follow the existing component structure:
   ```
   component-name/
   ├── fk-component-name.ts
   ├── index.ts
   └── README.md
   ```
3. Implement the component following our patterns
4. Add tests and documentation
5. Export from the main components index

### Component Guidelines

- Use the `FeatherKitElement` base class
- Follow accessibility best practices (WCAG 2.2 AA)
- Include proper TypeScript types
- Add CSS parts for styling hooks
- Support keyboard navigation
- Include loading and disabled states
- Follow the design token system

### Design Tokens

- Use CSS custom properties from `@featherkit/core`
- Follow the established token naming convention
- Test with all theme variants (light, dark, high-contrast)

## Testing

### Unit Tests
- Write tests for component behavior
- Test accessibility features
- Test keyboard navigation
- Test theme switching

### Visual Tests
- Use Playwright for visual regression testing
- Test across different themes
- Test responsive behavior

### Accessibility Tests
- Use axe-core for automated a11y testing
- Test with screen readers
- Verify keyboard navigation

## Pull Request Process

1. Ensure all tests pass: `npm run test`
2. Run linting: `npm run lint`
3. Update documentation if needed
4. Add tests for new functionality
5. Update CHANGELOG.md
6. Submit pull request with clear description

### PR Requirements

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Accessibility verified
- [ ] Cross-browser tested
- [ ] Theme compatibility verified
- [ ] Bundle size impact considered

## Code Style

- Use TypeScript with strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Use conventional commits format

## Release Process

We use semantic-release for automated releases:

- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)
- `BREAKING CHANGE:` - Breaking changes (major version bump)

## Questions?

- Open an issue for questions or discussions
- Join our community discussions
- Check existing issues and PRs

Thank you for contributing to FeatherKit! 🎉
