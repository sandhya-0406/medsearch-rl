export default function MetricCard({
  title,
  value,
  color
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
        p-7
        relative
        overflow-hidden
        shadow-xl
        transition
        hover:-translate-y-2
      "
    >

      <div
        className={`
          absolute
          top-0
          left-0
          h-1
          w-full
          ${color}
        `}
      />

      <p
        style={{
          color: "var(--muted)"
        }}
        className="
          text-sm
          mb-4
        "
      >
        {title}
      </p>

      <h2
        style={{
          fontFamily: "JetBrains Mono"
        }}
        className="
          text-6xl
          font-bold
        "
      >
        {value}
      </h2>

    </div>

  );

}