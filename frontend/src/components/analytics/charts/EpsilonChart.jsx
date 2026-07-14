import AnalyticsChart from "./AnalyticsChart";
import { useAnalytics } from "../hooks/useAnalytics";

export default function EpsilonChart() {

    const { selectedDomainData } = useAnalytics();

    return (

        <AnalyticsChart

            title="Exploration Rate (ε)"

            data={selectedDomainData}

            dataKey="epsilon"

            stroke="#6366f1"

        />

    );

}