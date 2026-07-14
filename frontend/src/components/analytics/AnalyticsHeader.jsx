import DomainSwitcher from "./DomainSwitcher";

export default function AnalyticsHeader() {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-3xl font-semibold">
          Training Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Monitor reinforcement learning performance across expert agents with live-domain analytics, experiment history, and exportable training logs.
        </p>

      </div>

      <DomainSwitcher />

    </div>
  );
}