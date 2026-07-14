import AnalyticsChart from "./AnalyticsChart";
import { useAnalytics } from "../hooks/useAnalytics";

export default function SuccessChart() {

    const { selectedDomainData } = useAnalytics();

    return (

        <AnalyticsChart

            title="Success Rate"

            data={selectedDomainData}

            dataKey="success"

            stroke="#8b5cf6"

        />

    );

}