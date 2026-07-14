import { motion } from "framer-motion";

const ranges = [
    { label: "100 Episodes", value: "100" },
    { label: "500 Episodes", value: "500" },
    { label: "1000 Episodes", value: "1000" },
    { label: "All Episodes", value: "all" }
];

export default function TimeRangeSelector({ value, onChange }) {
    return (
        <div className="relative inline-flex flex-wrap gap-2 rounded-full bg-surface-2 p-1">
            {ranges.map((range) => {
                const active = value === range.value;

                return (
                    <button
                        key={range.value}
                        type="button"
                        onClick={() => onChange(range.value)}
                        className={`relative rounded-full px-4 py-2 text-sm transition ${active ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        {active && (
                            <motion.span
                                layoutId="time-range-pill"
                                className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-cyan-500/30"
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                            />
                        )}
                        <span className="relative z-10">{range.label}</span>
                    </button>
                );
            })}
        </div>
    );
}