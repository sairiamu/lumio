# Tech Stack

## Frontend
- **React 18** with functional components and hooks only — no class components
- **Vite** as build tool and dev server
- **TypeScript** — strict mode, all components typed
- **Tailwind CSS v3** — utility classes only, no custom CSS files except globals
- **@xyflow/react** — node-graph canvas for diagrams and flowcharts
- **HTML Canvas API** — freehand drawing layer, overlaid on XYFlow

## Desktop Shell
- **Tauri v2** — native window, custom titlebar, file system access
- Tauri plugins used: `tauri-plugin-fs`, `tauri-plugin-dialog`, `tauri-plugin-window`
- Frameless window with custom React titlebar component

## Auth
- **Clerk** — email/password auth, used only to gate file save/load
- ClerkProvider wraps the entire app in main.tsx

## Fonts (Google Fonts, loaded in index.html)
- `Inter` — all UI panels, buttons, labels
- `JetBrains Mono` — canvas text labels, diagram node text
- `Sora` — app title, modal headings

## Icons
- `lucide-react` — consistent icon set throughout

## Export Libraries
- `@xyflow/react` built-in `toSvg()` and `toObject()` for XYFlow export
- Native canvas `.toDataURL()` for freehand layer
- Custom merge utility combines both layers into final SVG/HTML

## No Python
- All logic is frontend TypeScript
- No backend server at any point