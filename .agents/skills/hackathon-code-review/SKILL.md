---
name: hackathon-code-review
description: Governs code review standards for the repository to prevent unnecessary refactoring, architectural drift, security vulnerabilities, or scope creep during hackathons.
---

# Hackathon Code Review Skill

This skill controls how Antigravity performs code reviews on changes made within this workspace during hackathons.

## Core Rule

> **"Working code should not be refactored simply because another implementation looks cleaner."**

---

## 1. Review Checklist Categories

When reviewing pull requests, diffs, or proposed code edits, Antigravity MUST evaluate changes against these 8 categories:

### 1. Architecture
- Is existing functionality being reused rather than duplicated?
- Is a new abstraction genuinely necessary, or does it add cognitive overhead?
- Is there unnecessary complexity or boilerplate?
- Is speculative infrastructure being introduced?

### 2. Security
- **Authentication**: Are endpoints protected by auth middleware (`authenticateToken`)?
- **Authorization**: Are user permissions validated?
- **Ownership Checks**: Does the API verify that the resource belongs to `req.user.id`?
- **Input Validation**: Are user inputs sanitized and checked for valid types/ranges?
- **Secret Handling**: Are API keys and secrets retrieved from `.env` (never hardcoded)?
- **API Security**: Are appropriate rate limiters, CORS rules, and security headers applied?

### 3. API & Backend
- Are existing API contracts preserved (no breaking payload changes)?
- Is request/response structure compatible with existing frontend services?
- Are HTTP status codes used correctly (200, 201, 400, 401, 403, 404, 500)?
- Is error handling complete (no unhandled promises or silent catch blocks)?

### 4. Database & Models
- Is proper ownership enforced on Mongo document schemas?
- Are schema validations present for required fields?
- Are database queries efficient (e.g., proper filtering, avoiding $N+1$ fetches)?
- Are indexes added ONLY when justified by query patterns?
- Are unnecessary schema changes avoided?

### 5. Frontend & UI
- **Loading States**: Are spinners or skeletons displayed during async calls?
- **Empty States**: Are helpful views shown when lists or data arrays are empty?
- **Error States**: Are user-friendly error banners/toasts displayed on failures?
- **Network Resilience**: Does the screen handle offline/weak connection gracefully?
- **Accessibility**: Are accessible labels and contrast preserved?
- **Mobile Layout**: Is the view responsive and mobile-first?
- **Keyboard Handling**: Are input fields wrapped in `KeyboardAvoidingView` / `ScrollView` where appropriate?

### 6. Performance
- Are unnecessary component re-renders prevented (proper memoization where needed)?
- Are excessive or redundant API calls avoided?
- Are expensive computations kept off the UI thread?
- Are animations constrained to performant properties (transform, opacity using Reanimated)?
- Are large lists rendered using `FlatList` or virtualized lists?

### 7. Testing & Verification
- Is new functionality covered by targeted automated or manual test steps?
- Are existing tests passing and un-compromised?
- Are critical user flows verified end-to-end?

### 8. Scope & Anti-Drift
- Reject or flag:
  - Unnecessary npm dependencies
  - Duplicate utility functions or components
  - Unrelated formatting or refactoring of working code
  - Full architecture rewrites
  - Speculative features not required by the P0/P1 scope

---

## 2. Severity Classification Matrix

Findings must be tagged with exactly one of the following severity levels:

| Level | Definition | Action Required |
| :--- | :--- | :--- |
| **CRITICAL** | Security flaw, data corruption risk, breaking API contract, app crash | Must fix before merge/completion |
| **HIGH** | Broken primary user flow, missing auth/ownership check, major UI freeze | Must fix before approval |
| **MEDIUM** | Missing loading/error state, inefficient query, missing mobile keyboard handling | Strongly recommended fix |
| **LOW** | Minor UI alignment inconsistency, minor type improvement | Fix if quick; do not block MVP |
| **OPTIONAL** | Non-blocking suggestion or future enhancement thought | Informational only |

---

## 3. Strict Review Constraints

1. Do NOT suggest stylistic rewrites on working code.
2. Do NOT flag missing generic features (like full admin panels) unless specified in the hackathon product spec.
3. Keep review feedback concise, constructive, and prioritized by user impact.
