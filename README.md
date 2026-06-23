# 💡 Lumio — Illuminate Your Ideas

**Lumio** is a desktop-first visual communication and diagramming platform designed for educators, developers, and teams. Built with the speed of **Vite**, the power of **React**, and the native performance of **Tauri**, Lumio provides a beautiful, glassmorphism-inspired interface for creating system architectures, app flows, and visual plans.

---

## 🚀 Quick Start

### Download the Latest Release
Get the installers for Windows, macOS, and Linux from our official release page:
👉 **[Lumio GitHub Releases v1.1.0](https://github.com/sairiamu/lumio/releases/tag/v1.1.0)**

### Clone and Run Locally
If you want to contribute or build from source, follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/sairiamu/lumio.git
    cd lumio
    ```

2.  **Install Dependencies:**
    Make sure you have [Node.js](https://nodejs.org/) and [Rust](https://www.rust-lang.org/) installed.
    ```bash
    npm install
    ```

3.  **Run in Development Mode:**
    ```bash
    npm run tauri dev
    ```

4.  **Build the Production App:**
    ```bash
    npm run tauri build
    ```

---

## ✨ Key Features

### 📐 Diagram Mode (Powered by XYFlow)
*   **Custom Nodes:** Create Rectangles, Circles, Diamonds, and Rich Cards with a single click.
*   **Intuitive Connections:** Drag-and-drop handles to create labeled edges (Bezier, Straight, or Step).
*   **Smart Canvas:** Supports grid snapping, box selection, and keyboard shortcuts for a seamless flow.

### ✍️ Freehand Mode
*   **Overlay Layer:** Draw directly over your diagrams with a pressure-sensitive pen tool.
*   **Versatile Tools:** Includes pen, straight lines, and an eraser for quick annotations.

### 🎨 Beautiful Design System
*   **Glassmorphism Panels:** Modern, translucent UI that stays out of your way.
*   **Claymorphism Shapes:** Unique 3D-styled nodes that make your diagrams pop.
*   **Properties Panel:** Fine-tune colors (presets + hex), opacity, border-radius, and typography (Inter, JetBrains Mono, Sora).

### 📤 Versatile Exporting
*   **SVG:** Scalable vector graphics with embedded freehand layers and fonts.
*   **HTML:** Self-contained, single-file exports for sharing in any browser.
*   **JSON:** Save and load your project state to continue working later.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **State Management** | Zustand |
| **Canvas Engine** | @xyflow/react, HTML Canvas API |
| **Desktop Shell** | Tauri v2 (Rust) |
| **Authentication** | Clerk (Auth gate for file operations) |
| **Icons & UI** | Lucide React, Glassmorphism/Claymorphism CSS |

---

## 📂 Project Structure

The project is organized into clear modules for frontend logic, native shell, and documentation.

```text
lumio/
├── .github/workflows/      # CI/CD pipelines (Desktop, Android, iOS)
├── assets/                 # Project images, screenshots, and visual resources
├── context/                # 💡 Deep technical context & AI-assisted docs
│   ├── PROJECT_OVERVIEW.md # Mission & Philosophy
│   ├── TECH_STACK.md       # Detailed library choices
│   └── ... (see /context for more)
├── src-tauri/              # Rust-based native backend & window configuration
├── src/                    # React frontend source code
│   ├── components/         # UI components (Canvas, Shell, Panels, etc.)
│   ├── hooks/              # Custom React hooks (Mode switching, I/O)
│   ├── store/              # Zustand global state
│   └── utils/              # Export & color manipulation helpers
├── public/                 # Static assets & fonts
└── package.json            # Node dependencies and scripts
```

---

## 🤖 CI/CD Pipeline

Lumio uses **GitHub Actions** for automated testing and multi-platform distribution:

*   **Desktop Builds:** Automated builds for Windows (MSVC), macOS (Intel/ARM), and Linux (Ubuntu).
*   **Mobile Previews:** Experimental builds for Android (APK) and iOS (unsigned IPA).
*   **Update Manifest:** Automatically generates `latest.json` for Tauri's built-in updater.
*   **PR Checks:** Ensures code quality and type safety on every Pull Request.

---

## 📖 Usage Guide

1.  **Launch Lumio:** Open the application on your desktop.
2.  **Add Elements:** Use the left toolbar to select shapes (Rect, Circle, etc.) or the Pen tool for freehand drawing.
3.  **Connect & Label:** Drag from node handles to connect ideas. Double-click any node or edge to edit its text.
4.  **Style:** Select a node to open the **Properties Panel** on the right. Adjust colors, fonts, and effects.
5.  **Save/Export:** Use `Ctrl + S` to save as a `.lumio.json` or `Ctrl + E` to export your masterpiece as an SVG or HTML file.

### ⌨️ Useful Shortcuts
*   `V` - Select Tool | `P` - Pen Tool | `G` - Toggle Grid
*   `Delete` - Remove Selected | `Ctrl + Z` - Undo | `Ctrl + S` - Save

---

## 🔗 Resources & Links

*   **Releases:** [GitHub Releases](https://github.com/sairiamu/lumio/releases)
*   **Documentation:** Explore the `/context` folder for developer-specific guides.
*   **Issue Tracker:** Report bugs on the GitHub repository.

---

## 📄 License & Contribution

This project is open-source. We welcome contributions that align with our modular, AI-friendly codebase philosophy.

1.  Fork the repo.
2.  Create a feature branch.
3.  Ensure your code follows the rules in `context/CODING_RULES.MD`.
4.  Submit a Pull Request.

---
*Built with ❤️ for visual thinkers.*
