export default function DomainCard({
  title,
  samples,
  classes,
  extra,
  successRate,
  color
}) {

  return (

    <div
      className="
        elevated-card
        rounded-[28px]
        p-7
        relative
        overflow-hidden
        group
      "
    >

      {/* Glow */}

      <div
        className="
          absolute
          -top-12
          -right-12
          w-40
          h-40
          rounded-full
          blur-3xl
          opacity-20
          group-hover:opacity-35
          transition
        "
        style={{
          background: color
        }}
      />

      {/* Icon */}

      <div
        className="
          w-14
          h-14
          rounded-2xl
          mb-6
        "
        style={{
          background: color
        }}
      />

      {/* Title */}

      <h3
        className="
          text-3xl
          font-black
        "
      >
        {title}
      </h3>

      {/* Divider */}

      <div
        className="mt-6 mb-6"
        style={{
          borderTop:
            "1px solid var(--border)"
        }}
      />

      {/* Stats */}

      <div className="space-y-5">

        <div>

          <p
            className="text-xs uppercase"
            style={{
              color:"var(--muted)"
            }}
          >
            Samples
          </p>

          <h4
            className="
              text-2xl
              font-black
            "
          >
            {samples}
          </h4>

        </div>

        <div>

          <p
            className="text-xs uppercase"
            style={{
              color:"var(--muted)"
            }}
          >
            Classes
          </p>

          <h4
            className="
              text-xl
              font-bold
            "
          >
            {classes}
          </h4>

        </div>

        <div>

          <p
            className="text-xs uppercase"
            style={{
              color:"var(--muted)"
            }}
          >
            Success Rate
          </p>

          <h4
            className="
              text-xl
              font-bold
            "
            style={{
              color:"var(--primary)"
            }}
          >
            {successRate}
          </h4>

        </div>

        <div>

          <p
            className="text-xs uppercase"
            style={{
              color:"var(--muted)"
            }}
          >
            Notes
          </p>

          <h4
            className="
              text-lg
              font-semibold
            "
          >
            {extra}
          </h4>

        </div>

      </div>

    </div>

  );

}