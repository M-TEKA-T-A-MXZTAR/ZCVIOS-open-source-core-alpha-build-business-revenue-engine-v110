# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in ZC-VIOS, please report it responsibly and privately where possible.

**Do not open a public GitHub issue containing exploit details, credentials, private tokens, recovery codes, personal data, or sensitive system information.**

---

## How to Report

Preferred reporting method:

1. Use **GitHub private vulnerability reporting** if it is available on this repository.

If private vulnerability reporting is not available:

2. Open a public GitHub issue requesting maintainer contact, but do **not** include vulnerability details in the public issue.

The public issue should only say that you need a private contact route for a security-sensitive report.

---

## What to Include Privately

When a private reporting route is available, include:

- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Affected files, routes, or features
- Any suggested fixes, if known

Do not include real passwords, payment credentials, private tokens, or personal data. Use safe test data wherever possible.

---

## Response Timeline

The project aims to respond within:

- **72 hours** for acknowledgment
- **1 week** for initial assessment

Fix timelines depend on severity, complexity, maintainer availability, and project status.

---

## Scope

This policy covers issues that could affect:

- Authentication
- Authorization
- User data exposure
- Injection vulnerabilities
- Cross-site scripting
- Cross-site request forgery
- Sensitive configuration exposure
- Any issue that could compromise user data or system integrity

---

## Out of Scope

The following are generally out of scope:

- Social engineering
- Physical access attacks
- Denial of service through resource exhaustion
- Issues in third-party dependencies, unless the repository directly exposes users to the issue through its own implementation
- Reports based only on outdated dependency scanners without a clear exploit path in this project

Dependency security alerts are handled separately through dependency maintenance and Dependabot review.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| v1.1.x-alpha | Yes |
| < v1.1.0 | No |

Only the latest alpha release receives security updates.

---

## Security Principles

ZC-VIOS should not request or store:

- passwords,
- payment credentials,
- recovery codes,
- private platform tokens,
- private messages,
- or restricted account data.

The project is intended to remain privacy-first, user-controlled, and transparent about what data is used.
