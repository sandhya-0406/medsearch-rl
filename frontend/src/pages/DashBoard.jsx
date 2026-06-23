import MetricCard from "../components/MetricCard";
import TrainingChart from "../components/TrainingChart";
import { rewardData } from "../data/dummyData";

export default function Dashboard() {

    return (

        <div className="max-w-7xl mx-auto p-10">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

                <MetricCard
                title="Episodes"
                value="5000"
                color="bg-gradient-to-r from-cyan-400 to-blue-500"
                />

                <MetricCard
                title="Average Reward"
                value="27.4"
                color="bg-gradient-to-r from-emerald-400 to-green-500"
                />

                <MetricCard
                title="Average IoU"
                value="0.52"
                color="bg-gradient-to-r from-violet-400 to-fuchsia-500"
                />

                <MetricCard
                title="Success Rate"
                value="61%"
                color="bg-gradient-to-r from-orange-400 to-red-500"
                />

            </div>

            <div className="mt-12">

                <TrainingChart
                    title="Reward Curve"
                    data={rewardData}
                    dataKey="reward"
                />

            </div>

        </div>

    );

}