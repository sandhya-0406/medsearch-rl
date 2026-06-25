export default function ArchitectureFlow() {

  const steps = [
    "Upload",
    "Domain Router",
    "Expert Agent",
    "Localization",
    "Classification",
    "Explainability"
  ];

  return (

    <div
      className="
        elevated-card
        rounded-3xl
        p-8
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-8
        "
      >
        Architecture Flow
      </h2>

      <div
        className="
          grid
          md:grid-cols-6
          gap-4
        "
      >

        {steps.map((step, index) => (

          <div
            key={step}
            className="
              flex
              flex-col
              items-center
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                font-bold
              "
              style={{
                background:
                  "rgba(34,211,238,.12)"
              }}
            >
              {index + 1}
            </div>

            <p
              className="
                mt-3
                text-center
                text-sm
                font-medium
              "
            >
              {step}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}