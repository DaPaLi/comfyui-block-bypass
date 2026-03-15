import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "Comfy.GroupBypassToggle",

    setup() {
        const canvas = app.canvas;

        // Hook in den Gruppen-Kontextmenü
        const _getGroupMenuOptions = canvas.getGroupMenuOptions?.bind(canvas);

        canvas.getGroupMenuOptions = function (group) {
            const options = _getGroupMenuOptions ? _getGroupMenuOptions(group) : [];

            const nodes = getGroupNodes(group);
            if (nodes.length === 0) return options;

            const allBypassed = nodes.every(n => n.mode === 4);
            const allMuted    = nodes.every(n => n.mode === 2);

            options.push(null); // Trennlinie

            options.push({
                content: allBypassed ? "✅  Gruppe aktivieren" : "⚡  Gruppe bypassen",
                callback: () => setGroupMode(group, allBypassed ? 0 : 4),
            });

            options.push({
                content: allMuted ? "✅  Gruppe aktivieren" : "🔇  Gruppe muten",
                callback: () => setGroupMode(group, allMuted ? 0 : 2),
            });

            return options;
        };
    },
});

// Alle Nodes innerhalb einer Gruppe ermitteln
function getGroupNodes(group) {
    // Methode 1: LiteGraph pflegt _nodes direkt auf der Gruppe
    if (group._nodes && group._nodes.length > 0) {
        return [...group._nodes];
    }

    // Methode 2: Bounding-Box-Fallback
    const [gx, gy] = group.pos;
    const [gw, gh] = group.size;

    return app.graph._nodes.filter(node => {
        const [nx, ny] = node.pos;
        const nw = node.size?.[0] ?? 0;
        const nh = node.size?.[1] ?? 0;
        return nx >= gx && ny >= gy && nx + nw <= gx + gw && ny + nh <= gy + gh;
    });
}

// Modus auf alle Nodes der Gruppe setzen
function setGroupMode(group, mode) {
    const nodes = getGroupNodes(group);
    for (const node of nodes) {
        node.mode = mode;
    }
    app.graph.setDirtyCanvas(true, true);
}
