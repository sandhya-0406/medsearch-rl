export default function ChartHeader({ title, current, best, average }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-6 mb-5">
            <div>
                <h3 className="text-xl font-semibold">{title}</h3>
            </div>

            <div className="flex gap-8 text-right">
                <Stat label="Current" value={current} />
                <Stat label="Best" value={best} />
                <Stat label="Average" value={average} />
            </div>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <h4 className="text-lg font-semibold">{value}</h4>
        </div>
    );
}