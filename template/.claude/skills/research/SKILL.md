---
name: research
description: Research a topic and produce a structured report in docs/research/
disable-model-invocation: true
argument-hint: "[topic or question]"
---

Research the following topic and write findings to docs/research/: $ARGUMENTS

## Step 0: Scope check (MANDATORY — do NOT skip)

Before ANY research, list the independent concerns in the topic. Two concerns are "independent" if the answer to one does not affect the answer to the other (e.g., "competitor landscape" vs "which CLI framework to use").

If 2+ independent concerns are found:
1. List them explicitly to the user
2. Split into separate `/research` calls by default (one topic per report)
3. Only merge into a single report if the user explicitly requests it

## Step 1: Determine research type

Classify the topic into one of three types. This determines what to investigate and how to split subagent work.

### Market/Competitive
- **Focus**: competitors, trends, positioning, differentiators
- **Subagent split**: (A) competitor landscape, (B) market trends, (C) user needs/pain points
- **Key sources**: web search, industry reports, competitor websites

### Tech Selection
- **Focus**: candidate libraries/frameworks, comparison criteria, PoC feasibility
- **Subagent split**: (A) candidate discovery + feature comparison, (B) community health + adoption data, (C) integration feasibility with current stack
- **Key sources**: GitHub repos, official docs, benchmarks, web search

### Codebase/Impact
- **Focus**: relevant code, dependencies, blast radius, improvement opportunities
- **Subagent split**: (A) codebase analysis (Glob/Grep/Read), (B) external best practices (web search), (C) official docs verification (WebFetch on primary sources)
- **Key sources**: the codebase itself, official documentation, community repos

## Step 2: Execute parallel research

Launch 2-3 subagents based on the split above. Each subagent should:
- Return findings as text (do NOT write files)
- Include source URLs for every factual claim
- Flag anything uncertain as "unverified"

## Step 3: Verify key facts

After collecting subagent results, verify before writing the report:
- **URLs**: Use WebFetch to confirm pages exist and contain claimed information
- **Repos**: Use `gh repo view` or WebFetch to confirm existence and star counts
- **Features/APIs**: Check official documentation pages directly
- Mark each fact as: verified / unverified / inferred

## Step 4: Challenge conclusions

Before writing, critically review your own findings:
- **Confirmation bias**: Did you only collect evidence that supports one conclusion? Actively search for counterarguments.
- **Logical leaps**: Does each conclusion follow from the evidence, or are there gaps?
- **Missing perspectives**: What viewpoint or alternative did you not investigate?
- If any issue is found, go back and research the gap before proceeding.

## Step 5: Write report

Determine the next available number by checking existing files in docs/research/ (e.g., 001, 002...).
Create docs/research/ directory if it doesn't exist.
Write the report to `docs/research/NNN-[topic-slug].md`.

### Format

```markdown
# [Content-based title, not "Research Report"]

## Summary

**結論**: (1行で結論)
**推奨アクション**: (1行で次にやること)
**根拠**: (1行で最大の理由)

## [Content-based heading for finding 1]

(Each section starts with **bold conclusion**, then supporting evidence below.)

| Item | Detail | Confidence |
|------|--------|:----------:|
| ...  | ...    | verified / unverified / inferred |

## [Content-based heading for finding 2]

...

## Recommendations

| # | What | How | Why |
|---|------|-----|-----|

## Sources

(Only URLs confirmed to exist via WebFetch or gh)
```

### Format rules

- **Keep each section concise.** Reader should get the point from bold conclusions alone, without reading tables.
- **Section headings must describe content** (e.g., "CLI フレームワーク3候補の比較" not "Findings")
- **Tables: max 6 columns.** Drop low-value columns (e.g., Confidence can be footnotes if most items are verified).
- **Executive Summary → "Summary"** with 3 fixed elements: 結論 / 推奨アクション / 根拠
- Confidence marking: use only where genuinely uncertain. Don't mark every row.

## Rules

- Always output to docs/research/NNN-[topic-slug].md (never to the repo root)
- Step 0 is mandatory. Never skip scope check, even when reformatting existing content
- Never state uncertain information as fact
- Prefer tables over prose for scannability
- Do not pad the report -- shorter is better if the content is complete
