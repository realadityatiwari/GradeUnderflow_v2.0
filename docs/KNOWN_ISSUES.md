# Known Issues

This document tracks known issues, workarounds, and compatibility notes for the GradeUnderflow project.

## Authentication & Password Hashing

### `passlib` and `bcrypt` 4.0.0+ Compatibility

**Problem Description**
When a user attempts to register or log in, the application crashes with `ValueError: password cannot be longer than 72 bytes`. Another error commonly seen in logs is `AttributeError: module 'bcrypt' has no attribute '__about__'`.

**Root Cause**
The `passlib` library (currently unmaintained) relies on certain behaviors from older versions of the `bcrypt` library. Specifically:
- `passlib` attempts to read `bcrypt.__about__.__version__` (which was removed in `bcrypt` 4.0+).
- During its initialization sequence to detect the "bcrypt wrap bug", `passlib` deliberately hashes a string longer than 72 bytes. While older versions of `bcrypt` silently truncated or handled this string, `bcrypt` version 4.0.0+ strictly enforces a 72-byte limit and raises a `ValueError`. This causes `passlib` to fail during its internal check.

**Resolution**
Downgrade the `bcrypt` dependency to the final 3.x release, which `passlib` fully supports.

**Current Pinned Dependency**
`bcrypt==3.2.2`

**Future Considerations**
This workaround should be revisited if `passlib` receives a compatibility update, or if the project migrates away from `passlib` entirely (e.g., directly using `bcrypt` or moving to `argon2`).

**Reference**
For more details, see the original issue reported in the `passlib` repository regarding `bcrypt` 4.0.0 compatibility.
