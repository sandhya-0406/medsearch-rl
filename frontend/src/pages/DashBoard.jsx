import HeroSection from "../components/HeroSection";
import DomainCard from "../components/DomainCard";
import ArchitectureFlow from "../components/ArchitectureFlow";

// import MetricCard from "../components/MetricCard";
import TrainingChart from "../components/TrainingChart";
import SystemStatus from "../components/SystemStatus";

import { rewardData } from "../data/dummyData";

export default function Dashboard() {

  return (

    <div className="max-w-7xl mx-auto p-8 space-y-10">

      <HeroSection />
      <div className="mt-12">

  <h2
    className="
      text-4xl
      font-black
      mb-8
    "
  >
    Supported Domains
  </h2>

  <div
    className="
      grid
      lg:grid-cols-3
      gap-8
    "
  >

    <DomainCard
      title="Brain MRI"
      samples="3,064"
      classes="3"
      successRate="70%"
      extra="233 Patients"
      color="
      linear-gradient(
      135deg,
      #22d3ee,
      #06b6d4
      )"
    />

    <DomainCard
      title="ESAD"
      samples="40,152"
      classes="21"
      successRate="68%"
      extra="Surgical Actions"
      color="
      linear-gradient(
      135deg,
      #8b5cf6,
      #7c3aed
      )"
    />

    <DomainCard
      title="MESAD"
      samples="25,390"
      classes="21"
      successRate="64%"
      extra="Endoscopy Dataset"
      color="
      linear-gradient(
      135deg,
      #10b981,
      #059669
      )"
    />

  </div>

</div>
<div
  className="
    elevated-card
    rounded-[30px]
    p-8
    mt-10
  "
>

  <h2
    className="
      text-3xl
      font-black
      mb-6
    "
  >
    Dataset Foundation
  </h2>

  <div
    className="
      grid
      lg:grid-cols-4
      gap-8
    "
  >

    <div>
      <p style={{color:"var(--muted)"}}>
        Total Samples
      </p>

      <h3 className="text-4xl font-black">
        68,606
      </h3>
    </div>

    <div>
      <p style={{color:"var(--muted)"}}>
        Domains
      </p>

      <h3 className="text-4xl font-black">
        3
      </h3>
    </div>

    <div>
      <p style={{color:"var(--muted)"}}>
        Total Annotations
      </p>

      <h3 className="text-4xl font-black">
        69,951
      </h3>
    </div>

    <div>
      <p style={{color:"var(--muted)"}}>
        Expert Agents
      </p>

      <h3 className="text-4xl font-black">
        3
      </h3>
    </div>

  </div>

</div>
      <SystemStatus />

      <section>

        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Supported Domains
        </h2>

        <div
          className="
            grid
            md:grid-cols-3
            gap-6
          "
        >

          <DomainCard
            title="Brain MRI"
            samples="3064"
            classes="3"
            extra="233 Patients"
            color="linear-gradient(135deg,#22d3ee,#06b6d4)"
          />

          <DomainCard
            title="ESAD"
            samples="40152"
            classes="21"
            extra="Surgical Actions"
            color="linear-gradient(135deg,#8b5cf6,#7c3aed)"
          />

          <DomainCard
            title="MESAD"
            samples="25390"
            classes="21"
            extra="Endoscopy Dataset"
            color="linear-gradient(135deg,#10b981,#059669)"
          />

        </div>

      </section>

      <ArchitectureFlow />

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