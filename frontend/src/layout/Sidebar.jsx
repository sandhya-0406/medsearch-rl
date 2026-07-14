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
  Microscope,
  Bot
} from "lucide-react";
import NavSection from "../navigation/NavSection";
import SidebarFooter from "../navigation/SidebarFooter";

const sections = [

    {

        title: "OVERVIEW",

        items: [

            {

                icon: LayoutDashboard,

                label: "Dashboard",

                to: "/"

            }

        ]

    },

    {

        title: "WORKFLOW",

        items: [

            {

                icon: Upload,

                label: "Upload Center",

                to: "/upload"

            }

            // {
            //   icon: Bot,

            //   label: "Agent Explorer",

            //   to: "/explorer"
            // }

        ]

    },

    {

        title: "ANALYSIS",

        items: [

            {

                icon: PlayCircle,

                label: "Replay Studio",

                to: "/replay"

            },

            {

                icon: BarChart3,

                label: "Analytics",

                to: "/analytics"

            },

            {

                icon: Brain,

                label: "Classification",

                to: "/classification"

            },

            {

                icon: Flame,

                label: "Heatmaps",

                to: "/heatmaps"

            },

            {

                icon: GitCompare,

                label: "Comparison",

                to: "/comparison"

            },

            {

                icon: Lightbulb,

                label: "Explainability",

                to: "/explainability"

            },

            {

                icon: Microscope,

                label: "Research Playground",

                to: "/playground"

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
              mt-8
              flex-1
              overflow-y-auto
          "
      >

          {

              sections.map(section => (

                  <NavSection

                      key={section.title}

                      title={section.title}

                      items={section.items}

                  />

              ))

          }

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

        <SidebarFooter />

      </div>

    </aside>

  );

}