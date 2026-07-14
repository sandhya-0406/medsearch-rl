import { useMemo, useState } from "react";

import Card from "../../common/GlassCard";
import { useAnalytics } from "../hooks/useAnalytics";
import { downloadCSV } from "../utils/downloadCSV";
import MetricsToolbar from "./MetricsToolbar";
import TablePagination from "./TablePagination";

const columns = ["episode", "reward", "loss", "iou", "success", "steps", "epsilon", "checkpoint", "status"];

export default function MetricsTable() {
    const { filteredData, loading, error, sortKey, setSortKey, sortDirection, setSortDirection } = useAnalytics();
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const rows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, page]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

    if (error) {
        return (
            <Card className="space-y-4">
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-red-400">
                    Failed to load metrics table: {error}
                </div>
            </Card>
        );
    }

    return (
        <Card className="space-y-4">
            <MetricsToolbar onExport={() => downloadCSV(filteredData, "training-metrics.csv")} />

            <div className="overflow-hidden rounded-2xl border border-border">
                <div className="max-h-[540px] overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">Loading metrics table...</p>
                            </div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-sm text-muted-foreground">No data available</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur">
                                <tr className="text-left">
                                    {columns.map((column) => (
                                        <th key={column} className="border-b border-border px-4 py-3">
                                            <button
                                                type="button"
                                                className="font-semibold capitalize"
                                                onClick={() => {
                                                    if (sortKey === column) {
                                                        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                                                    } else {
                                                        setSortKey(column);
                                                        setSortDirection("desc");
                                                    }
                                                }}
                                            >
                                                {column}
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.episode} className="border-t border-border transition hover:bg-surface-2/70">
                                        <td className="px-4 py-3">{row.episode}</td>
                                        <td className="px-4 py-3">{row.reward}</td>
                                        <td className="px-4 py-3">{row.loss}</td>
                                        <td className="px-4 py-3">{row.iou}</td>
                                        <td className="px-4 py-3">{row.success}</td>
                                        <td className="px-4 py-3">{row.steps}</td>
                                        <td className="px-4 py-3">{row.epsilon}</td>
                                        <td className="px-4 py-3">
                                            <Badge label={row.checkpoint} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge label={row.status} tone={row.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {!loading && filteredData.length > 0 && (
                <TablePagination
                    page={page}
                    totalPages={totalPages}
                    totalRows={filteredData.length}
                    visibleRows={rows.length}
                    onPrev={() => setPage((value) => Math.max(1, value - 1))}
                    onNext={() => setPage((value) => Math.min(totalPages, value + 1))}
                />
            )}
        </Card>
    );
}

function Badge({ label, tone }) {
    const classes =
        tone === "Running"
            ? "bg-amber-500/15 text-amber-400"
            : tone === "Queued"
                ? "bg-slate-500/15 text-slate-400"
                : tone === "Failed"
                    ? "bg-red-500/15 text-red-400"
                    : label === "Best"
                        ? "bg-cyan-500/15 text-cyan-400"
                        : label === "Final"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-surface-2 text-muted-foreground";

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${classes}`}>
            {label}
        </span>
    );
}

//     return (
//         <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${classes}`}>
//             {label}
//         </span>
//     );
// }