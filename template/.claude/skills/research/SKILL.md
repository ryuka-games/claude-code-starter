---
name: research
description: Research a topic and produce a structured RESEARCH.md report
disable-model-invocation: true
argument-hint: "[topic or question]"
---

Research the following topic and write findings to RESEARCH.md: $ARGUMENTS

## Process

1. Determine the research type from the topic:
   - **Market/Competitive**: market size, competitors, trends, SWOT
   - **Tech Selection**: candidate libraries/frameworks, comparison, PoC feasibility
   - **Codebase/Impact**: relevant code, dependencies, blast radius of changes
2. Use web search (if available) to supplement knowledge beyond the training cutoff
3. Use subagents for parallel exploration when multiple areas need investigation
4. Cross-verify findings -- do not rely on a single source
5. Write the report to RESEARCH.md using the format below

## Output Format (RESEARCH.md)

```markdown
# Research Report: [Topic]

## 1. Executive Summary
## 2. Background & Objectives
## 3. Findings
## 4. Comparison Table (if applicable)
## 5. Recommendations
## 6. Next Steps
## 7. Sources
```

## Important

- State uncertainty explicitly -- if unsure, say so rather than hallucinate
- Include source URLs for all factual claims
- End "Next Steps" with: create SPEC.md from these findings
- If RESEARCH.md already exists, use RESEARCH-[topic-slug].md instead
