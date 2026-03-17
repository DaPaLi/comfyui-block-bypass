# ComfyUI Block Bypass Switch

A custom node pack for ComfyUI that lets you **bypass or mute entire node groups with a single click** — no rewiring needed.

## Features

| Feature | Description |
|---------|-------------|
| **⚡ Block Bypass Switch** | Node that routes your signal either through a block or directly around it via a one-click toggle |
| **⚡ Group Bypass (Right-click)** | Right-click any group on the canvas to bypass, mute, or activate all nodes inside it |
| **⚡ Group Bypass Panel** | Floating panel with a dropdown listing all groups — apply Bypass / Mute / Activate in one click |

## Installation

### Option A — ComfyUI Manager (recommended)
1. Open **ComfyUI Manager**
2. Search for `Block Bypass Switch`
3. Click **Install** and restart ComfyUI

### Option B — Manual
1. Clone or download this repository
2. Copy the `comfyui-block-bypass` folder into your `ComfyUI/custom_nodes/` directory
3. Restart ComfyUI

## Usage

### Block Bypass Switch Node

Find it under **`utils/bypass`** → **`⚡ Block Bypass Switch`**

Wire it up like this:

```
[Node Before Block] ──► direct_in ──┐
                                     ├──► output ──► [Rest of workflow]
[Block Output]      ──► block_out ──┘

bypass = ON  → signal goes around the block (direct_in)
bypass = OFF → signal goes through the block (block_out)
```

| Input | Type | Description |
|-------|------|-------------|
| `direct_in` | ANY | Signal **before** your block |
| `block_out` | ANY | Signal **after** your block |
| `bypass` | BOOLEAN | ON = skip block · OFF = use block |

| Output | Type | Description |
|--------|------|-------------|
| `output` | ANY | The selected signal |

---

### Group Bypass Panel

After installing, a **`⚡ Gruppen`** button appears at the **bottom center** of your ComfyUI window.

1. Click **`⚡ Gruppen`** to open the panel
2. Select a group from the dropdown
3. Click one of:
   - **⚡ Bypass** — skip all nodes in the group
   - **🔇 Mute** — mute all nodes in the group
   - **✅ Aktiv** — re-enable all nodes in the group
4. Use **↻** to refresh the list after renaming groups

---

### Right-click Group Menu

Right-click directly on any group frame on the canvas for quick access:
- **⚡ Gruppe bypassen** / **✅ Gruppe aktivieren**
- **🔇 Gruppe muten** / **✅ Gruppe aktivieren**

---

## Compatibility

- ComfyUI (new frontend, Node Spec 2.0)
- Automatic fallback for legacy ComfyUI versions

## License

[MIT](LICENSE)
