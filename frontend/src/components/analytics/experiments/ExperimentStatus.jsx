export default function ExperimentStatus({ status }) {
    const tone =
        status === "Running"
            ? "bg-amber-500/15 text-amber-400"
            : status === "Queued"
                ? "bg-slate-500/15 text-slate-400"
                : "bg-emerald-500/15 text-emerald-400";

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
            {status}
        </span>
    );
}