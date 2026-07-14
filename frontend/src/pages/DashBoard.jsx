import HeroSection from "../components/dashboard/HeroSection";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import DatasetFoundation from "../components/dashboard/DatasetFoundation";
import DomainCard from "../components/dashboard/DomainCard";
import ArchitectureFlow from "../components/dashboard/ArchitectureFlow";
import TrainingChart from "../components/dashboard/TrainingChart";
import SystemStatus from "../components/dashboard/SystemStatus";
import PlatformHealth from "../components/dashboard/PlatformHealth";

import { rewardData } from "../data/dummyData";

const domains = [
  {
    title: "ESAD",
    samples: "31,748",
    classes: "Endoscopy findings",
    successRate: "69%",
    extra: "Stable annotation coverage",
    color: "linear-gradient(135deg, #22D3EE, #2563EB)"
  },
  {
    title: "MESAD",
    samples: "20,515",
    classes: "Microscopy findings",
    successRate: "70%",
    extra: "Balanced across domains",
    color: "linear-gradient(135deg, #34D399, #0EA5E9)"
  },
  {
    title: "MRI",
    samples: "16,343",
    classes: "Brain lesion groups",
    successRate: "71%",
    extra: "Strong localization signals",
    color: "linear-gradient(135deg, #F59E0B, #EF4444)"
  }
];

export default function Dashboard() {

  return (

    <div className="max-w-7xl mx-auto p-8 space-y-10">

      <HeroSection />

      <div className="grid lg:grid-cols-2 gap-8 mt-10">

          <QuickActions />

          <ActivityFeed />

      </div>

      <div className="mt-10">

          <DatasetFoundation />

      </div>

      <div className="mt-10">

          <div className="grid md:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <DomainCard
                key={domain.title}
                title={domain.title}
                samples={domain.samples}
                classes={domain.classes}
                successRate={domain.successRate}
                extra={domain.extra}
                color={domain.color}
              />
            ))}
          </div>

      </div>

      <div className="mt-10">

          <ArchitectureFlow />

      </div>

      {/* <div className="mt-10">

          <TrainingChart />

      </div> */}

      {/* <div className="mt-10">

          <PlatformHealth />

      </div>
      <SystemStatus /> */}


      {/* <ArchitectureFlow /> */}

      {/* <div
        className="
          grid
          md:grid-cols-4
          gap-6
        "
      >

        <MetricCard
          title="Episodes"
          value="5000"
          color="bg-cyan-500"
        />

        <MetricCard
          title="Average Reward"
          value="27.4"
          color="bg-emerald-500"
        />

        <MetricCard
          title="Average IoU"
          value="0.52"
          color="bg-violet-500"
        />

        <MetricCard
          title="Success Rate"
          value="61%"
          color="bg-orange-500"
        />

      </div> */}

      <TrainingChart
        title="Reward Curve"
        data={rewardData}
        dataKey="reward"
      />

    </div>

  );

}