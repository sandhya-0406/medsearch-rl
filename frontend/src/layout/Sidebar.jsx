import {
  LayoutDashboard,
  Upload,
  PlayCircle,
  BarChart3,
  Brain,
  Flame,
  GitCompare,
  Lightbulb,
  Settings,
  Microscope
} from "lucide-react";

const sections = [
  {
    title: "OVERVIEW",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard"
      }
    ]
  },

  {
    title: "WORKFLOW",
    items: [
      {
        icon: Upload,
        label: "Upload Center"
      }
    ]
  },

  {
    title: "ANALYSIS",
    items: [
      {
        icon: PlayCircle,
        label: "Replay Studio"
      },
      {
        icon: BarChart3,
        label: "Analytics"
      },
      {
        icon: Brain,
        label: "Classification"
      },
      {
        icon: Flame,
        label: "Heatmaps"
      },
      {
        icon: GitCompare,
        label: "Comparison"
      },
      {
        icon: Lightbulb,
        label: "Explainability"
      },
      {
        icon: Microscope,
        label: "Research Playground"
      }
    ]
  }
];

export default function Sidebar() {

  const activeItem = "Dashboard";

  return (

    <aside
      style={{
        background: "var(--sidebar)",
        borderRight: "1px solid var(--border)"
      }}
      className="
        w-[260px]
        h-screen
        sticky
        top-0
        flex
        flex-col
      "
    >

      {/* HEADER */}

      <div className="px-5 pt-5">

        <h1
          className="
            text-2xl
            font-black
            tracking-tight
          "
        >
          MedSearch-RL
        </h1>

        <p
          className="
            text-xs
            mt-1
          "
          style={{
            color: "var(--muted)"
          }}
        >
          Expert Agent Framework
        </p>

        {/* STATUS */}

        <div
          className="
            flex
            items-center
            gap-2
            mt-4
          "
        >

          <div
            className="
              w-2
              h-2
              rounded-full
            "
            style={{
              background: "var(--success)",
              boxShadow:
                "0 0 10px rgba(16,185,129,.8)"
            }}
          />

          <span
            className="text-xs"
            style={{
              color: "var(--muted)"
            }}
          >
            System Operational
          </span>

        </div>

      </div>

      {/* NAVIGATION */}

      <div
        className="
          px-3
          mt-8
          flex-1
          overflow-y-auto
        "
      >

        {sections.map((section) => (

          <div
            key={section.title}
            className="mb-6"
          >

            <p
              className="
                text-[11px]
                font-bold
                tracking-[0.20em]
                px-3
                mb-2
              "
              style={{
                color: "var(--muted)"
              }}
            >
              {section.title}
            </p>

            <div className="space-y-1">

              {section.items.map((item) => {

                const Icon = item.icon;

                const active =
                  item.label === activeItem;

                return (

                  <button
                    key={item.label}
                    className={`
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      transition-all
                      text-sm

                      ${
                        active
                          ? "text-cyan-400"
                          : ""
                      }
                    `}
                    style={
                      active
                        ? {
                            background:
                              "rgba(34,211,238,.10)",
                            border:
                              "1px solid rgba(34,211,238,.18)"
                          }
                        : {}
                    }
                  >

                    <Icon size={18} />

                    <span>
                      {item.label}
                    </span>

                  </button>

                );

              })}

            </div>

          </div>

        ))}

      </div>

      {/* BOTTOM AREA */}

      <div
        className="
          px-4
          pb-4
          pt-3
        "
        style={{
          borderTop:
            "1px solid var(--border)"
        }}
      >

        {/* MINI PLATFORM INFO */}

        {/* <div
          className="
            mb-3
            px-3
            py-3
            rounded-xl
          "
          style={{
            background: "var(--surface-2)"
          }} */}
        {/* > */}

          {/* <div
            className="
              text-xs
              mb-2
            "
            style={{
              color: "var(--muted)"
            }}
          >
            Platform
          </div> */}

          {/* <div
            className="
              text-sm
              font-semibold
            "
          >
            68,606 Samples
          </div> */}

          {/* <div
            className="
              text-xs
              mt-1
            "
            style={{
              color: "var(--muted)"
            }}
          >
            MRI • ESAD • MESAD
          </div> */}

        {/* </div> */}

        {/* SETTINGS */}

        <button
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-2.5
            rounded-xl
            text-sm
            transition-all
            hover:bg-white/5
          "
        >

          <Settings size={18} />

          <span>
            Settings
          </span>

        </button>

      </div>

    </aside>

  );

}