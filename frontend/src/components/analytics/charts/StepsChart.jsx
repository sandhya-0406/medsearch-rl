import AnalyticsChart from "./AnalyticsChart";
import { useAnalytics } from "../hooks/useAnalytics";

export default function StepsChart() {

    const { selectedDomainData } = useAnalytics();

    return (

        <AnalyticsChart

            title="Average Steps"

            data={selectedDomainData}

            dataKey="steps"

            stroke="#f59e0b"

        />

    );

}