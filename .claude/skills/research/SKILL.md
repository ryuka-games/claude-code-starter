---
name: research
description: Research a topic and produce a structured RESEARCH.md report
disable-model-invocation: true
argument-hint: "[topic or question]"
---

Research the following topic and write findings to RESEARCH.md: $ARGUMENTS

## Step 1: Determine research type

Classify the topic into one of three types. This determines what to investigate and how to split subagent work.

### Market/Competitive
- **Focus**: market size, competitors, trends, positioning, SWOT
- **Subagent split**: (A) competitor landscape, (B) market trends/sizing, (C) user needs/pain points
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

## Step 4: Write report

Write RESEARCH.md using the format below. Keep it concise -- the Executive Summary alone should be enough to make decisions.

```markdown
# Research Report: [Topic]

## 1. Executive Summary
(3-5 lines. Actionable conclusions only. A reader should be able to decide next steps from this section alone.)

## 2. Findings
Structure by sub-topic using tables. For each finding, include a confidence column:
| Finding | Detail | Confidence |
|---------|--------|:----------:|
| ...     | ...    | verified / unverified / inferred |

## 3. Recommendations
Use this format for each recommendation:
| # | What to change | How to change it | Why |
|---|----------------|-----------------|-----|

## 4. Next Steps
(End with: create SPEC.md from these findings)

## 5. Sources
(Only URLs confirmed to exist via WebFetch or gh)
```

## Rules

- If RESEARCH.md already exists, use RESEARCH-[topic-slug].md
- Never state uncertain information as fact. Use the confidence system
- Prefer tables over prose for scannability
- Do not pad the report -- shorter is better if the content is complete
