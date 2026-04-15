# Design System Specification: The Architectural Scholar

This design system is a high-end, editorial framework crafted for the technical visualization of data structures. It moves away from the "utility-first" clutter of traditional educational tools, favoring a sophisticated, layered approach that treats code and logic as a form of digital art.

---

## 1. Creative North Star: "The Living Blueprint"
The design system is guided by the **Living Blueprint** philosophy. Rather than presenting data on a flat, static canvas, we treat the UI as an evolving architectural diagram. We prioritize intentional asymmetry, expansive breathing room, and a sense of "physicality" achieved through tonal layering rather than rigid lines. This is not just a tool; it is a curated environment for deep focus.

---

## 2. Color & Surface Philosophy

The palette moves beyond basic colors into a sophisticated tonal range designed to reduce cognitive load while maintaining professional authority.

### Tonal Hierarchy
*   **Primary (Education Blue):** `#0058be` (Primary) to `#2170e4` (Primary Container). Use the `primary_container` for interactive surfaces to provide a deeper, more resonant blue than standard web-safe colors.
*   **Success & Warning:** Instead of loud, vibrating greens and oranges, we use `secondary` (`#006c49`) for additions and `tertiary` (`#825100`) for deletions. These earthy, refined tones provide clarity without the "alert fatigue" of standard neon signals.
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through background shifts. For example, a `surface_container_low` section sitting on a `surface` background creates a natural edge that feels integrated, not "boxed in."

### Glass & Gradient Rules
*   **Signature Textures:** For primary CTAs or the "Active Node" in a tree, use a subtle linear gradient from `primary` to `primary_container`. This adds a 3D "soul" to the element.
*   **Glassmorphism:** Floating panels (like tooltips or floating action menus) should utilize `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur. This ensures the data structure remains visible beneath the UI layers.

---

## 3. Typography: Editorial Clarity

We utilize a dual-font strategy to balance technical precision with high-end editorial aesthetics.

*   **Display & Headlines (Manrope):** We use Manrope for all `display` and `headline` scales. Its geometric yet warm curves provide a modern, "tech-boutique" feel.
    *   *Usage:* Use `display-md` for large data counts and `headline-sm` for section titles to command authority.
*   **Interface & Data (Inter):** Inter is our workhorse for `title`, `body`, and `label` scales. It is optimized for the high readability required when scanning complex tree nodes or word entries.
    *   *Hierarchy Tip:* Use `label-md` in all-caps with 5% letter spacing for technical metadata to give it a "pro-tool" aesthetic.

---

## 4. Elevation & Depth: The Layering Principle

In this design system, depth is a functional tool used to communicate the hierarchy of data structures.

*   **Tonal Layering:** Instead of drop shadows, we stack surfaces. 
    *   **Level 0 (Canvas):** `surface` (#f7f9fb)
    *   **Level 1 (Sub-sections):** `surface_container_low`
    *   **Level 2 (Cards/Nodes):** `surface_container_lowest` (Pure White)
*   **Ambient Shadows:** Shadows are reserved only for "floating" states (e.g., dragging a node). Use a `32px` blur with 6% opacity, tinted with the `on_surface` color.
*   **The Ghost Border Fallback:** If a node requires a border for accessibility, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Tree Nodes & Word Cards
*   **Style:** Forbid dividers. Use `surface_container_lowest` cards with a `lg` (0.5rem) corner radius.
*   **Interaction:** On hover, a node should transition from `surface_container_lowest` to a subtle gradient of `primary_fixed_dim`. 
*   **Nesting:** Tree branches should be connected by "Ghost Borders" (low-opacity lines) to maintain the "Blueprint" aesthetic.

### Input Fields
*   **Layout:** Remove the traditional four-sided box. Use a `surface_container_highest` background with a `sm` (0.125rem) bottom-only accent in `primary`.
*   **Focus State:** The field should smoothly expand its bottom accent into a `2px` line, signaling an "Active Entry" mode.

### Buttons
*   **Primary:** A pill-shaped (`full` roundedness) element using the `primary` token. No shadow; instead, use a subtle inner-glow (1px white top-border at 20% opacity).
*   **Tertiary (Ghost):** Text-only with `label-md` styling. Ensure `on_surface_variant` is used for the color to keep it subordinate to the data visualization.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `surface_container` tiers to create "islands" of information.
*   **Do** embrace white space. If a layout feels crowded, increase the spacing between cards rather than adding a divider.
*   **Do** use `secondary_fixed` for "Success" states to ensure the green feels premium and soft, not jarring.

### Don't:
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#191c1e) to maintain a soft, high-end contrast.
*   **Don't** use standard "drop shadows" on cards. Rely on the contrast between `surface` and `surface_container_lowest`.
*   **Don't** use more than two levels of nesting without shifting the background tone; visual "flatness" is the enemy of technical clarity.