#!/usr/bin/env node

const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

const rootDir = join(__dirname, '..');

/**
 * Build CDN bundles for FeatherKit
 */
async function buildCDNBundles() {
  console.log('🚀 Building CDN bundles for FeatherKit...');

  const distDir = join(rootDir, 'dist');
  const cdnDir = join(distDir, 'cdn');

  // Create directories
  if (!existsSync(distDir)) mkdirSync(distDir);
  if (!existsSync(cdnDir)) mkdirSync(cdnDir);

  try {
    // Build individual packages first
    console.log('📦 Building individual packages...');
    const { execSync } = require('child_process');
    execSync('npm run build --workspaces', {
      cwd: rootDir,
      stdio: 'inherit',
    });

    // Generate JavaScript bundle
    console.log('📝 Generating JavaScript bundle...');
    await generateJSBundle(cdnDir);

    // Generate CSS bundle
    console.log('🎨 Generating CSS bundle...');
    await generateCSSBundle(cdnDir);

    // Generate example HTML
    console.log('📄 Generating example HTML...');
    await generateExampleHTML(cdnDir);

    console.log('✅ CDN bundles generated successfully!');
    console.log(`📁 Output directory: ${cdnDir}`);
    console.log('📋 Generated files:');
    console.log('  - featherkit.js (JavaScript bundle)');
    console.log('  - featherkit.css (CSS bundle with light theme)');
    console.log('  - example.html (Usage example)');
  } catch (error) {
    console.error('❌ Error building CDN bundles:', error);
    process.exit(1);
  }
}

/**
 * Generate the JavaScript bundle
 */
async function generateJSBundle(cdnDir) {
  const jsBundlePath = join(cdnDir, 'featherkit.js');

  // Read built component files
  const componentsPath = join(rootDir, 'packages/components/dist');
  const corePath = join(rootDir, 'packages/core/dist');

  // Read the main index file
  const indexContent = readFileSync(join(componentsPath, 'index.js'), 'utf8');

  // Read button and icon components
  const buttonContent = readFileSync(join(componentsPath, 'button.js'), 'utf8');
  const iconContent = readFileSync(join(componentsPath, 'icon.js'), 'utf8');

  // Read core utilities
  const coreContent = readFileSync(join(corePath, 'index.js'), 'utf8');
  const tokensContent = readFileSync(join(corePath, 'tokens.js'), 'utf8');

  // Combine all JavaScript content
  const bundleContent = `
// FeatherKit - Platform-Agnostic Web Component Library
// Generated: ${new Date().toISOString()}
// Version: 0.0.0

// Core utilities and tokens
${coreContent}

// Token definitions
${tokensContent}

// Component definitions
${buttonContent}
${iconContent}

// Main exports
${indexContent}

// Global registration for CDN usage
if (typeof window !== 'undefined') {
  // Auto-register components for immediate use
  console.log('🎨 FeatherKit loaded successfully!');
  console.log('📖 Available components: fk-button, fk-icon');
  console.log('🎨 Available themes: light (default), dark, high-contrast');
}
`;

  writeFileSync(jsBundlePath, bundleContent);
  console.log(`  ✅ JavaScript bundle: ${jsBundlePath}`);
}

/**
 * Generate the CSS bundle
 */
