import {
  CheckCircle2,
  Database,
  BrainCircuit,
  Activity
} from "lucide-react";

export default function SystemStatus() {

  const systems = [
    {
      icon: Database,
      label: "Datasets",
      value: "68,606 Samples"
    },
    {
      icon: BrainCircuit,
      label: "Expert Agents",
      value: "3 Active"
    },
    {
      icon: Activity,
      label: "RL Framework",
      value: "Operational"
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

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
            "
          >
            System Status
          </h2>

          <p
            style={{
              color: "var(--muted)"
            }}
            className="mt-2"
          >
            Current MedSearch-RL Platform State
          </p>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
          "
          style={{
            background:
              "rgba(16,185,129,.1)"
          }}
        >

          <CheckCircle2
            size={18}
            color="#10B981"
          />

          <span
            className="
              text-sm
              font-semibold
            "
            style={{
              color: "#10B981"
            }}
          >
            Operational
          </span>

        </div>

      </div>

      <div
        className="
          grid
          md:grid-cols-3
          gap-6
        "
      >

        {systems.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.label}
              className="
                rounded-2xl
                p-5
              "
              style={{
                background:
                  "var(--surface-2)"
              }}
            >

              <Icon
                size={24}
                color="#22D3EE"
              />

              <p
                className="
                  mt-4
                  text-sm
                "
                style={{
                  color: "var(--muted)"
                }}
              >
                {item.label}
              </p>

              <h3
                className="
                  mt-2
                  font-bold
                  text-lg
                "
              >
                {item.value}
              </h3>

            </div>

          );

        })}

      </div>

    </div>

  );

}