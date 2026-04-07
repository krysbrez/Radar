# Signal Level — MVP Event Model Note

Last update: 7 April 2026
Status: Internal note

## 1. Purpose

Define the first real logic for meaningful progress in `Signal Level`.

This note is intentionally narrow.
It answers:
- which user actions count
- when they count
- how often they count
- what thresholds move a user forward

It does not define:
- UI
- backend architecture
- analytics tooling
- long-term scoring complexity

## 2. Principles

The model should reward:
- orientation
- understanding
- intentional return behavior

The model should not reward:
- noise
- compulsive activity
- empty pageview volume

Rule:
If an action can be spammed without making the user better oriented inside Radar, it should not move Signal Level.

## 3. MVP Stage Flow

`Observer` → `Tracker` → `Reader`

## 4. Event Model Structure

Each counted event should define:
- `event_name`
- `what_it_means`
- `count_rule`
- `when_it_counts`
- `stage_relevance`

## 5. Counted MVP Events

### Event 1: `getting_started_step_completed`

What it means:
- user completed one concrete step in `Jak začít`

Count rule:
- counts once per step
- maximum count in MVP: 3

When it counts:
- only when the step is explicitly marked complete

Stage relevance:
- strongest signal for `Observer` → `Tracker`

Why it matters:
- practical onboarding completion is a better signal than passive reading

### Event 2: `knowhow_core_article_completed`

What it means:
- user completed one core beginner article from the defined sequence

Count rule:
- counts once per unique core article
- maximum count in MVP progression logic: 4

When it counts:
- only after the article passes a minimum completion threshold

Recommended MVP threshold:
- user reaches at least 70% scroll depth
- and spends at least 45 seconds on page

Stage relevance:
- supports both stages, especially early orientation

Why it matters:
- shows real engagement with foundational concepts, not just clicking around

### Event 3: `weekly_brief_opened_meaningfully`

What it means:
- user opened the weekly brief and meaningfully engaged with it

Count rule:
- first meaningful open counts for progression
- later opens can be tracked, but do not need to move MVP stage on their own

When it counts:
- only if the brief stays open for at least 30 seconds
  OR
- user opens and clicks into at least one linked section/article from it

Stage relevance:
- key signal for `Tracker` → `Reader`

Why it matters:
- opening the brief is a strong sign that Radar is becoming a recurring product, not just a one-off site visit

### Event 4: `return_visit_meaningful`

What it means:
- user returned on a different day and engaged with content intentionally

Count rule:
- counts once per day
- maximum useful count in MVP progression logic: 2

When it counts:
- only on a new calendar day
- and only if one of these is also true during the session:
  - completed a `Know How` core article
  - completed a `Jak začít` step
  - meaningfully opened the weekly brief

Stage relevance:
- mostly useful for `Tracker` → `Reader`

Why it matters:
- return behavior is important, but should never count by itself without meaningful action

## 6. Actions That Count Only Once

These should count only once per unique unit:
- each `Jak začít` step completion
- each core `Know How` article completion
- first meaningful weekly brief open

Reason:
- prevents inflation through repetition
- keeps progress tied to breadth of orientation, not repetitive loops

## 7. Actions That May Count Repeatedly

Very few actions should repeat in MVP.

Allowed repeated signal:
- `return_visit_meaningful`
  - at most once per day
  - only if paired with meaningful action

Reason:
- repeat behavior matters
- but only when it reflects actual product usage

## 8. Recommended MVP Thresholds

### Move `Observer` → `Tracker`

Require all of:
- at least 2 completed `Jak začít` steps
- at least 2 completed core `Know How` articles

Optional supporting signal:
- 1 meaningful return visit can accelerate confidence, but should not replace the two requirements above

Interpretation:
- user has both practical onboarding movement and enough conceptual grounding

### Move `Tracker` → `Reader`

Require all of:
- at least 3 completed `Jak začít` steps
- at least 4 completed core `Know How` articles
- at least 1 meaningful weekly brief open
- at least 1 meaningful return visit on a different day

Interpretation:
- user is no longer just onboarding
- they are showing recurring, cross-surface product behavior

## 9. Core Article Set for MVP

Only a defined beginner set should count for stage movement.

Recommended initial set:
- `co-jsou-penize`
- `k-cemu-penize-slouzi`
- `co-je-inflace-pizza`
- `sporeni-vs-investovani`
- `co-je-riziko`
- `co-jsou-etf`
- `dca-strategie`
- `jak-zacit-investovat-jednoduse`

MVP logic should use only the first 4 completed from this set for threshold purposes.

Reason:
- enough to show real orientation
- avoids overcomplicating stage movement

## 10. Actions That Should Explicitly NOT Count

Do not count:
- plain pageviews
- homepage visits alone
- scrolling without time threshold
- repeated reloads
- repeated opens of the same article without completion threshold
- rapid tab switching
- price refresh behavior
- ticker watching
- random archive browsing
- newsletter signup alone

Why:
- these are too easy to fake
- they overvalue noise
- they make the system feel manipulative fast

## 11. Anti-Fake-Progress Rules

### Rule 1
No event should count purely from opening a page.

### Rule 2
Reading events must require both time and depth.

### Rule 3
Return visits only count when paired with meaningful action.

### Rule 4
Repeat actions should have hard caps in MVP.

### Rule 5
Stage movement should require mixed behavior, not one repeated action type.

Example:
Three article completions alone should not create the same outcome as:
- onboarding steps
- article understanding
- weekly brief engagement

## 12. Cleanest MVP Version

If we want the simplest credible implementation, use only four event families:
- `getting_started_step_completed`
- `knowhow_core_article_completed`
- `weekly_brief_opened_meaningfully`
- `return_visit_meaningful`

And only two thresholds:

### `Observer` → `Tracker`
- 2 `Jak začít` steps
- 2 core `Know How` completions

### `Tracker` → `Reader`
- 3 `Jak začít` steps
- 4 core `Know How` completions
- 1 meaningful weekly brief open
- 1 meaningful return visit

That is enough for MVP.

## 13. Decision Summary

- Count practical onboarding, foundational reading, meaningful brief engagement, and deliberate return behavior
- Count breadth before frequency
- Most actions should count once, not repeatedly
- Stage movement should require mixed signals
- Avoid any metric that can be farmed through shallow activity
