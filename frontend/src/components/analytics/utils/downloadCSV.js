export function downloadCSV(rows, filename = "analytics.csv") {
    const data = Array.isArray(rows) ? rows : [];

    if (!data.length) {
        return;
    }

    const headers = Object.keys(data[0]);
    const csv = [headers.join(","), ...data.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}