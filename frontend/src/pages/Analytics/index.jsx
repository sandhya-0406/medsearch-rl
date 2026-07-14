import { useEffect } from "react";
import { useParams } from "react-router-dom";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import TrainingSummary from "../../components/analytics/TrainingSummary";

import RewardChart from "../../components/analytics/charts/RewardChart";
import LossChart from "../../components/analytics/charts/LossChart";
import IoUChart from "../../components/analytics/charts/IoUChart";
import SuccessChart from "../../components/analytics/charts/SuccessChart";
import StepsChart from "../../components/analytics/charts/StepsChart";
import EpsilonChart from "../../components/analytics/charts/EpsilonChart";

import AnalyticsFilters from "../../components/analytics/filters/AnalyticsFilters";
import ExperimentGrid from "../../components/analytics/experiments/ExperimentGrid";
import MetricsTable from "../../components/analytics/tables/MetricsTable";
import { AnalyticsProvider } from "../../components/analytics/context/AnalyticsContext";
import { useAnalytics } from "../../components/analytics/hooks/useAnalytics";

function AnalyticsContent() {
  const { domain } = useParams();
  const { setSelectedDomain } = useAnalytics();

  useEffect(() => {
    if (domain) {
      setSelectedDomain(domain);
    }
  }, [domain, setSelectedDomain]);

  return (
    <div className="space-y-8">
      <AnalyticsHeader />
      <TrainingSummary />
      <AnalyticsFilters />
      <RewardChart />
      <LossChart />
      <IoUChart />
      <SuccessChart />
      <StepsChart />
      <EpsilonChart />
      <ExperimentGrid />
      <MetricsTable />
    </div>
  );
}

export default function Analytics() {
  return (
    <AnalyticsProvider>
      <AnalyticsContent />
    </AnalyticsProvider>
  );
}