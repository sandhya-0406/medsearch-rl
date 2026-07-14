import { BadgeCheck } from "lucide-react";

import Card from "../../common/GlassCard";
import ExperimentStatus from "./ExperimentStatus";

export default function ExperimentCard({
	title,
	domain,
	algorithm,
	date,
	time,
	gpuUsed,
	episodes,
	learningRate,
	batchSize,
	averageReward,
	averageIoU,
	successRate,
	averageSteps,
	bestCheckpoint,
	finalCheckpoint,
	isBest,
	isFinal,
	isActive,
	status,
	onClick
}) {
	return (
		<Card className="cursor-pointer space-y-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl" onClick={onClick}>
			<div className="flex items-center justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold">{title}</h3>
					<p className="text-sm text-muted-foreground">
						{domain.toUpperCase()} • {algorithm}
					</p>
				</div>

				<div className="flex flex-wrap justify-end gap-2">
					{isBest && <MetaBadge label="BEST" />}
					{isFinal && <MetaBadge label="FINAL" />}
					{isActive && <MetaBadge label="ACTIVE" />}
					<ExperimentStatus status={status} />
				</div>
			</div>

			<p className="text-xs text-muted-foreground">
				{date} • {time} • {gpuUsed}
			</p>

			<div className="grid grid-cols-2 gap-4 text-sm xl:grid-cols-4">
				<Info label="Episodes" value={episodes.toLocaleString()} />
				<Info label="Learning Rate" value={learningRate.toExponential(1)} />
				<Info label="Batch Size" value={batchSize} />
				<Info label="Avg Steps" value={averageSteps} />
				<Info label="Avg Reward" value={averageReward.toFixed(2)} />
				<Info label="Avg IoU" value={averageIoU.toFixed(2)} />
				<Info label="Success" value={`${successRate.toFixed(0)}%`} />
				<Info label="Checkpoints" value={`${bestCheckpoint} / ${finalCheckpoint}`} />
			</div>

			<button type="button" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-primary hover:text-white">
				<BadgeCheck size={16} />
				View Details
			</button>
		</Card>
	);
}

function Info({ label, value }) {
	return (
		<div className="rounded-xl bg-surface-2 px-3 py-2">
			<p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
			<p className="mt-1 break-words font-semibold">{value}</p>
		</div>
	);
}

function MetaBadge({ label }) {
	return (
		<span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-3 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground">
			{label}
		</span>
	);
}