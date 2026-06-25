export default function HeroSection() {

  const workflow = [
    "Upload",
    "Domain Router",
    "Expert Agent",
    "Localization",
    "Classification",
    "Explainability"
  ];

  return (

    <section
      className="
        elevated-card
        rounded-[32px]
        p-12
        relative
        overflow-hidden
      "
    >

      {/* Glow */}

      <div
        className="
          absolute
          top-0
          right-0
          w-[400px]
          h-[400px]
          rounded-full
          blur-[120px]
          opacity-20
        "
        style={{
          background:
            "linear-gradient(180deg,var(--primary),var(--secondary))"
        }}
      />

      {/* Badge */}

      <div
        className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          mb-8
        "
        style={{
          background:
            "rgba(34,211,238,.12)",
          border:
            "1px solid rgba(34,211,238,.15)"
        }}
      >

        <div
          className="
            w-2
            h-2
            rounded-full
          "
          style={{
            background:"var(--primary)"
          }}
        />

        <span
          className="
            text-sm
            font-semibold
          "
        >
          Research Platform
        </span>

      </div>

      {/* Heading */}

      <h1
        className="
          text-6xl
          font-black
          leading-tight
        "
      >
        MedSearch-RL
      </h1>

      <h2
        className="
          text-3xl
          font-bold
          mt-5
          max-w-4xl
        "
        style={{
          color:"var(--text-soft)"
        }}
      >
        Multi-Domain Expert-Guided
        Reinforcement Learning Framework
      </h2>

      <p
        className="
          text-xl
          mt-6
          max-w-4xl
          leading-relaxed
        "
        style={{
          color:"var(--muted)"
        }}
      >
        Medical Detection, Localization,
        Classification and Explainability
        through specialized expert agents.
      </p>

      {/* Buttons */}

      <div
        className="
          flex
          gap-4
          mt-10
        "
      >

        <button
          className="
            px-7
            py-4
            rounded-2xl
            font-semibold
            text-white
          "
          style={{
            background:
              "linear-gradient(135deg,var(--primary),var(--secondary))"
          }}
        >
          Upload Image
        </button>

        <button
          className="
            px-7
            py-4
            rounded-2xl
            font-semibold
          "
          style={{
            border:
              "1px solid var(--border)"
          }}
        >
          View Architecture
        </button>

      </div>

      {/* Workflow */}

      <div
        className="
          flex
          items-center
          justify-between
          mt-14
          flex-wrap
          gap-4
        "
      >

        {workflow.map((step, index) => (

          <div
            key={step}
            className="
              flex
              items-center
              gap-4
            "
          >

            <div>

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  text-lg
                  font-black
                "
                style={{
                  background:
                    "rgba(34,211,238,.10)",
                  border:
                    "1px solid rgba(34,211,238,.15)"
                }}
              >
                {index + 1}
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-center
                "
              >
                {step}
              </p>

            </div>

            {
              index !== workflow.length - 1 &&
              (
                <div
                  className="
                    w-12
                    h-[2px]
                  "
                  style={{
                    background:
                      "var(--border)"
                  }}
                />
              )
            }

          </div>

        ))}

      </div>

    </section>

  );

}