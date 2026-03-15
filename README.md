# ComfyUI Block Bypass Switch

A custom node pack for ComfyUI that lets you bypass or mute entire node groups with a single click.

## Features

- **⚡ Block Bypass Switch** — A node that routes your signal either through a block or directly around it via a one-click toggle
- **⚡ Group Bypass (Right-click)** — Right-click any group in your workflow to bypass, mute, or activate all nodes inside it
- **⚡ Group Bypass Panel** — A floating panel with a dropdown listing all groups in your workflow, with Bypass / Mute / Activate buttons

## Compatibility

- ComfyUI Node Spec 2.0 (new frontend)
- Falls back automatically to legacy ComfyUI versions

## Installation

### Option A — Manual
1. Download or clone this repository
2. Copy the `comfyui-block-bypass` folder into your `ComfyUI/custom_nodes/` directory
3. Restart ComfyUI

### Option B — ComfyUI Manager
Search for `Block Bypass Switch` in the ComfyUI Manager and install directly.

## Usage

### Block Bypass Switch Node
Find it under `utils/bypass` → `⚡ Block Bypass Switch`

| Input | Description |
|-------|-------------|
| `direct_in` | Signal **before** your block |
| `block_out` | Signal **after** your block |
| `bypass` | Toggle: ON = skip block, OFF = use block |

### Group Bypass Panel
After installing, a **`⚡ Gruppen`** button appears at the bottom center of your ComfyUI window.

Click it to open the panel:
- Select a group from the dropdown
- Click **⚡ Bypass**, **🔇 Mute**, or **✅ Aktiv**
- Use **↻** to refresh the group list after renaming groups

### Right-click Group Menu
Right-click any group directly on the canvas for quick bypass/mute/activate options.

## License

MIT
