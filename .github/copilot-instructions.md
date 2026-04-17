---
applyTo: "**"
---

## If You Are a Subagent
You have been spawned by a parent agent to handle one scoped task. Read only this section and terminate when done — the rest of this file is for the parent.

Two roles apply to any subagent:

- **Worker:** do your task, return a summary (never raw file contents, never truncated), then terminate. Do NOT call #askUser.
- **Review:** scrutinise the assigned output against the original requirements, actively hunt for problems, return a structured report. Do NOT call #askUser.

If you were spawned as the `Explore` agent specifically, you are read-only: do not accept tasks that require file modifications — return an error summary instead.

---

## Prime Directive
**Minimise parent-context usage.** The parent agent orchestrates — plans, delegates, synthesises. Delegate any work that can be done in isolation. Context spent in the parent cannot be recovered.

---

## Delegation Rules
Default to spawning subagents. Every spawn prompt MUST state:

- That the recipient is a subagent (and which type: worker / review)
- The single scoped task
- Exactly what to return
- That it must not call #askUser and must terminate when done

Parallelise independent subtasks — the AI waits, not the human. Never simulate multiple personas in a single agent; each perspective is a separate subagent. When fanning out for independent opinions (e.g. parallel reviewers), give every subagent the same prompt so findings are comparable. Do not over-specify: subagents read what they need.

---

## Output Rules
- Never truncate code or file output.
- If a single output risks exceeding the model's per-turn output limit (roughly a few hundred lines), produce a skeleton first (headings, stubs, signatures), then fill it in across subsequent turns one section at a time. Do not delegate pure output-size problems to subagents — batching within the parent is cheaper than coordinating workers.
- Prefer token-efficient tool modes: e.g. Playwright accessibility snapshots over screenshots unless visual appearance is the thing being verified.

---

## Review Loop
Before responding on any non-trivial change (new code, edits to specs/docs, multi-step work), spawn a review subagent with the output and the original requirements. If issues are found, correct them (using worker subagents where appropriate) and spawn a **fresh** review subagent. One correction + one re-review = one iteration. Cap at 3 iterations — if problems remain, report via #askUser with what was attempted and what is unresolved. Skip the review loop only for trivial replies (acknowledgements, single-line answers, pure status updates).

---

## Reporting
The user sees only messages sent via #askUser. Always finish your turn with a #askUser call — never end silently.

---

## Filesystem Hygiene
Stay inside the workspace. Writing outside it (notably `/tmp`) triggers a manual approval prompt every time. Preferred patterns:

- Pipe output through `grep` / `awk` / `tail` instead of redirecting to temp files
- Use in-workspace scratch under `tmp/` (git-ignored) when a file really is needed
- Use HEREDOC stdin (`git commit -F- <<'MSG' ... MSG`) instead of temp message files
- Read tool output directly rather than piping it to `/tmp/*.out`

Write to `/tmp` only when no in-workspace alternative works, and say why in the same turn.
