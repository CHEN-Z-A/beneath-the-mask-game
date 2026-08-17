# Assembly Guide Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make every placed fragment in all four levels align exactly with its assembly-page guide at every supported landscape scale.

**Architecture:** Store per-theme fragment geometry in the art layer using the same `400 × 520` coordinate system as the mask outline. Render one full-board SVG layer per fragment and switch that same layer from translucent guide state to opaque placed state, eliminating independent guide and result positioning.

**Tech Stack:** HTML, CSS, vanilla JavaScript, SVG, Node.js validation scripts

---

### Task 1: Add failing geometry coverage

**Files:**
- Create: `js/_check_assemble_alignment.js`
- Modify: `js/_check_art.js`

**Step 1: Write the failing test**

Assert that `authority`, `watch`, `smile`, and `silence` expose valid `eyebrow`, `eye`, `nose`, and `mouth` geometry inside the `400 × 520` canvas. Assert that full-board assembly SVGs include their theme and part markers.

**Step 2: Run test to verify it fails**

Run: `node js/_check_assemble_alignment.js`

Expected: FAIL because `Art.assemblyLayout` and `Art.assemblyPieceSvg` do not exist.

### Task 2: Implement the shared assembly coordinate system

**Files:**
- Modify: `js/art.js`
- Modify: `js/game.js`
- Modify: `css/style.css`

**Step 1: Add per-theme geometry**

Create the four `400 × 520` layout maps and themed tight crop view boxes in `Art`.

**Step 2: Render full-board guide layers**

Add one reusable SVG layer per part. Build drop targets from the same geometry and remove the hard-coded generic slot positions.

**Step 3: Reuse each layer after placement**

On a correct drop, toggle the corresponding layer to `placed`; do not render a second independently sized SVG.

**Step 4: Retain only the useful mask outline**

Mark legacy feature guides and hide them inside the assembly board while keeping the face, crown, and ear outlines.

### Task 3: Verify and publish

**Files:**
- Modify: `index.html`
- Modify: `VERSION.md`

**Step 1: Run automated checks**

Run syntax checks plus `_check_levels.js`, `_check_art.js`, `_check_scan_hints.js`, and `_check_assemble_alignment.js`.

Expected: all PASS.

**Step 2: Visually verify**

Inspect all four assembly boards in a 1280 × 720 landscape viewport before and after placing fragments.

**Step 3: Cache-bust and document**

Increment the CSS, art, and game asset query versions and add a release note.

**Step 4: Commit and publish**

Commit the tested changes, push `main`, wait for GitHub Pages success, fast-forward Cloud Studio, and verify both public endpoints serve the new versions.

