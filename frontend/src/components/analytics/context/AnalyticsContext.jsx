import { createContext, useContext, useMemo, useState, useEffect } from "react";

import { domainLabels } from "../../../data/analytics";
import { buildMetricSummary, sliceEpisodes } from "../utils/statistics";
import { analyticsService } from "../../../services/analyticsService";

const AnalyticsContext = createContext(null);

const timeRangeToCount = {
    "100": 100,
    "500": 500,
    "1000": 1000,
    all: null
};

export function AnalyticsProvider({ children }) {
    // Data state
    const [selectedDomainData, setSelectedDomainData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filter state
    const [selectedDomain, setSelectedDomain] = useState("overall");
    const [selectedRange, setSelectedRange] = useState("all");
    const [selectedExperiment, setSelectedExperiment] = useState("mri");
    const [selectedDataset, setSelectedDataset] = useState("all");
    const [selectedEpisodeWindow, setSelectedEpisodeWindow] = useState("all");
    const [selectedDateFrom, setSelectedDateFrom] = useState("");
    const [selectedDateTo, setSelectedDateTo] = useState("");
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState("episode");
    const [sortDirection, setSortDirection] = useState("desc");

    /**
     * Fetch data for the selected domain
     */
    const fetchDomainData = async (domain) => {
        setLoading(true);
        setError(null);
        try {
            const data = await analyticsService.getByDomain(domain);
            setSelectedDomainData(data);
        } catch (err) {
            setError(err.message || "Failed to fetch analytics data");
            setSelectedDomainData([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load data when domain changes
     */
    useEffect(() => {
        fetchDomainData(selectedDomain);
    }, [selectedDomain]);

    /**
     * Compute filtered data based on all active filters
     */
    const filteredData = useMemo(() => {
        const limited = sliceEpisodes(selectedDomainData, timeRangeToCount[selectedRange]);
        const windowed = sliceEpisodes(limited, timeRangeToCount[selectedEpisodeWindow]);

        return windowed.filter((entry) => {
            const searchValue = `${entry.episode} ${entry.checkpoint} ${entry.status} ${entry.algorithm} ${entry.dataset}`.toLowerCase();
            const matchesQuery = searchValue.includes(searchQuery.toLowerCase());
            const matchesAlgorithm = selectedAlgorithm === "All" || entry.algorithm === selectedAlgorithm;
            const matchesDataset = selectedDataset === "all" || entry.dataset === selectedDataset;
            const entryDate = entry.trainingDate ?? "";
            const matchesDateFrom = !selectedDateFrom || entryDate >= selectedDateFrom;
            const matchesDateTo = !selectedDateTo || entryDate <= selectedDateTo;

            return matchesQuery && matchesAlgorithm && matchesDataset && matchesDateFrom && matchesDateTo;
        }).sort((left, right) => {
            const leftValue = left[sortKey];
            const rightValue = right[sortKey];

            if (typeof leftValue === "number" && typeof rightValue === "number") {
                return sortDirection === "asc" ? leftValue - rightValue : rightValue - leftValue;
            }

            return sortDirection === "asc"
                ? String(leftValue).localeCompare(String(rightValue))
                : String(rightValue).localeCompare(String(leftValue));
        });
    }, [selectedDomainData, selectedRange, selectedEpisodeWindow, searchQuery, selectedAlgorithm, selectedDataset, selectedDateFrom, selectedDateTo, sortDirection, sortKey]);

    /**
     * Compute metrics summary from filtered data
     */
    const metrics = useMemo(() => buildMetricSummary(filteredData), [filteredData]);

    /**
     * Extract unique experiments from filtered data
     */
    const experiments = useMemo(() => {
        const unique = new Map();

        filteredData.forEach((entry) => {
            if (!unique.has(entry.experimentId)) {
                unique.set(entry.experimentId, entry.experiment);
            }
        });

        return Array.from(unique.values());
    }, [filteredData]);

    /**
     * Reset all filters to default state
     */
    const resetFilters = () => {
        setSelectedRange("all");
        setSelectedEpisodeWindow("all");
        setSelectedDataset("all");
        setSelectedDateFrom("");
        setSelectedDateTo("");
        setSelectedAlgorithm("All");
        setSearchQuery("");
        setSortKey("episode");
        setSortDirection("desc");
    };

    /**
     * Manually refresh data for current domain
     */
    const refreshData = async () => {
        await fetchDomainData(selectedDomain);
    };

    const value = {
        // Domain labels
        domainLabels,

        // Filter state - Domain
        selectedDomain,
        setSelectedDomain,

        // Filter state - Range
        selectedRange,
        setSelectedRange,

        // Filter state - Experiment
        selectedExperiment,
        setSelectedExperiment,

        // Filter state - Dataset
        selectedDataset,
        setSelectedDataset,

        // Filter state - Episode Window
        selectedEpisodeWindow,
        setSelectedEpisodeWindow,

        // Filter state - Date Range
        selectedDateFrom,
        setSelectedDateFrom,
        selectedDateTo,
        setSelectedDateTo,

        // Filter state - Algorithm
        selectedAlgorithm,
        setSelectedAlgorithm,

        // Filter state - Search
        searchQuery,
        setSearchQuery,

        // Filter state - Sorting
        sortKey,
        setSortKey,
        sortDirection,
        setSortDirection,

        // Data state
        selectedDomainData,
        filteredData,
        metrics,
        experiments,

        // Loading state
        loading,
        error,

        // Actions
        resetFilters,
        refreshData
    };

    return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

/**
 * Hook to access Analytics context
 * Must be used within AnalyticsProvider
 * @returns {Object} Analytics context value
 */
export function useAnalytics() {
    const context = useContext(AnalyticsContext);

    if (!context) {
        throw new Error("useAnalytics must be used within an AnalyticsProvider");
    }

    return context;
}