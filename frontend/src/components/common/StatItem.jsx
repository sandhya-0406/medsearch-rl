export default function StatItem({
  label,
  value,
  accent = false,
  className = ""
}) {

  return (

    <div className={className}>

      <p
        className="
          uppercase
          text-xs
          tracking-wider
          mb-2
        "
        style={{
          color: "var(--muted)"
        }}
      >
        {label}
      </p>

      <h3
        className={`
          font-black

          ${
            accent
              ? "text-cyan-400"
              : ""
          }

          text-3xl
        `}
      >
        {value}
      </h3>

    </div>

  );

}