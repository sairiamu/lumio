# Design System V2 — Skeuomorphic Expansion

This document updates and expands upon `context/DESIGN_SYSTEMS.MD` for Lumio V2. It introduces support for **Electrical (Arduino)** mode while maintaining the existing **Elemental Sketch** aesthetics.

---

## 🎨 Core Semantic Palette (V2)

The following tokens replace the legacy palette and support both Light and Dark themes.

| Token             | Dark (Default) | Light          | Usage                                  |
| :---------------- | :------------- | :------------- | :------------------------------------- |
| `--surface-base`  | `#0A0B0F`      | `#F8F7F4`      | App background, Dashboard              |
| `--surface-elev`  | `#12141A`      | `#FFFFFF`      | Panel backgrounds, Modals              |
| `--canvas-bg`     | `#0D0F14`      | `#F5F4F0`      | Diagram/Circuit canvas background      |
| `--accent-main`   | `#6366F1`      | `#4F46E5`      | Primary buttons, selections, highlights|
| `--text-primary`  | `#F1F5F9`      | `#1C1917`      | Main headings, body text               |
| `--text-muted`    | `#94A3B8`      | `#78716C`      | Muted labels, placeholders             |
| `--border-soft`   | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` | Standard UI borders               |
| `--glass-bg`      | `rgba(18,20,26,0.65)`    | `rgba(255,255,255,0.7)` | Glassmorphism base            |

---

## 🛠️ Design Language Modes

### 1. Glassmorphism (App Chrome)
**Scope:** TitleBar, Sidebars, Toolbars, Dashboard, Project Picker, Modals.
- **Rule:** The "Shell" of the application remains clean and translucent.
- **Blur:** `16px` backdrop filter.
- **Elevation:** Subtle `1px` border (Iris/Steel) to define depth without clutter.

### 2. Claymorphism (Elemental Canvas)
**Scope:** Diagrams, Flowcharts, Mind Maps (Existing tool).
- **Rule:** Solid colors with hard "soft-3D" shadows.
- **Details:** Stay consistent with `context/DESIGN_SYSTEMS.MD`. Use `--clay1` through `--clay5` for fills.

### 3. Skeuomorphism (Electrical Canvas)
**Scope:** LEDs, Resistors, Arduino Boards, Breadboards, Wires.
- **Goal:** Tactile, realistic representation to aid component identification.
- **Material Rules:**
  - **Plastic (IC Bodies, LED holders):** Matte finish, subtle micro-grain texture, `inset` shadow on edges for depth.
  - **Metal (Pins, Leads):** High specular highlights (`#FFFFFF` at 60%), sharp contrast on edges to simulate light hitting wire.
  - **Silicon/PCB:** Slight satin sheen, traces rendered with a shallow emboss effect.
  - **Emissive (Lit LEDs):** Multi-layered radial gradients with a "bloom" outer shadow.
- **Shadows:** Use directional shadows (`y: 2px, blur: 4px`) to suggest components are sitting *on* the breadboard.

---

## 📢 Scope Flag: The "Glass Shell" Decision
**Proposed Answer:** Skeuomorphism is **strictly bound to the Electrical Canvas components**. 
- **Why?** The app chrome acts as a "window" or "studio" environment. Keeping it Glassmorphic maintains a professional, modern desktop utility feel. Skeuomorphic chrome (e.g., brushed metal sidebars) often feels dated and distracts from the content.
- **Contrast:** The clean Glass chrome creates a beautiful contrast with the tactile Skeuomorphic components, making the canvas pop.

---

## 📐 Electrical Canvas Specifics
- **Grid:** 2.54mm (0.1") standard pitch.
- **Wire Colors:** 
  - VCC: Red (#EF4444)
  - GND: Black (#18181B)
  - Data: Yellow (#F59E0B), Green (#10B981), Blue (#3B82F6)
- **Component Scaling:** Components must maintain a realistic aspect ratio relative to the 0.1" grid.
