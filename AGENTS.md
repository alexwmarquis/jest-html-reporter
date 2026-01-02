# Agents instructions

## Purpose

This file defines strict operating rules for cursor agents to minimize token usage while still producing correct, high-quality changes.

These rules override default “read everything” behavior.

## Non-negotiable constraints

1. Do not read broadly.
2. Do not load whole files by default.
3. Do not open more than the allowed number of files per phase.
4. Do not repeat context that already exists in the chat or diff.
5. Do not produce large outputs unless explicitly requested.
6. Do not “just in case” explore folders or follow import chains.
7. Prefer search over opening files.
8. Prefer targeted snippets over full-file ingestion.

If a rule conflicts with task success, stop and ask for the single missing detail needed.

## Token budget model

Treat tokens like money.

- Every file open has a cost.
- Every large paste has a cost.
- Every repeated explanation has a cost.
- Every speculative exploration has a cost.

Default to the cheapest path that can still be correct.

## Operating phases and limits

### Phase 0: Confirm task intent

Goal: Restate the task in one sentence and list success criteria.

Limits:

- 0 file opens.
- 0 tool calls.

### Phase 1: Diff-first reasoning

Goal: Use the provided diff or described change as the primary source of truth.

Limits:

- 0 file opens if the diff is sufficient.
- If you must open files, follow phase 2 limits.

### Phase 2: Minimal context acquisition

Goal: Gather only the minimum code needed to implement the change safely.

Hard limits:

- Maximum file opens: 3.
- Maximum total lines read: 200.
- Maximum directory traversal: 1 level.

Rules:

- Start at the entrypoint file or the file directly referenced by the user or diff.
- If you need more context, do a search for the specific symbol first.
- If you need additional files beyond limits, stop and ask which file is authoritative.

### Phase 3: Plan then edit

Goal: Propose a short plan before making edits.

Limits:

- Plan must be 3 to 7 bullets.
- Each bullet must be one sentence.
- No long rationale.

### Phase 4: Verify

Goal: Provide the smallest verification step that increases confidence.

Limits:

- Prefer “what to run” in 1 to 3 commands.
- If tests are expensive, propose the narrowest test.

## File reading protocol

### Default behavior

- Never open an entire file.
- Read only the relevant section.
- Prefer reading by searching for a symbol, function, or error string.

### When opening a file, follow this order

1. Read the exported surface (exports, public functions, types).
2. Read the exact function(s) touched by the change.
3. Read callers only if required to understand behavior.

### Stop conditions

Stop reading immediately when you can answer:

- What is the current behavior?
- What must change?
- Where is the narrowest place to implement?

## Search protocol

Prefer search for:

- Symbol names (functions, classes, constants).
- Error messages.
- Api routes, file names, test titles, tag strings.

Search queries should be specific:

- “renderTemplate error variant”
- “TemplateSectionRegistry”
- “validateTemplateInput”
- “toHaveText template header”

Do not search entire repo for broad terms like “template” unless asked.

## Import and dependency chasing rules

- Do not follow imports recursively.
- Follow at most one hop from the current file.
- If the second hop is needed, stop and ask for the authoritative module.

When faced with indirection (barrels, registries, factories):

- Look for the single orchestration point.
- If it is unclear, ask for the entrypoint file path.

## Summarization protocol

If you read any non-trivial code, produce a micro-summary that prevents rereads.

Format:

- “Context summary:” followed by 3 to 6 bullets.
- Each bullet must be under 20 words.
- Include file paths and symbol names.

Example:

- Context summary:
  - src/template/index.ts exports buildTemplate and renderTemplate.
  - buildTemplate composes sections via sectionRegistry.
  - errors are normalized by formatTemplateError.

Do not restate the same summary later unless the context changed.

## Output shaping rules

### Default response format

1. One sentence describing the change.
2. A short list of edits (file path + what changed).
3. Verification commands.

### Do not include

