import { useNavigate } from "react-router-dom";

import { useAnalytics } from "../hooks/useAnalytics";
import ExperimentCard from "./ExperimentCard";

export default function ExperimentGrid() {
	const { experiments } = useAnalytics();
	const navigate = useNavigate();

	return (
		<div>
			<h2 className="mb-5 text-2xl font-semibold">Experiment History</h2>

			<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
				{experiments.map((experiment) => (
					<ExperimentCard
						key={experiment.id}
						{...experiment}
						onClick={() => navigate(`/analytics/${experiment.domain}`)}
					/>
				))}
			</div>
		</div>
	);
}