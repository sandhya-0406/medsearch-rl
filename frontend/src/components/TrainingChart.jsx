import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function TrainingChart({
    data,
    dataKey,
    title
}) {

    return (
        <div
            className="
            rounded-3xl
            p-8
            bg-slate-900/70
            backdrop-blur-xl
            border
            border-slate-700
            shadow-2xl
            "
        >

            <h2 className="text-xl mb-4">
                {title}
            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart data={data}>

                    <CartesianGrid stroke="#334155" />

                    <XAxis stroke="#94A3B8" />

                    <YAxis stroke="#94A3B8" />

                    <Tooltip
                    contentStyle={{
                    backgroundColor:"#0F172A",
                    border:"1px solid #334155",
                    borderRadius:"12px"
                    }}
                    />

                    <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke="#06B6D4"
                    strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    );
}