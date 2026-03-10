# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in ZC-VIOS, please report it privately. **Do not open a public GitHub issue for security-sensitive problems.**

### How to Report

Until a dedicated security email is established, please use one of these methods:

1. **Private support request** - Contact the repository owner through the support channel linked in [docs/SUPPORT.md](docs/SUPPORT.md)
2. **GitHub private vulnerability reporting** - If available on this repository, use GitHub's private vulnerability reporting feature

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

### Response Timeline

- Acknowledgment within 72 hours
- Initial assessment within 1 week
- Fix timeline depends on severity and complexity

### Scope

This policy covers:
- Authentication and authorization flaws
- Data exposure vulnerabilities
- Injection attacks
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Any issue that could compromise user data or system integrity

### Out of Scope

- Issues in dependencies (report to upstream maintainers)
- Denial of service through resource exhaustion
- Issues requiring physical access
- Social engineering attacks

## Supported Versions

| Version | Supported |
|---------|-----------|
| v1.1.x-alpha | Yes |
| < v1.1.0 | No |

Only the latest alpha release receives security updates.
