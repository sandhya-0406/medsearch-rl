import MetricCard from "./MetricCard";
import { useAnalytics } from "./hooks/useAnalytics";

export default function TrainingSummary(){

  const { metrics, loading, error } = useAnalytics();

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-red-400">
        Failed to load training summary: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl bg-surface-2"
          />
        ))}
      </div>
    );
  }

  const metricsCards = [
    {
      title: "Episodes",
      value: metrics.episodes.toLocaleString()
    },
    {
      title: "Avg Reward",
      value: metrics.reward.average.toFixed(2)
    },
    {
      title: "Avg IoU",
      value: metrics.iou.average.toFixed(2)
    },
    {
      title: "Success Rate",
      value: `${metrics.success.average.toFixed(0)}%`
    },
    {
      title: "Avg Steps",
      value: metrics.steps.average.toFixed(0)
    },
    {
      title: "Epsilon",
      value: metrics.epsilon.average.toFixed(3)
    }
  ];

  return (

    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">

      {metricsCards.map(metric =>

        <MetricCard
          key={metric.title}
          {...metric}
        />

      )}

    </div>

  )

}