async function generateCSSBundle(cdnDir) {
  const cssBundlePath = join(cdnDir, 'featherkit.css');

  // Read CSS files
  const corePath = join(rootDir, 'packages/core/dist');
  const themesPath = join(rootDir, 'packages/themes/dist');

  // Read core CSS
  const resetCSS = readFileSync(join(corePath, 'reset.js'), 'utf8');
  const utilitiesCSS = readFileSync(join(corePath, 'utilities.js'), 'utf8');

  // Read theme CSS
  const lightThemeCSS = readFileSync(join(themesPath, 'light.css'), 'utf8');

  // Extract CSS content from JS modules (they export CSS as strings)
  const extractCSSFromJS = jsContent => {
    // Simple extraction - look for CSS strings in the JS
    const cssMatch = jsContent.match(/export\s+default\s+`([\s\S]*?)`/);
    return cssMatch ? cssMatch[1] : '';
  };

  const resetCSSContent = extractCSSFromJS(resetCSS);
  const utilitiesCSSContent = extractCSSFromJS(utilitiesCSS);

  // Combine all CSS content
  const bundleContent = `
/* FeatherKit - Platform-Agnostic Web Component Library */
/* Generated: ${new Date().toISOString()} */
/* Version: 0.0.0 */

/* CSS Reset */
${resetCSSContent}

/* Utility Classes */
${utilitiesCSSContent}

/* Light Theme (Default) */
${lightThemeCSS}

/* Component Styles */
.fk-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--fk-spacing-2, 0.5rem);
  padding: var(--fk-spacing-2, 0.5rem) var(--fk-spacing-4, 1rem);
  border: 1px solid transparent;
  border-radius: var(--fk-radius-md, 0.375rem);
  font-family: var(--fk-typography-font-family-sans, ui-sans-serif, system-ui, sans-serif);
  font-size: var(--fk-typography-font-size-base, 1rem);
  font-weight: var(--fk-typography-font-weight-medium, 500);
  line-height: var(--fk-typography-line-height-normal, 1.5);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: all var(--fk-motion-transition-base, 200ms cubic-bezier(0, 0, 0.2, 1));
}

.fk-button:focus-visible {
  outline: 2px solid var(--fk-color-primary-500, #0ea5e9);
  outline-offset: 2px;
}

.fk-button:disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

/* Button Variants */
.fk-button[variant="primary"] {
  background-color: var(--fk-color-primary-500, #0ea5e9);
  color: var(--fk-color-primary-foreground, #ffffff);
}

.fk-button[variant="primary"]:hover:not(:disabled) {
  background-color: var(--fk-color-primary-600, #0284c7);
  transform: translateY(-1px);
  box-shadow: var(--fk-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
}

.fk-button[variant="secondary"] {
  background-color: var(--fk-color-secondary-100, #f1f5f9);
  color: var(--fk-color-secondary-900, #0f172a);
  border-color: var(--fk-color-secondary-200, #e2e8f0);
}

.fk-button[variant="secondary"]:hover:not(:disabled) {
  background-color: var(--fk-color-secondary-200, #e2e8f0);
}

.fk-button[variant="ghost"] {
  background-color: transparent;
  color: var(--fk-color-primary-500, #0ea5e9);
}

.fk-button[variant="ghost"]:hover:not(:disabled) {
  background-color: var(--fk-color-primary-50, #f0f9ff);
}

.fk-button[variant="destructive"] {
  background-color: var(--fk-color-error-500, #ef4444);
  color: var(--fk-color-error-foreground, #ffffff);
}

.fk-button[variant="destructive"]:hover:not(:disabled) {
  background-color: var(--fk-color-error-600, #dc2626);
}

/* Button Sizes */
.fk-button[size="sm"] {
  padding: var(--fk-spacing-1, 0.25rem) var(--fk-spacing-3, 0.75rem);
  font-size: var(--fk-typography-font-size-sm, 0.875rem);
}

.fk-button[size="lg"] {
  padding: var(--fk-spacing-3, 0.75rem) var(--fk-spacing-6, 1.5rem);
  font-size: var(--fk-typography-font-size-lg, 1.125rem);
}

/* Icon Styles */
fk-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

fk-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
  stroke: currentColor;
}

fk-icon[size="xs"] {
  width: 0.75rem;
  height: 0.75rem;
}

fk-icon[size="sm"] {
  width: 1rem;
  height: 1rem;
}

fk-icon[size="md"] {
  width: 1.25rem;
  height: 1.25rem;
}

fk-icon[size="lg"] {
  width: 1.5rem;
  height: 1.5rem;
}

fk-icon[size="xl"] {
  width: 2rem;
  height: 2rem;
}

/* Default icon size */
fk-icon:not([size]) {
  width: 1.25rem;
  height: 1.25rem;
}

/* Loading state */
.fk-button[loading] {
  position: relative;
  pointer-events: none;
}

.fk-button[loading] .fk-content {
  opacity: 0.7;
}

.fk-spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: fk-spin 1s linear infinite;
}

@keyframes fk-spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .fk-button {
    transition: none;
  }
  
  .fk-spinner {
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .fk-button:focus-visible {
    outline-width: 3px;
  }
}
`;

  writeFileSync(cssBundlePath, bundleContent);
  console.log(`  ✅ CSS bundle: ${cssBundlePath}`);
}

/**
 * Generate example HTML file
 */
