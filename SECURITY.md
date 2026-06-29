# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report privately via GitHub's
[**private vulnerability reporting**](https://github.com/alranjan14/ViewTube/security/advisories/new)
(the repo's **Security → Report a vulnerability** tab). I'll acknowledge the
report and work with you on a fix and a disclosure timeline.

## Notes on this project

- The YouTube Data API key is held **server-side** by a backend-for-frontend
  proxy (`api/`) and is never shipped to the client bundle. Please report any
  client-side exposure of secrets.
- Google OAuth **client IDs** are public by design and are not treated as
  secrets.
- Dependencies are checked in CI (`npm audit --audit-level=high`).
