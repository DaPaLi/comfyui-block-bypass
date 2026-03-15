import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "Comfy.GroupBypassPanel",
    setup() {
        buildPanel();
        buildToggleButton();
    },
});

let panel = null;

// ── Panel aufbauen ────────────────────────────────────────────────────────────
function buildPanel() {
    panel = document.createElement("div");
    panel.id = "group-bypass-panel";
    panel.style.cssText = `
        position: fixed; bottom: 70px; left: 50%; transform: translateX(-50%);
        background: #1e1e1e; border: 1px solid #555;
        border-radius: 10px; padding: 14px; width: 270px;
        z-index: 9999; display: none; color: #fff;
        font-family: sans-serif; font-size: 13px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.7);
    `;

    panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <b style="font-size:14px">⚡ Gruppen Bypass</b>
            <button id="gbp-refresh" title="Gruppen neu laden"
                style="background:#333;border:1px solid #555;color:#ccc;border-radius:4px;padding:2px 7px;cursor:pointer;font-size:12px">
                ↻
            </button>
            <button id="gbp-close"
                style="background:none;border:none;color:#aaa;cursor:pointer;font-size:18px;line-height:1">
                ✕
            </button>
        </div>

        <select id="gbp-select"
            style="width:100%;padding:7px;background:#2a2a2a;color:#fff;
                   border:1px solid #555;border-radius:5px;margin-bottom:10px;font-size:13px">
        </select>

        <div style="display:flex;gap:6px">
            <button id="gbp-bypass"
                style="flex:1;padding:7px 4px;background:#b87200;color:#fff;
                       border:none;border-radius:5px;cursor:pointer;font-size:12px">
                ⚡ Bypass
            </button>
            <button id="gbp-mute"
                style="flex:1;padding:7px 4px;background:#484848;color:#fff;
                       border:none;border-radius:5px;cursor:pointer;font-size:12px">
                🔇 Mute
            </button>
            <button id="gbp-activate"
                style="flex:1;padding:7px 4px;background:#2a6e2a;color:#fff;
                       border:none;border-radius:5px;cursor:pointer;font-size:12px">
                ✅ Aktiv
            </button>
        </div>

        <div id="gbp-status"
            style="margin-top:8px;font-size:11px;color:#888;min-height:16px;text-align:center">
        </div>
    `;

    document.body.appendChild(panel);

    panel.querySelector("#gbp-close").onclick    = () => { panel.style.display = "none"; };
    panel.querySelector("#gbp-refresh").onclick  = refreshGroups;
    panel.querySelector("#gbp-bypass").onclick   = () => applyMode(4, "⚡ Bypassed");
    panel.querySelector("#gbp-mute").onclick     = () => applyMode(2, "🔇 Gemutet");
    panel.querySelector("#gbp-activate").onclick = () => applyMode(0, "✅ Aktiviert");
}

// ── Schwebender Button unten rechts ──────────────────────────────────────────
function buildToggleButton() {
    const btn = document.createElement("button");
    btn.textContent = "⚡ Gruppen";
    btn.title = "Gruppen Bypass Panel öffnen";
    btn.style.cssText = `
        position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%);
        padding: 8px 16px; background: #b87200; color: #fff;
        border: none; border-radius: 7px; cursor: pointer;
        z-index: 9998; font-size: 13px; font-family: sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        transition: background 0.15s;
    `;
    btn.onmouseenter = () => btn.style.background = "#d48c00";
    btn.onmouseleave = () => btn.style.background = "#b87200";
    btn.onclick = togglePanel;
    document.body.appendChild(btn);
}

// ── Panel ein-/ausblenden ─────────────────────────────────────────────────────
function togglePanel() {
    if (!panel) return;
    if (panel.style.display === "none") {
        refreshGroups();
        panel.style.display = "block";
    } else {
        panel.style.display = "none";
    }
}

// ── Dropdown mit Gruppen befüllen ─────────────────────────────────────────────
function refreshGroups() {
    const select = panel.querySelector("#gbp-select");
    const groups = app.graph?._groups ?? [];
    select.innerHTML = "";

    if (groups.length === 0) {
        select.innerHTML = `<option value="-1">(keine Gruppen im Workflow)</option>`;
        setStatus("Keine Gruppen gefunden.");
        return;
    }

    groups.forEach((group, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = group.title?.trim() || `Gruppe ${i + 1}`;
        select.appendChild(opt);
    });

    setStatus(`${groups.length} Gruppe(n) geladen.`);
}

// ── Modus auf ausgewählte Gruppe anwenden ─────────────────────────────────────
function applyMode(mode, label) {
    const select = panel.querySelector("#gbp-select");
    const idx    = parseInt(select.value);
    if (isNaN(idx) || idx < 0) return;

    const group = (app.graph?._groups ?? [])[idx];
    if (!group) return;

    const nodes = getGroupNodes(group);
    if (nodes.length === 0) {
        setStatus("⚠️ Keine Nodes in dieser Gruppe.");
        return;
    }

    for (const node of nodes) {
        node.mode = mode;
    }
    app.graph.setDirtyCanvas(true, true);
    setStatus(`${label}: "${group.title || "Gruppe"}" (${nodes.length} Nodes)`);
}

// ── Statuszeile setzen ────────────────────────────────────────────────────────
function setStatus(msg) {
    const el = panel?.querySelector("#gbp-status");
    if (el) el.textContent = msg;
}

// ── Nodes einer Gruppe ermitteln ──────────────────────────────────────────────
function getGroupNodes(group) {
    if (group._nodes?.length > 0) return [...group._nodes];

    const [gx, gy] = group.pos;
    const [gw, gh] = group.size;
    return (app.graph?._nodes ?? []).filter(node => {
        const [nx, ny] = node.pos;
        const nw = node.size?.[0] ?? 0;
        const nh = node.size?.[1] ?? 0;
        return nx >= gx && ny >= gy && nx + nw <= gx + gw && ny + nh <= gy + gh;
    });
}