async function generateExampleHTML(cdnDir) {
  const htmlPath = join(cdnDir, 'example.html');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FeatherKit CDN Example</title>
  
  <!-- FeatherKit CSS Bundle -->
  <link rel="stylesheet" href="./featherkit.css">
  
  <style>
    body {
      font-family: var(--fk-typography-font-family-sans);
      margin: 0;
      padding: 2rem;
      background-color: var(--fk-color-background);
      color: var(--fk-color-foreground);
      line-height: 1.6;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .demo-section {
      margin-bottom: 3rem;
      padding: 2rem;
      background: var(--fk-color-card);
      border: 1px solid var(--fk-color-border);
      border-radius: var(--fk-radius-lg);
    }
    
    .demo-section h2 {
      margin-top: 0;
      color: var(--fk-color-primary-600);
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }
    
    .theme-switcher {
      position: fixed;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      background: var(--fk-color-card);
      padding: 0.5rem;
      border-radius: var(--fk-radius-md);
      border: 1px solid var(--fk-color-border);
      box-shadow: var(--fk-shadow-md);
    }
    
    .theme-button {
      padding: 0.5rem 1rem;
      border: 1px solid var(--fk-color-border);
      background: var(--fk-color-background);
      color: var(--fk-color-foreground);
      border-radius: var(--fk-radius-sm);
      cursor: pointer;
      font-size: 0.875rem;
    }
    
    .theme-button.active {
      background: var(--fk-color-primary-500);
      color: var(--fk-color-primary-foreground);
    }
    
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--fk-color-muted);
      border-radius: var(--fk-radius-md);
      text-align: center;
    }
    
    .icon-item fk-icon {
      color: var(--fk-color-primary-500);
    }
  </style>
