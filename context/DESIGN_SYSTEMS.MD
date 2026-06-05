# Design System — "Slate Studio"

## Design Language
Two visual styles coexist intentionally:
- **Glassmorphism** — all UI chrome: panels, toolbars, modals, sidebars
- **Claymorphism** — all canvas shapes: nodes, cards, diagram elements

## Colour Palette

| Token          | Name     | Hex       | Usage                        |
|----------------|----------|-----------|------------------------------|
| --void         | Void     | #0F1117   | App background               |
| --ash          | Ash      | #1C1E26   | Canvas surface               |
| --graphite     | Graphite | #252830   | Panels, sidebar base         |
| --steel        | Steel    | #3A3D4A   | Borders, dividers            |
| --iris         | Iris     | #6366F1   | Primary accent, selection    |
| --iris-light   | Iris 40% | #6366F166 | Hover states, glow           |
| --mint         | Mint     | #34D399   | Success, connect handles     |
| --ember        | Ember    | #F87171   | Delete, error, danger        |
| --cloud        | Cloud    | #E2E8F0   | Primary text                 |
| --fog          | Fog      | #94A3B8   | Muted text, placeholders     |
| --clay-blue    | CBlue    | #7EB8F7   | Clay node fill — blue        |
| --clay-purple  | CPurple  | #B48EF7   | Clay node fill — purple      |
| --clay-green   | CGreen   | #6EDBB4   | Clay node fill — green       |
| --clay-peach   | CPeach   | #F7A97E   | Clay node fill — peach/warm  |
| --clay-pink    | CPink    | #F78EBF   | Clay node fill — pink        |

## Glassmorphism Rules (UI panels/toolbars/modals)
- Background: `rgba(37, 40, 48, 0.65)` — semi-transparent graphite
- Backdrop filter: `blur(16px) saturate(180%)`
- Border: `1px solid rgba(255,255,255,0.08)`
- Box shadow: `0 8px 32px rgba(0,0,0,0.4)`
- Border radius: `16px` for panels, `12px` for cards, `8px` for buttons
- Never fully opaque — glass effect must always be visible

## Claymorphism Rules (canvas shapes/nodes)
- Background: solid clay colour (from palette above), NOT transparent
- Box shadow: `6px 6px 0px rgba(0,0,0,0.25)` — hard offset shadow (clay feel)
- Inner highlight: `inset 0 2px 4px rgba(255,255,255,0.3)` — soft top sheen
- Border: `2px solid rgba(255,255,255,0.2)`
- Border radius: `20px` for cards/rectangles, `50%` for circles, `12px` for diamonds
- On hover: scale `1.02`, shadow deepens slightly
- Transition: `all 0.15s ease`

## Typography

| Use Case         | Font           | Weight | Size  |
|------------------|----------------|--------|-------|
| App title        | Sora           | 700    | 18px  |
| Panel headings   | Sora           | 600    | 13px  |
| UI labels        | Inter          | 500    | 12px  |
| Buttons          | Inter          | 600    | 13px  |
| Canvas node text | JetBrains Mono | 500    | 13px  |
| Muted/secondary  | Inter          | 400    | 11px  |

## Spacing Scale
- Base unit: 4px
- Panel padding: 16px
- Section gap: 12px
- Icon size: 16px (toolbar), 14px (panel)
- Toolbar item size: 36x36px

## Component States
- Default → muted borders, fog text
- Hover → iris-light background, cloud text
- Active/Selected → iris border + iris-light background
- Destructive → ember colour
- Disabled → 40% opacity, no pointer events