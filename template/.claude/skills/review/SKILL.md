---
name: review
description: Review code changes for bugs, security issues, performance problems, and spec compliance
disable-model-invocation: true
argument-hint: "[optional: commit range like HEAD~3, or file path like src/auth/]"
---

Review code changes and write findings to REVIEW.md: $ARGUMENTS

## Step 1: Determine review target

Based on the arguments:

- **No arguments**: Review all uncommitted changes (`git diff` staged + unstaged)
- **Commit range** (e.g., `HEAD~3`, `abc123..def456`): Review changes in the specified range
- **File/directory path**: Review only changes in the specified path

Run the appropriate `git diff` command to get the changes.

If there are no changes to review, tell the user and stop.

## Step 2: Gather context

- Read the changed files in full (not just the diff) to understand surrounding context
- If `SPEC.md` exists in the project root, read it to check spec compliance
- If `CLAUDE.md` exists, note any project conventions that apply

## Step 3: Review from 4 perspectives

Review all changes from each perspective. For every issue found, assign a severity:

- **critical**: Bugs, security vulnerabilities, data loss risks. Must fix before merge.
- **warning**: Performance issues, edge cases, deviation from spec. Should fix.
- **suggestion**: Code clarity, naming, pattern consistency. Nice to fix.

### Perspective 1: Bugs & Edge Cases
- Null/undefined handling
- Off-by-one errors
- Race conditions
- Error handling gaps
- Unhandled promise rejections

### Perspective 2: Security
- Injection vulnerabilities (SQL, XSS, command)
- Authentication/authorization gaps
- Hardcoded secrets or credentials
- Unsafe data handling

### Perspective 3: Performance
- N+1 queries or unnecessary loops
- Missing pagination or unbounded data fetches
- Memory leaks
- Expensive operations in hot paths

### Perspective 4: Design & Consistency
- Adherence to existing patterns in the codebase
- Naming conventions
- Separation of concerns
- API contract consistency

## Step 4: Spec compliance check

If SPEC.md exists:

- For each requirement (FR-xxx), check if the changes satisfy it
- For each Non-Goal (NG-xxx), check the changes don't violate scope
- Report: ✅ satisfied / ❌ not satisfied / ➖ not applicable

If SPEC.md does not exist, skip this step.

## Step 5: Write REVIEW.md and present results

Write REVIEW.md using this format:

```markdown
# Code Review Report

Date: YYYY-MM-DD
Target: [git diff description]

## Summary

[1-3 lines: overall assessment. How many issues found by severity.]

## Issues

### Critical

| # | File | Line | Issue | Suggested Fix |
|---|------|------|-------|---------------|
| 1 | ... | ... | ... | ... |

### Warning

| # | File | Line | Issue | Suggested Fix |
|---|------|------|-------|---------------|

### Suggestion

| # | File | Line | Issue | Suggested Fix |
|---|------|------|-------|---------------|

## Spec Compliance

(Only if SPEC.md exists)

| Requirement | Status | Notes |
|-------------|:------:|-------|
| FR-001: ... | ✅ | ... |
| FR-002: ... | ❌ | ... |
| NG-001: ... | ✅ | ... |

## Verdict

- [ ] **Ready to merge** — no critical issues
- [ ] **Needs fixes** — critical issues found
```

After writing REVIEW.md, also present the summary and any critical/warning issues directly to the user.

## Rules

- Never auto-fix code. Report issues only. The user decides what to fix.
- Always read the full file context, not just the diff — many bugs are only visible in context.
- If no issues are found, say so clearly. Don't invent problems to fill the report.
- Keep the report concise. Tables over prose.
- If REVIEW.md already exists, overwrite it (it's a snapshot of the latest review).
