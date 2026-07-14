import { useAnalytics } from "../hooks/useAnalytics";

export default function MetricsToolbar({ onExport }) {
    const { searchQuery, setSearchQuery } = useAnalytics();

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 className="mb-1 text-xl font-semibold">Training Table</h2>
                <p className="text-sm text-muted-foreground">Sortable, scrollable training metrics with export support.</p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <input
                    className="input w-full lg:w-80"
                    placeholder="Search table rows"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />

                <button
                    type="button"
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-primary hover:text-white"
                    onClick={onExport}
                >
                    Export CSV
                </button>
            </div>
        </div>
    );
}