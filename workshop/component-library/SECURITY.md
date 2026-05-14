# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in FeatherKit, please report it responsibly:

### How to Report

1. **Do not** open a public issue
2. Email security@featherkit.dev with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Within 30 days (depending on complexity)

### What We Consider Security Issues

- XSS vulnerabilities in components
- Insecure default configurations
- Missing CSP headers in examples
- Accessibility vulnerabilities that could impact users
- Supply chain vulnerabilities in dependencies

### What We Don't Consider Security Issues

- Issues in development dependencies
- Issues in documentation examples (unless they're security-focused)
- Issues in third-party dependencies (report to the respective projects)

## Security Updates

Security updates will be:

1. Released as patch versions
2. Documented in CHANGELOG.md
3. Announced via GitHub releases
4. Backported to supported versions

## Responsible Disclosure

We follow responsible disclosure practices:

1. **Confidentiality**: We keep reports confidential until resolved
2. **Coordination**: We work with reporters to coordinate disclosure
3. **Credit**: We credit security researchers (with permission)
4. **Timeline**: We provide reasonable timelines for fixes

## Security Best Practices

When using FeatherKit:

- Keep dependencies updated
- Use CSP headers in production
- Validate all user inputs
- Follow security guidelines in documentation
- Report suspicious behavior

## Contact

For security-related questions or concerns:
- Email: security@featherkit.dev
- PGP Key: [Available on request]

Thank you for helping keep FeatherKit secure! 🔒
