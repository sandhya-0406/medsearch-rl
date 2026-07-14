import AnalyticsChart from "./AnalyticsChart";
import { useAnalytics } from "../hooks/useAnalytics";

export default function LossChart() {

    const { selectedDomainData } = useAnalytics();

    return (

        <AnalyticsChart

            title="Loss Curve"

            data={selectedDomainData}

            dataKey="loss"

            stroke="#ef4444"

        />

    );

}