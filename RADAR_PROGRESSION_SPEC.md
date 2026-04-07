# RADAR Progression System — MVP Product Spec

Last update: 7 April 2026
Status: Internal MVP note

## 1. Purpose

Create a subtle progression layer that helps users feel they are moving from random reading to intentional product usage.

This is not a gamification system.
It should:
- reinforce meaningful behavior
- make the product feel deeper and more personal
- give light orientation inside Radar

It should not:
- reward noise
- turn Radar into a game
- pressure users into compulsive behavior

## 2. Naming Direction

### Recommended
`Signal Level`

Why:
- feels native to Radar
- sounds product-like, not childish
- implies better signal recognition, not “leveling up” for its own sake
- works across content, alerts, watchlists, and future account surfaces

### Acceptable alternatives
- `Radar Progress`
- `Signal Stage`

### Avoid
- `Radar Level`
- `XP`
- `Points`
- `Badges`
- anything that sounds like a loyalty program or game mechanic

## 3. Core Principle

Progress should reflect better orientation inside the product.

The system should answer three quiet questions:
1. Where is this user now?
2. What kinds of behavior show real product maturity?
3. What becomes available next when the user is ready?

## 4. MVP Stages

These are the stages currently implied by the desktop MVP block on `Jak začít`.

### Stage 1 — Observer
- User is learning the basics and orienting themselves.
- Typical behavior: reading beginner content, exploring onboarding, understanding how Radar works.

### Stage 2 — Tracker
- User is no longer just browsing.
- They are starting to return to specific ideas, signals, or categories with intent.

### Stage 3 — Reader
- User has repeat behavior and enough context to benefit from a more personalized product layer.
- This stage should feel like “you now use Radar as a tool,” not “you unlocked a toy.”

## 5. What Counts As Meaningful Progress

Only actions that imply understanding, return behavior, or clearer intent should count.

### Good MVP progress signals
- completing practical onboarding steps in `Jak začít`
- reading core beginner `Know How` articles in the intended sequence
- opening the weekly brief at least once
- returning to the product with deliberate intent, not random clicking

### Good later progress signals
- saving signals or categories to revisit
- setting first real alert/watch item
- reading multiple briefs over time
- using watchlist or saved items across sessions

## 6. What Should Explicitly NOT Count

These should never move progress on their own:
- random pageviews
- frantic clicking
- refreshing prices repeatedly
- opening many pages with no dwell or return signal
- actions optimized only to increase a visible number
- raw session length without meaningful activity

Rule of thumb:
If an action can be easily spammed without becoming a better Radar user, it should not count.

## 7. First Realistic Unlocks / Perks

Unlocks should be useful product layers, not rewards for vanity.

### Best first unlocks
- `Saved Signals`
  - save items, ideas, or categories worth revisiting
- `Watchlist View`
  - one clean place for followed signals or tracked themes
- `Brief Resume`
  - quick return to unread or relevant weekly brief sections

### Good second-wave unlocks
- light personalization of homepage/feed emphasis
- recommended next reads based on stage and category interest
- “continue where you left off” across onboarding and Know How

## 8. What Should Wait For Later

Do not build these in MVP:
- public profiles
- shareable levels
- streaks
- coins, trophies, badges, confetti
- complex level math
- multi-path skill trees
- deep perk marketplaces
- unlocking content purely for artificial scarcity

Also wait on:
- backend-heavy scoring logic with many event types
- cross-device progression logic
- premium upsell tied too aggressively to stage labels

## 9. Long-Term Product Home

### Best long-term home
A lightweight signed-in personal surface.

Examples:
- dashboard overview
- account home
- saved signals / watchlist area
- weekly brief hub

### Why not long-term on `Jak začít`
`Jak začít` is good for introducing the idea because the user is already in onboarding mode.
But long-term progression should reflect actual product usage across Radar, not only onboarding completion.

### Recommended path
- Now: keep the concept on `Jak začít` as a product-direction MVP
- Later: move the real system to a signed-in personal overview
- Then: surface a smaller summary version in places like newsletter hub, watchlist, or alerts

## 10. MVP Implementation Shape

### For now
- desktop-only concept block is enough
- mostly non-functional is acceptable
- local/demo state is fine

### First real implementation should include
- current stage
- one progress bar or equivalent calm indicator
- 2–3 meaningful progress drivers
- one next unlock
- explicit logic for what does not count

### First real implementation should not include
- multiple competing progress meters
- noisy status icons everywhere
- reward spam across the UI

## 11. UX Tone Rules

The progression system should feel:
- editorial
- calm
- precise
- premium
- slightly aspirational

It should not feel:
- playful for the sake of it
- childish
- casino-like
- productivity-bro
- manipulative

## 12. Decision Summary

- Best MVP name: `Signal Level`
- MVP stage direction: `Observer` → `Tracker` → `Reader`
- Progress should come from meaningful orientation and usage, not activity volume
- First unlocks should be product utility, especially saved signals / watchlist behavior
- Long-term home should be a signed-in personal surface, not the onboarding page
