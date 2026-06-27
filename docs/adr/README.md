# Architecture Decision Records

This directory records the significant architectural decisions on ViewTube using
[Michael Nygard's ADR format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

Records are numbered, immutable once **Accepted**, and superseded (never edited) by a newer record.

| #    | Decision                                                                                         | Status   |
| ---- | ------------------------------------------------------------------------------------------------ | -------- |
| 0001 | [Record architecture decisions](./0001-record-architecture-decisions.md)                         | Accepted |
| 0002 | [Abstract video data behind a provider interface](./0002-provider-abstraction-for-video-data.md) | Accepted |
| 0003 | [RTK for UI state, TanStack Query for server state](./0003-state-management-split.md)            | Accepted |
| 0004 | [Validate API responses with Zod at the boundary](./0004-validate-api-responses-with-zod.md)     | Accepted |

To add one: copy the structure of an existing record, increment the number, and add a row above.
