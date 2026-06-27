# 1. Record architecture decisions

Date: 2026-06-27

## Status

Accepted

## Context

We want to capture the significant architectural decisions on ViewTube — with their
context and consequences — so contributors understand the reasoning behind the structure
and don't re-litigate settled debates.

## Decision

We will keep Architecture Decision Records (Nygard format) in `docs/adr/`, numbered
sequentially. A record is immutable once Accepted; a change of direction is captured as a
new record that references the one it supersedes.

## Consequences

- The "why" behind decisions is discoverable and versioned alongside the code.
- Onboarding is faster.
- Writing a short record is a small, deliberate cost when making a notable decision.