- Full file rewrites unless requested.
- Large pasted code blocks unless required.
- Multi-paragraph explanations.
- Repetition of the same rationale.

### When code is required

- Provide the smallest diff-like snippet.
- Prefer showing only the changed function(s).
- If a file is large, show only the edited sections.

## Editing strategy

### Prefer surgical edits

- Change the narrowest function that controls behavior.
- Avoid cross-cutting refactors unless explicitly requested.
- Avoid “cleanup” changes that increase diff size.

### Avoid style churn

- Do not reformat unrelated lines.
- Do not reorder imports unless required.
- Do not rename symbols unless requested.

### When refactoring is required

- Keep the public api stable.
- Preserve behavior with tests.
- Make one refactor at a time.

## Guardrails for large refactors

If the request is broad (modularization, architecture changes, big migrations):

1. Require an entrypoint.
2. Require a minimal acceptance test or observable behavior.
3. Work in slices:
   - Slice 1: add new path in parallel.
   - Slice 2: switch call site.
   - Slice 3: delete old path.

Do not attempt a full rewrite in one pass.

## Clarifying question policy

Ask a question only when it saves tokens overall.

Allowed reasons:

- Missing entrypoint file path.
- Conflicting sources of truth.
- Multiple possible intended behaviors.
- Tests are too expensive and need selection.

When asking:

- Ask one question.
- Provide a default assumption and proceed if reasonable.

## Verification policy

Prefer the smallest confidence boost.

Examples:

- Unit tests for the touched module.
- One targeted spec file.
- Typecheck only for types-only change.

Provide commands in a tight list, for example:

- npm test -- <pattern>
- npx playwright test <spec> --grep "<title>"
- npm run typecheck

Do not propose full ci runs unless requested.

## Documentation policy

If you change behavior, update the closest docs:

- inline comments near the behavior
- a small section in a readme
- an example usage snippet

Do not create long docs unless requested.

## Common anti-patterns to avoid

1. Reading entire directories “to understand the system.”
2. Opening more than 3 files before proposing a plan.
3. Re-explaining the same context multiple times.
4. Producing long alternatives without a recommendation.
5. Making “nice to have” refactors that bloat the diff.
6. Following import chains through barrels and re-exports.
7. Copying large chunks of code into chat.

## Decision heuristics

Choose the cheapest correct option.

- If a change can be made in one file, do not touch three.
- If a change can be made with a wrapper, do not refactor internals.
- If a test already exists, extend it rather than creating a new suite.

## Templates

### Micro-plan template

Plan:

- Identify the narrowest function controlling the behavior.
- Implement the minimal change.
- Update or add the smallest test.
- Run the smallest verification command.

### Edit summary template

Edits:

- path/to/file.ts: <what changed in one sentence>
- path/to/test.spec.ts: <what changed in one sentence>

Verify:

- <command 1>
- <command 2>

### If context is missing

I can proceed with assumption: <assumption>.
If that is wrong, please provide: <single missing file path or symbol>.

## “Do this first” checklist

Before doing any work:

- Do i have the diff or the file path?
- Do i have the exact intended behavior?
- Can i make the change in one file?
- Can i verify with one small test?

If any answer is “no,” ask one targeted question.

## “Stop now” checklist

Stop and ask for guidance if:

- You need to open a 4th file.
- You need to read more than 200 lines.
- You cannot identify the entrypoint.
- There are multiple plausible behaviors with no clear intent.
- The change touches more than 3 modules unexpectedly.

## Notes for modular codebases

Modularization is token-cheap only when navigation is obvious.

When the code is split across many files:

- Always start at the entrypoint module.
- Use search to jump to the exact symbol.
- Do not browse folders.
- Do not open registries or barrels unless required.

If the entrypoint is unclear, request it immediately.

## Compliance statement

If any instruction here conflicts with a user request, follow the user request.
Otherwise, follow this file to minimize token usage.
