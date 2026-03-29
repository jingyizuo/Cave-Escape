# Cave Escape

First-person WebGL room-escape prototype developed for **UCLA CS174A (Computer Graphics)**. The player explores a cave, solves light-based and combination puzzles, and interacts with props via GPU-accelerated picking.

---

## Technical highlights

| Topic | Implementation |
|--------|----------------|
| **Object picking** | Off-screen framebuffer pass: each interactive mesh is rendered with a distinct ID color via an offscreen shader variant; `readPixels` at the reticle resolves the hit object. Classic **color-index / ID buffer** picking aligned with the real-time pipeline. |
| **First-person navigation** | WASD translation and mouse-driven camera rotation derived from cursor delta; uses the course **view / projection** matrices and camera stack (`Movement_Controls` in the bundled framework). |
| **Lighting & gameplay** | **Phong-style** shading and torch toggles change global illumination; extinguishing lights reveals a **fluorescent hint texture**, tying shading to puzzle state. |
| **Fire visualization** | **2D canvas particle system** (position, lifetime, radial gradients); frames are sampled into a **dynamic WebGL texture** applied to billboards—*screen-to-texture*, not volumetric simulation. |
| **Asset pipeline** | Cave and props modeled in **Blender**, exported as **OBJ**, loaded at runtime and instanced with per-object transforms and UV treatment where needed. |

<p align="center">
  <img src="screenshot_README/mouse_picking.gif" alt="Framebuffer picking" width="420" />
  &nbsp;
  <img src="screenshot_README/free_move.gif" alt="First-person navigation" width="420" />
</p>

---

## Gameplay (summary)

Solve torch combinations using wall hints, open the safe, acquire the pistol, and clear the exit. Interactions are click-driven after picking resolves the target object.

---

## Controls

- **W A S D** — Move  
- **Mouse** — Look  
- **Click** — Interact / pick up  

---

## Running locally

The build uses **ES modules** and **WebGL**; serve the repo over **HTTP** (not `file://`).

```bash
npm install
npm run dev          # opens index.html; live reload
```

```bash
python3 server.py    # optional; PORT=9000 python3 server.py to fix the base port
```

- **Start screen:** `/` → `index.html`  
- **Game:** `game.html`  
- **host.bat** / **host.command** — launch `server.py` (Windows / macOS).

---

## Deployment (Vercel)

Import the repository, preset **Other**, leave **Build Command** and **Output Directory** empty. Production serves **`index.html`** at `/` and **`game.html`** for the WebGL client.

**Embedding `game.html` in another site (e.g. a portfolio iframe):** your parent page’s CSP / sandbox is out of this repo’s control, but this project ships **`vercel.json`** headers on **`/game.html`** (`Content-Security-Policy: frame-ancestors *`, plus a permissive `Permissions-Policy`) so the game origin explicitly allows cross-origin framing. Console warnings that still attribute to **`game.html`** are often from **third-party embeds** (YouTube iframes for ambience): this repo registers **no** `unload` / `beforeunload` listeners; background YouTube is **deferred** until the first `pointerdown` or `keydown` inside the game frame to reduce early third-party work. Torch “fire” audio still loads a YouTube iframe when torches are lit. `python3 server.py` applies the same `game.html` headers for local checks.

---

## Repository layout

| Path | Role |
|------|------|
| `game.html` | WebGL canvas and game bootstrap |
| `index.html` / `end.html` | Shell pages |
| `src/` | Application modules (scene graph, picking logic, UI hooks, fire particles) |
| `lib/` | Course graphics framework (`tiny-graphics`, widgets, `common/index.js`) |
| `assets/` | `models/` (OBJ), `textures/`, `audio/`, `ui/`, `shell/` (GIF backgrounds) |
| `styles/` / `js/` | Page CSS and shell layout helper |

---

## Authors

**Team In-N-Out** — Jingyi Zuo, Jiani Liu, Weikang Yang (CS174A final project).

Additional screenshots: `screenshot_README/`.
