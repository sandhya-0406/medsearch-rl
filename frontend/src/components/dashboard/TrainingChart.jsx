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
      style={{
        background:
          "linear-gradient(180deg,var(--surface-2),var(--surface))",
        border: "1px solid var(--border)"
      }}
      className="
        rounded-3xl
        p-8
        shadow-xl
      "
    >

      <h2 className="text-xl font-semibold mb-6">
        {title}
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart data={data}>

          <CartesianGrid
            stroke="rgba(148,163,184,.15)"
          />

          <XAxis
            stroke="#94A3B8"
          />

          <YAxis
            stroke="#94A3B8"
          />

          <Tooltip
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "12px"
            }}
          />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#22D3EE"
            strokeWidth={4}
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}