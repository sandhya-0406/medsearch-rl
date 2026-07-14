import { useAnalytics } from "../hooks/useAnalytics";

const episodeWindowOptions = [
    { label: "All Episodes", value: "all" },
    { label: "Last 100 Episodes", value: "100" },
    { label: "Last 500 Episodes", value: "500" },
    { label: "Last 1000 Episodes", value: "1000" }
];

export default function FilterToolbar() {
    const {
        selectedDataset,
        setSelectedDataset,
        selectedAlgorithm,
        setSelectedAlgorithm,
        selectedEpisodeWindow,
        setSelectedEpisodeWindow,
        selectedDateFrom,
        setSelectedDateFrom,
        selectedDateTo,
        setSelectedDateTo,
        searchQuery,
        setSearchQuery,
        sortKey,
        setSortKey,
        sortDirection,
        setSortDirection,
        resetFilters
    } = useAnalytics();

    return (
        <div className="rounded-2xl border border-border bg-surface/80 p-4 shadow-sm backdrop-blur">
            <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-6">
                <input
                    className="input"
                    placeholder="Search experiment"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />

                <select className="input" value={selectedDataset} onChange={(event) => setSelectedDataset(event.target.value)}>
                    <option value="all">All Datasets</option>
                    <option value="overall">Overall</option>
                    <option value="mri">MRI</option>
                    <option value="esad">ESAD</option>
                    <option value="mesad">MESAD</option>
                </select>

                <select className="input" value={selectedAlgorithm} onChange={(event) => setSelectedAlgorithm(event.target.value)}>
                    <option>All</option>
                    <option>Double DQN</option>
                </select>

                <select className="input" value={selectedEpisodeWindow} onChange={(event) => setSelectedEpisodeWindow(event.target.value)}>
                    {episodeWindowOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <input
                    className="input"
                    type="date"
                    value={selectedDateFrom}
                    onChange={(event) => setSelectedDateFrom(event.target.value)}
                />

                <input
                    className="input"
                    type="date"
                    value={selectedDateTo}
                    onChange={(event) => setSelectedDateTo(event.target.value)}
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <select className="input max-w-48" value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
                    <option value="episode">Sort: Episode</option>
                    <option value="reward">Sort: Reward</option>
                    <option value="loss">Sort: Loss</option>
                    <option value="iou">Sort: IoU</option>
                    <option value="success">Sort: Success</option>
                    <option value="steps">Sort: Steps</option>
                    <option value="epsilon">Sort: Epsilon</option>
                </select>

                <button
                    type="button"
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium"
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                >
                    Sort {sortDirection === "asc" ? "Ascending" : "Descending"}
                </button>

                <button type="button" className="rounded-xl border border-border px-4 py-2 text-sm font-medium">
                    Export
                </button>

                <button type="button" className="rounded-xl border border-border px-4 py-2 text-sm font-medium" onClick={resetFilters}>
                    Reset Filters
                </button>
            </div>
        </div>
    );
}