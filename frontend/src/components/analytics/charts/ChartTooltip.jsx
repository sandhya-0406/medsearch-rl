export default function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) {
        return null;
    }

    const row = payload[0].payload;

    return (
        <div className="rounded-2xl border border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Episode {label}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <TooltipRow label="Reward" value={row.reward} />
                <TooltipRow label="Loss" value={row.loss} />
                <TooltipRow label="IoU" value={row.iou} />
                <TooltipRow label="Success" value={`${row.success}%`} />
                <TooltipRow label="Steps" value={row.steps} />
                <TooltipRow label="Epsilon" value={row.epsilon} />
            </div>
        </div>
    );
}

function TooltipRow({ label, value }) {
    return (
        <div className="rounded-xl bg-surface-2 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
        </div>
    );
}