# Design System: Editorial Intelligence

## 1. Overview & Creative North Star: "The Financial Cartographer"
This design system moves away from the cluttered, "noisy" aesthetic of traditional trading platforms. Our North Star is **The Financial Cartographer**: a vision of clarity, precision, and intentionality. We are not just delivering data; we are mapping the financial landscape for the next generation of Czech investors.

The experience is defined by **High-End Editorialism**. We reject the "standard SaaS" look of generic grids and thin borders. Instead, we embrace a layout driven by bold typographic scales, asymmetrical whitespace, and a "paper-stack" depth model. The UI should feel like a premium printed journal translated into a fluid digital medium—authoritative, minimalist, and surgically clean.

---

## 2. Colors & Tonal Depth
Our palette is anchored by the deep authority of `#001F3F` and the clarity of `#FFFFFF`. However, we avoid a "flat" execution by utilizing a sophisticated range of surface tiers.

### The Palette
*   **Primary (`#000613`)**: Our "Midnight" ink. Used for high-impact headlines and core branding.
*   **Primary Container (`#001F3F`)**: The "Radar Deep Blue." Used for hero sections and primary action backgrounds.
*   **Surface (`#f8f9fa`)**: The "Canvas." This is our primary background, providing a softer, more premium feel than pure hex white.
*   **Tertiary (`#110200`)**: Used sparingly as an accent to ground the deep blues.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning. We do not use "boxes" to contain ideas. Boundaries must be defined through:
1.  **Background Color Shifts:** A `surface-container-low` section sitting against a `surface` background.
2.  **Intentional Negative Space:** Using the spacing scale to create "invisible containers."

### The "Glass & Gradient" Rule
To elevate the experience from "modern" to "bespoke," use semi-transparent surfaces with backdrop-blur (`blur-xl`) for navigation bars and floating modals. CTAs should not be flat; use a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to provide a "liquid silk" finish.

---

## 3. Typography: The Editorial Voice
We use a dual-typeface system to balance character with functional readability.

*   **Display & Headlines (Manrope):** This is our "Editorial Voice." Manrope’s geometric yet warm curves provide a progressive, tech-forward feel for the young Czech market.
    *   *Usage:* Use `display-lg` for market-moving headlines. Use `headline-sm` for section starts.
*   **Body & Labels (Inter):** This is our "Functional Voice." Inter is optimized for the complex character sets of the Czech language, ensuring diacritics don't disrupt line height.
    *   *Usage:* `body-lg` for newsletter prose; `label-md` for data points and metadata.

**Hierarchy Tip:** Always pair a `display-md` headline with a `body-lg` intro paragraph. The high contrast in scale creates a "magazine" feel that guides the reader’s eye immediately to the most important narrative.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to simulate height; we use **Physicality**.

*   **The Layering Principle:** Treat the UI as sheets of fine paper. 
    *   Base: `surface`
    *   Content Sections: `surface_container_low`
    *   Interactive Cards: `surface_container_lowest` (Pure White)
    *   This "stacking" creates a natural lift that feels architectural rather than digital.
*   **The "Ghost Border" Fallback:** If a divider is mandatory for data density, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.
*   **Ambient Light:** Floating elements (like "New Post" notifications) use a diffused shadow: `y-20, blur-40, color: on_surface (8% opacity)`.

---

## 5. Components

### Cards & Data Modules
*   **Rule:** Forbid divider lines. Use `surface_container_highest` for a subtle header background within a card, or simply rely on the spacing scale.
*   **Style:** `rounded-lg` (0.5rem) for a modern, slightly softened edge that maintains a professional "sharpness."

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. White text. No border. `rounded-full` for high-action visibility.
*   **Secondary:** Ghost style. No background. `outline_variant` (at 20% opacity) with `primary` text.
*   **Tertiary/Link:** Underlined `primary` text, but the underline is offset by 4px and uses a 2px weight in `primary_fixed_dim`.

### Inputs & Fields
*   **Style:** Minimalist. No enclosing box. A bottom-only "Ghost Border" that transitions to 2px `primary` on focus.
*   **Labels:** Always `label-md` in `on_surface_variant`, positioned 8px above the input.

### Signature Component: The "Radar Pulse"
For financial alerts or "Live" updates, use a small chip using `tertiary_container` with a slow, 2-second opacity pulse. This provides urgency without the "stress" of traditional red error colors.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Align headlines to the left while keeping data points in a right-aligned column to create a sophisticated, non-template rhythm.
*   **Use High Contrast:** Ensure `on_surface` text against `surface` backgrounds exceeds 7:1 contrast ratios for the best readability during late-night market sessions.
*   **Respect the "Czech Context":** Ensure typography settings account for longer Czech words (e.g., *příležitost*) without breaking the layout.

### Don't:
*   **No "Heavy" Shadows:** Never use high-opacity, dark grey shadows. They look "cheap" and dated.
*   **No Centered Body Text:** Financial newsletters are for consuming information. Keep body text left-aligned for maximum reading speed.
*   **No Grid-Lock:** Don't feel forced to fill every column. If a piece of data is important, give it its own full-width row with generous `surface_container` padding.

---
*Director's Final Note: Design for the silence between the data. The whitespace is where the investor finds the clarity to make a decision.*