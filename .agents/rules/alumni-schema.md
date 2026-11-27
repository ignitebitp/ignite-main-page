---
trigger: always_on
---

# Alumni Data Schema Rule

- Entries in `frontend/data/alumni-section.json` (and `AlumniMember` in `frontend/types.ts`) **must NOT have a `role` field** (or `rollNo` field).
- Each alumni entry should only contain `name`, `image` (in `/alumni/<batch>/<firstname-lastname>.webp`), and social links (`linkedin`, `website`).