</head>
<body>
  <div class="theme-switcher">
    <button class="theme-button active" data-theme="light">Light</button>
    <button class="theme-button" data-theme="dark">Dark</button>
    <button class="theme-button" data-theme="high-contrast">High Contrast</button>
  </div>

  <div class="container">
    <h1>🎨 FeatherKit CDN Demo</h1>
    <p>This example demonstrates FeatherKit components loaded directly from CDN bundles. No build process required!</p>

    <div class="demo-section">
      <h2>Buttons</h2>
      <p>Various button variants and sizes:</p>
      
      <div class="button-group">
        <fk-button variant="primary">Primary</fk-button>
        <fk-button variant="secondary">Secondary</fk-button>
        <fk-button variant="ghost">Ghost</fk-button>
        <fk-button variant="destructive">Destructive</fk-button>
      </div>
      
      <div class="button-group">
        <fk-button variant="primary" size="sm">Small</fk-button>
        <fk-button variant="primary" size="md">Medium</fk-button>
        <fk-button variant="primary" size="lg">Large</fk-button>
      </div>
      
      <div class="button-group">
        <fk-button variant="primary" disabled>Disabled</fk-button>
        <fk-button variant="primary" loading>
          <span class="fk-content">Loading</span>
          <div class="fk-spinner"></div>
        </fk-button>
      </div>
      
      <div class="button-group">
        <fk-button variant="primary">
          <fk-icon name="star" size="sm"></fk-icon>
          With Icon
        </fk-button>
        <fk-button variant="secondary">
          Download
          <fk-icon name="download" size="sm"></fk-icon>
        </fk-button>
      </div>
    </div>

    <div class="demo-section">
      <h2>Icons</h2>
      <p>Icon component with different sizes and colors:</p>
      
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 2rem;">
        <fk-icon name="check" size="xs"></fk-icon>
        <fk-icon name="check" size="sm"></fk-icon>
        <fk-icon name="check" size="md"></fk-icon>
        <fk-icon name="check" size="lg"></fk-icon>
        <fk-icon name="check" size="xl"></fk-icon>
      </div>
      
      <div class="icon-grid">
        <div class="icon-item">
          <fk-icon name="heart" color="var(--fk-color-error-500)"></fk-icon>
          <span>heart</span>
        </div>
        <div class="icon-item">
          <fk-icon name="star" color="var(--fk-color-warning-500)"></fk-icon>
          <span>star</span>
        </div>
        <div class="icon-item">
          <fk-icon name="check-circle" color="var(--fk-color-success-500)"></fk-icon>
          <span>check-circle</span>
        </div>
        <div class="icon-item">
          <fk-icon name="info" color="var(--fk-color-primary-500)"></fk-icon>
          <span>info</span>
        </div>
        <div class="icon-item">
          <fk-icon name="user"></fk-icon>
          <span>user</span>
        </div>
        <div class="icon-item">
          <fk-icon name="mail"></fk-icon>
          <span>mail</span>
        </div>
        <div class="icon-item">
          <fk-icon name="settings"></fk-icon>
          <span>settings</span>
        </div>
        <div class="icon-item">
          <fk-icon name="home"></fk-icon>
          <span>home</span>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>Design Tokens</h2>
      <p>Examples of design tokens in action:</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div style="padding: 1rem; background: var(--fk-color-primary-50); border-radius: var(--fk-radius-md);">
          <h4 style="color: var(--fk-color-primary-700); margin-top: 0;">Primary Colors</h4>
          <div style="display: flex; gap: 0.5rem;">
            <div style="width: 2rem; height: 2rem; background: var(--fk-color-primary-500); border-radius: var(--fk-radius-sm);"></div>
            <div style="width: 2rem; height: 2rem; background: var(--fk-color-primary-600); border-radius: var(--fk-radius-sm);"></div>
            <div style="width: 2rem; height: 2rem; background: var(--fk-color-primary-700); border-radius: var(--fk-radius-sm);"></div>
          </div>
        </div>
        
        <div style="padding: 1rem; background: var(--fk-color-success-50); border-radius: var(--fk-radius-md);">
          <h4 style="color: var(--fk-color-success-700); margin-top: 0;">Success Colors</h4>
          <div style="display: flex; gap: 0.5rem;">
            <div style="width: 2rem; height: 2rem; background: var(--fk-color-success-500); border-radius: var(--fk-radius-sm);"></div>
            <div style="width: 2rem; height: 2rem; background: var(--fk-color-success-600); border-radius: var(--fk-radius-sm);"></div>
            <div style="width: 2rem; height: 2rem; background: var(--fk-color-success-700); border-radius: var(--fk-radius-sm);"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>Usage Instructions</h2>
      <p>To use FeatherKit in your HTML file:</p>
      
      <pre style="background: var(--fk-color-muted); padding: 1rem; border-radius: var(--fk-radius-md); overflow-x: auto;"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;link rel="stylesheet" href="https://your-cdn.com/featherkit.css"&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;fk-button variant="primary"&gt;Hello World&lt;/fk-button&gt;
  &lt;fk-icon name="star"&gt;&lt;/fk-icon&gt;
  
  &lt;script type="module" src="https://your-cdn.com/featherkit.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
      
      <p><strong>Features:</strong></p>
      <ul>
        <li>✅ Zero build process required</li>
        <li>✅ Works in any framework or vanilla HTML</li>
        <li>✅ Full keyboard navigation support</li>
        <li>✅ ARIA attributes and screen reader compatibility</li>
        <li>✅ High contrast mode support</li>
        <li>✅ Reduced motion preferences</li>
        <li>✅ Theme switching capabilities</li>
      </ul>
    </div>
  </div>

  <!-- FeatherKit JavaScript Bundle -->
  <script type="module" src="./featherkit.js"></script>
  
  <script>
    // Theme switching functionality
    document.addEventListener('DOMContentLoaded', () => {
      const themeButtons = document.querySelectorAll('.theme-button');
      const root = document.documentElement;
      
      // Load saved theme or default to light
      const savedTheme = localStorage.getItem('featherkit-theme') || 'light';
      applyTheme(savedTheme);
      
      themeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const theme = button.dataset.theme;
          applyTheme(theme);
          localStorage.setItem('featherkit-theme', theme);
        });
      });
      
      function applyTheme(theme) {
        // Remove existing theme classes
        root.classList.remove('fk-theme-light', 'fk-theme-dark', 'fk-theme-high-contrast');
        
        // Add new theme class
        root.classList.add(\`fk-theme-\${theme}\`);
        
        // Update button states
        themeButtons.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        
        // Load theme CSS (you would need to host theme CSS files separately)
        console.log(\`Theme switched to: \${theme}\`);
      }
    });
    
    // Button click handlers
    document.addEventListener('fk-click', (event) => {
      console.log('Button clicked:', event.detail);
      
      // Show a simple alert for demo purposes
      if (event.target.textContent.includes('Primary')) {
        alert('Primary button clicked! 🎉');
      }
    });
  </script>
</body>
</html>`;

  writeFileSync(htmlPath, htmlContent);
  console.log(`  ✅ Example HTML: ${htmlPath}`);
}

// Run the build
buildCDNBundles();
