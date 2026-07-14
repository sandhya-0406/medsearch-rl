import { Brain, Activity, Microscope } from "lucide-react";

export default function UploadOptions() {

  return (

    <div
      className="
        elevated-card
        rounded-3xl
        p-7
      "
    >

      {/* Header */}

      <h2
        className="
          text-2xl
          font-bold
          mb-7
        "
      >
        Analysis Settings
      </h2>

      {/* Domain */}

      <div className="mb-8">

        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-wider
            mb-4
          "
          style={{
            color: "var(--muted)"
          }}
        >
          Domain Selection
        </p>

        <div className="space-y-3">

          <label
            className="
              flex
              items-center
              gap-3
              cursor-pointer
            "
          >
            <input
              type="radio"
              name="domain"
              defaultChecked
            />

            Auto Detect
          </label>

          <label
            className="
              flex
              items-center
              gap-3
              cursor-pointer
            "
          >
            <input
              type="radio"
              name="domain"
            />

            Brain MRI
          </label>

          <label
            className="
              flex
              items-center
              gap-3
              cursor-pointer
            "
          >
            <input
              type='radio'
              name='domain'
            />

            ESAD
          </label>

          <label
            className="
              flex
              items-center
              gap-3
              cursor-pointer
            "
          >
            <input
              type="radio"
              name="domain"
            />

            MESAD
          </label>

        </div>

      </div>

      {/* Divider */}

      <div
        className="my-8"
        style={{
          borderTop: "1px solid var(--border)"
        }}
      />

      {/* Selected Agent */}

      <div className="mb-8">

        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-wider
            mb-4
          "
          style={{
            color: "var(--muted)"
          }}
        >
          RL Agent
        </p>

        <div
          className="
            rounded-2xl
            p-4
            flex
            items-center
            gap-4
          "
          style={{
            background: "var(--surface-2)"
          }}
        >

          <Brain
            className="text-cyan-400"
            size={28}
          />

          <div>

            <h4 className="font-semibold">
              Double DQN
            </h4>

            <p
              className="text-sm"
              style={{
                color: "var(--muted)"
              }}
            >
              Expert Navigation Agent
            </p>

          </div>

        </div>

      </div>

      {/* Classifier */}

      <div className="mb-8">

        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-wider
            mb-4
          "
          style={{
            color: "var(--muted)"
          }}
        >
          Classifier
        </p>

        <div
          className="
            rounded-2xl
            p-4
            flex
            items-center
            gap-4
          "
          style={{
            background: "var(--surface-2)"
          }}
        >

          <Microscope
            className="text-violet-400"
            size={28}
          />

          <div>

            <h4 className="font-semibold">
              CNN + CBAM
            </h4>

            <p
              className="text-sm"
              style={{
                color: "var(--muted)"
              }}
            >
              Medical Classification Network
            </p>

          </div>

        </div>

      </div>

      {/* Confidence */}

      <div className="mb-8">

        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-wider
            mb-4
          "
          style={{
            color: "var(--muted)"
          }}
        >
          Confidence Mode
        </p>

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <Activity
            className="text-emerald-400"
            size={24}
          />

          <span
            className="
              font-semibold
              text-emerald-400
            "
          >
            High Accuracy
          </span>

        </div>

      </div>

      {/* Run Button */}

      <button
        className="
          w-full
          py-4
          rounded-2xl
          font-semibold
          text-white
          transition-all
          hover:scale-[1.02]
        "
        style={{
          background:
            "linear-gradient(135deg,var(--primary),var(--secondary))"
        }}
      >
        Run Analysis
      </button>

    </div>

  );

}