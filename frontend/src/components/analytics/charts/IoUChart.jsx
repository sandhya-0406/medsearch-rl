import AnalyticsChart from "./AnalyticsChart";
import { useAnalytics } from "../hooks/useAnalytics";

export default function IoUChart() {

    const { selectedDomainData } = useAnalytics();

    return (

        <AnalyticsChart

            title="Average IoU"

            data={selectedDomainData}

            dataKey="iou"

            stroke="#10b981"

        />

    );

}