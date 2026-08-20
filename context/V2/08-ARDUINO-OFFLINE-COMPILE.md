# Stage 8 — Offline .ino → .hex Compile

## Read First
- `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json` — confirmed today: no
  `tauri-plugin-shell`, no sidecar configured. Must be added.
- `src-tauri/capabilities/default.json` — currently scopes `opener`, `dialog`, `fs`,
  `updater`, `process`. New sidecar capability must be added here, scoped narrowly (only
  permission to run the bundled `arduino-cli` binary, nothing broader).
- `src-tauri/src/lib.rs` — where Tauri commands are registered; new compile command goes
  here.

## Size Note
Bundled `arduino-cli` + AVR core + `avr-gcc` toolchain adds roughly **150-250MB per
platform** to the installer — confirmed acceptable, well under the 500MB ceiling.

## Task
1. Add `tauri-plugin-shell` to `src-tauri/Cargo.toml` and the frontend package.
2. Configure sidecar binary in `src-tauri/tauri.conf.json` (`bundle.externalBin`) — one
   `arduino-cli` binary per target platform (Windows/macOS/Linux).
3. Add narrowly-scoped permission in `src-tauri/capabilities/default.json` for running
   only this sidecar.
4. New Tauri command in `src-tauri/src/lib.rs`: writes sketch to temp dir, runs
   `arduino-cli compile --fqbn arduino:avr:uno`, returns stdout/stderr + resulting `.hex`
   path (or error).
5. Frontend: code editor panel (check `package.json` first for an existing editor dep
   before adding Monaco or similar) for the `.ino` sketch, wired to a "Compile" action that
   calls the new command and feeds the `.hex` into Stage 7's simulation hook.
6. Compile errors shown inline with line numbers where `arduino-cli` provides them — not
   raw CLI dump in a toast.