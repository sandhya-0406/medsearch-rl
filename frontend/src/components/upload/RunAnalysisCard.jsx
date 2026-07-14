import {
  Brain,
  Crosshair,
  Microscope,
  Sparkles,
  Cpu,
  Clock3,
  Rocket
} from "lucide-react";

export default function RunAnalysisCard() {

  const pipeline = [

    {
      icon: Brain,
      title: "Expert Agent",
      subtitle: "Double DQN"
    },

    {
      icon: Crosshair,
      title: "Localization",
      subtitle: "RL Visual Search"
    },

    {
      icon: Microscope,
      title: "Classification",
      subtitle: "CNN + CBAM"
    },

    {
      icon: Sparkles,
      title: "Explainability",
      subtitle: "Trajectory Replay"
    }

  ];

  return (

    <div
      className="
        elevated-card
        rounded-3xl
        p-8
      "
    >

      {/* Header */}

      <div className="mb-8">

        <h2
          className="
            text-2xl
            font-bold
          "
        >
          AI Inference Pipeline
        </h2>

        <p
          className="mt-2"
          style={{
            color: "var(--muted)"
          }}
        >
          Ready to launch expert-guided analysis
        </p>

      </div>

      {/* Pipeline */}

      <div className="space-y-5">

        {

          pipeline.map((step, index) => {

            const Icon = step.icon;

            return (

              <div
                key={step.title}
                className="
                  flex
                  items-center
                  gap-5
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                  "
                  style={{
                    background:
                      "rgba(34,211,238,.08)"
                  }}
                >

                  <Icon
                    size={22}
                    className="text-cyan-400"
                  />

                </div>

                <div>

                  <h4 className="font-semibold">

                    {step.title}

                  </h4>

                  <p
                    className="text-sm"
                    style={{
                      color: "var(--muted)"
                    }}
                  >

                    {step.subtitle}

                  </p>

                </div>

              </div>

            );

          })

        }

      </div>

      {/* Divider */}

      <div
        className="my-8"
        style={{
          borderTop:
            "1px solid var(--border)"
        }}
      />

      {/* Runtime */}

      <div
        className="
          flex
          justify-between
          items-center
          mb-5
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <Clock3
            size={18}
            className="text-cyan-400"
          />

          <span
            style={{
              color: "var(--muted)"
            }}
          >
            Estimated Runtime
          </span>

        </div>

        <strong>

          1.8 sec

        </strong>

      </div>

      {/* Device */}

      <div
        className="
          flex
          justify-between
          items-center
          mb-5
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <Cpu
            size={18}
            className="text-violet-400"
          />

          <span
            style={{
              color: "var(--muted)"
            }}
          >
            Device
          </span>

        </div>

        <strong>

          GPU

        </strong>

      </div>

      {/* Status */}

      <div
        className="
          flex
          justify-between
          items-center
          mb-8
        "
      >

        <span
          style={{
            color: "var(--muted)"
          }}
        >
          Pipeline Status
        </span>

        <span
          className="
            text-emerald-400
            font-semibold
          "
        >
          ● Ready
        </span>

      </div>

      {/* Button */}

      <button
        className="
          w-full
          py-4
          rounded-2xl
          font-semibold
          text-white
          transition-all
          duration-300
          hover:scale-[1.02]
        "
        style={{
          background:
            "linear-gradient(135deg,var(--primary),var(--secondary))"
        }}
      >

        <div
          className="
            flex
            justify-center
            items-center
            gap-3
          "
        >

          <Rocket size={18}/>

          Launch Analysis

        </div>

      </button>

    </div>

  );

}