export function downloadJSON(rows, filename = "analytics.json") {
    const blob = new Blob([JSON.stringify(rows ?? [], null, 2)], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}