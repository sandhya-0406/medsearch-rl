import AnalyticsChart from "./AnalyticsChart";
import { useAnalytics } from "../hooks/useAnalytics";

export default function RewardChart() {

    const { filteredData } = useAnalytics();

    return (

        <AnalyticsChart

            title="Reward Curve"

            data={filteredData}

            dataKey="reward"

            stroke="#06b6d4"

        />

    );

}