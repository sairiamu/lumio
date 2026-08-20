# Stage 8 — Offline .ino → .hex Compile Pipeline

## Depends On
Stage 7's simulation loop already consuming `.hex` files.

## Approach
Bundle `arduino-cli` as a **Tauri sidecar binary** and invoke it from the Rust side
(`src-tauri`). This requires:
- Adding `tauri-plugin-shell` to `Cargo.toml` and `package.json` (not currently present —
  verified against current `src-tauri/Cargo.toml` and `tauri.conf.json`, which only have
  `opener`, `dialog`, `fs`, `updater`, `process`).
- Configuring the sidecar in `tauri.conf.json` (`bundle.externalBin`), one prebuilt
  `arduino-cli` binary per target platform (Windows/macOS/Linux) — this materially
  increases installer size per platform; flag this tradeoff to the user, don't just do it
  silently.
- A capability/permission entry in `src-tauri/capabilities/default.json` scoped to just
  running that sidecar — do not grant broad shell access.
- Bundling (or first-run downloading, offline-first means bundling) the `avr-gcc` core +
  Arduino AVR board package that `arduino-cli` needs to compile for Uno.

## Task
- A code editor panel (Monaco, matching what `avr8js`'s own demo uses, or reuse an existing
  editor dependency if one already exists in the repo — check before adding a new one) for
  writing the `.ino` sketch per Electrical project.
- "Compile" action: writes sketch to a temp dir, invokes the sidecar
  (`arduino-cli compile --fqbn arduino:avr:uno`), captures stdout/stderr for error display,
  reads back the resulting `.hex`, and feeds it into Stage 7's simulation loop.
- Compile errors surface inline (line numbers if `arduino-cli` provides them) — do not just
  dump raw CLI output into a toast.

## Open Questions
- Confirm it's acceptable to ship a multi-hundred-MB larger installer per platform for the
  bundled toolchain before starting this stage — this is a real product tradeoff, not just
  an implementation detail.