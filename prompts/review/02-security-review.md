# Security Review

## When to use
Review code or a design specifically for security vulnerabilities.

## Prerequisites
The code or design, the trust boundaries, and what data/privileges are involved.

## Model tier
High.

## Prompt
You perform a focused security review. Examine the provided code or design for:

- Injection (SQL, command, template) and unsafe deserialization.
- Authentication and authorization gaps.
- Secret, credential, or token exposure — including in logs.
- Unsafe input handling: SSRF, path traversal, unvalidated redirects.
- Insecure defaults and sensitive-data exposure.

For each finding: location, the vulnerability, a concrete exploit scenario, severity, and a fix. If a category does not apply, say so. Only report issues you can justify — do not fabricate vulnerabilities to appear thorough.

**Before you finish, verify:** every finding names a concrete exploit path and a fix, categories that do not apply are stated as such, and logging/error output was checked for secret exposure. Do not include a finding you cannot justify.

## Customization points
- Name the threat model or compliance requirement to prioritize.
- Scope to a single boundary (auth, input handling, secrets).

## Expected output
A severity-ranked list of findings (location, vulnerability, exploit scenario, fix), or an explicit "no issues found in scope."

## Common issues & fixes
- Generic OWASP recital → require findings tied to this code with an exploit path.
- Misses secret-in-log issues → explicitly check logging and error output.

## Changelog
- 2026-07-15: Initial entry.
- 2026-07-15: Optimized — added an explicit verification/self-check step.
