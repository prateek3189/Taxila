# FeatherKit - Platform-Agnostic Web Component Library

A lightweight, accessible, design-token–driven UI component library using Web Components (Lit) that works anywhere—plain HTML, React, Vue, Angular, Svelte, server-rendered frameworks, and native WebView shells.

## 🚀 Quick Start

### CDN Usage
```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@featherkit/components@latest/dist/featherkit.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@featherkit/themes@latest/dist/light.css">
</head>
<body>
  <fk-button variant="primary">Hello World</fk-button>
</body>
</html>
```

### npm Usage
```bash
npm install @featherkit/core @featherkit/components @featherkit/themes
```

```typescript
import '@featherkit/components/button';
import '@featherkit/themes/light.css';

// Use in your HTML
document.body.innerHTML = '<fk-button variant="primary">Hello World</fk-button>';
```

## 📦 Packages

- **@featherkit/core** - Base tokens, utilities, reset styles, motion primitives
- **@featherkit/components** - Primary web components (button, input, select, modal, etc.)
- **@featherkit/icons** - SVG icon set and icon web component
- **@featherkit/themes** - Curated themes (Light, Dark, High-Contrast)
- **@featherkit/adapters** - Framework wrappers for React/Vue/Angular
- **@featherkit/labs** - Experimental components (not semver-stable)
- **@featherkit/docs** - Documentation and site

## ✨ Features

- **Zero Framework Lock-in** - Standards-based custom elements
- **Small Bundles** - Tree-shakable ESM-first output
- **Design Tokens** - CSS custom properties theming
- **A11y First** - WCAG 2.2 AA, ARIA-compliant APIs
- **SSR Friendly** - Declarative Shadow DOM support
- **Cross-Platform** - Works in any environment

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Run linting
npm run lint
```

## 📚 Documentation

Visit our [documentation site](https://featherkit.dev) for comprehensive guides, component APIs, and interactive examples.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.
