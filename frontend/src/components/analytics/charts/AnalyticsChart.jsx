import { useEffect, useMemo, useRef, useState } from "react";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import Card from "../../common/GlassCard";
import ChartHeader from "./ChartHeader";
import ChartToolbar from "./ChartToolbar";
import ChartTooltip from "./ChartTooltip";
import { downloadCSV } from "../utils/downloadCSV";
import { downloadJSON } from "../utils/downloadJSON";
import { downloadPNG } from "../utils/downloadPNG";

export default function AnalyticsChart({ title, data, dataKey, stroke = "#3b82f6" }) {
    const chartRef = useRef(null);
    const [range, setRange] = useState("all");

    const visibleData = useMemo(() => {
        const limit = range === "all" ? null : Number(range);

        if (!Array.isArray(data)) {
            return [];
        }

        return limit ? data.slice(Math.max(data.length - limit, 0)) : data;
    }, [data, range]);

    const values = useMemo(
        () => visibleData.map((entry) => Number(entry?.[dataKey])).filter((value) => Number.isFinite(value)),
        [visibleData, dataKey]
    );

    const current = values.length ? values[values.length - 1] : null;
    const best = values.length ? Math.max(...values) : null;
    const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

    useEffect(() => {
        setRange("all");
    }, [dataKey]);

    const loading = !Array.isArray(data) || data.length === 0;

    return (
        <div ref={chartRef}>
            <Card className="p-6">
                <ChartHeader
                    title={title}
                    current={current === null ? "-" : current.toFixed(2)}
                    best={best === null ? "-" : best.toFixed(2)}
                    average={average === null ? "-" : average.toFixed(2)}
                />

                <ChartToolbar
                    range={range}
                    setRange={setRange}
                    onCSV={() => downloadCSV(visibleData, `${dataKey}-analytics.csv`)}
                    onJSON={() => downloadJSON(visibleData, `${dataKey}-analytics.json`)}
                    onPNG={() => downloadPNG(chartRef.current, `${dataKey}-analytics.png`)}
                />

                <div className="h-80 bg-surface/50 rounded-lg flex items-center justify-center">
                    {loading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">Loading chart data...</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={visibleData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="episode" />
                                <YAxis />
                                <Tooltip content={<ChartTooltip />} />
                                <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>
        </div>
    );
}