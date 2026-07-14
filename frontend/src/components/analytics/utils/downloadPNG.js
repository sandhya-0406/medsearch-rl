import html2canvas from "html2canvas";

export async function downloadPNG(element, filename = "analytics-chart.png") {
    if (!element) {
        return;
    }

    const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    link.click();
}