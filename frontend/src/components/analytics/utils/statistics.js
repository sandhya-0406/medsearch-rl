/**
 * Statistics Utilities
 * 
 * Reusable statistical functions for analytics calculations.
 * Decouples calculations from component logic.
 */

/**
 * Slice data to get last N episodes
 * @param {Array} data - Analytics data
 * @param {number} count - Number of episodes to return (null returns all)
 * @returns {Array} Sliced data
 */
export function sliceEpisodes(data, count) {
    if (!Array.isArray(data)) {
        return [];
    }

    if (!count) {
        return [...data];
    }

    return data.slice(Math.max(data.length - count, 0));
}

/**
 * Calculate average of a numeric field
 * @param {Array} data - Analytics data
 * @param {string} field - Field name to calculate average for
 * @returns {number} Average value
 */
export function calculateAverage(data, field) {
    const values = (Array.isArray(data) ? data : [])
        .map((entry) => Number(entry[field]))
        .filter((value) => Number.isFinite(value));

    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Calculate best (maximum) value of a numeric field
 * @param {Array} data - Analytics data
 * @param {string} field - Field name to find best value for
 * @returns {number} Best (maximum) value
 */
export function calculateBest(data, field) {
    const values = (Array.isArray(data) ? data : [])
        .map((entry) => Number(entry[field]))
        .filter((value) => Number.isFinite(value));

    return values.length ? Math.max(...values) : 0;
}

/**
 * Calculate worst (minimum) value of a numeric field
 * @param {Array} data - Analytics data
 * @param {string} field - Field name to find worst value for
 * @returns {number} Worst (minimum) value
 */
export function calculateWorst(data, field) {
    const values = (Array.isArray(data) ? data : [])
        .map((entry) => Number(entry[field]))
        .filter((value) => Number.isFinite(value));

    return values.length ? Math.min(...values) : 0;
}

/**
 * Get current (latest) value of a field
 * @param {Array} data - Analytics data
 * @param {string} field - Field name to get current value for
 * @returns {number} Current value (last element)
 */
export function calculateCurrent(data, field) {
    const safeData = Array.isArray(data) ? data : [];
    if (!safeData.length) return 0;
    const value = Number(safeData[safeData.length - 1][field]);
    return Number.isFinite(value) ? value : 0;
}

/**
 * Calculate success rate as percentage
 * @param {Array} data - Analytics data
 * @returns {number} Success rate (0-100)
 */
export function calculateSuccessRate(data) {
    const values = (Array.isArray(data) ? data : [])
        .map((entry) => Number(entry.success))
        .filter((value) => Number.isFinite(value));

    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Calculate moving average of a field
 * @param {Array} data - Analytics data
 * @param {string} field - Field name to calculate moving average for
 * @param {number} windowSize - Size of the moving window
 * @returns {Array} Array of moving averages
 */
export function calculateMovingAverage(data, field, windowSize = 10) {
    const values = Array.isArray(data) ? data : [];
    if (!values.length || windowSize < 1) return [];

    const result = [];
    for (let i = 0; i < values.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const windowValues = values
            .slice(start, i + 1)
            .map((entry) => Number(entry[field]))
            .filter((value) => Number.isFinite(value));

        const average = windowValues.length
            ? windowValues.reduce((sum, value) => sum + value, 0) / windowValues.length
            : 0;

        result.push(average);
    }

    return result;
}

/**
 * Calculate trend (improvement or degradation) of a metric
 * @param {Array} data - Analytics data
 * @param {string} field - Field name to calculate trend for
 * @param {boolean} higherIsBetter - Whether higher values are better (default: true)
 * @returns {Object} Trend information
 */
export function calculateTrend(data, field, higherIsBetter = true) {
    const values = (Array.isArray(data) ? data : [])
        .map((entry) => Number(entry[field]))
        .filter((value) => Number.isFinite(value));

    if (values.length < 2) return { trend: "neutral", percentage: 0, direction: "none" };

    const first = values[0];
    const last = values[values.length - 1];
    const change = last - first;
    const percentage = first !== 0 ? (change / Math.abs(first)) * 100 : 0;

    let trend = "neutral";
    if (higherIsBetter) {
        trend = change > 0 ? "improving" : change < 0 ? "degrading" : "neutral";
    } else {
        trend = change < 0 ? "improving" : change > 0 ? "degrading" : "neutral";
    }

    return {
        trend,
        percentage: Math.round(percentage * 100) / 100,
        direction: change > 0 ? "up" : change < 0 ? "down" : "none",
        change: Math.round(change * 100) / 100
    };
}

/**
 * Build comprehensive metric summary
 * @param {Array} data - Analytics data
 * @returns {Object} Summary containing statistics for all metrics
 */
export function buildMetricSummary(data) {
    const safeData = Array.isArray(data) ? data : [];

    const metric = (key) => {
        const values = safeData.map((entry) => Number(entry[key])).filter((value) => Number.isFinite(value));

        if (!values.length) {
            return { current: 0, best: 0, average: 0 };
        }

        return {
            current: values[values.length - 1],
            best: Math.max(...values),
            average: values.reduce((sum, value) => sum + value, 0) / values.length
        };
    };

    return {
        episodes: safeData.length,
        reward: metric("reward"),
        loss: metric("loss"),
        iou: metric("iou"),
        success: metric("success"),
        steps: metric("steps"),
        epsilon: metric("epsilon")
    };
}

/**
 * Get unique values for a field
 * @param {Array} data - Analytics data
 * @param {string} field - Field name to get unique values for
 * @returns {Array} Array of unique values
 */
export function getUniqueValues(data, field) {
    const values = (Array.isArray(data) ? data : []).map((entry) => entry[field]);
    return [...new Set(values)].filter((v) => v !== undefined && v !== null);
}

/**
 * Get statistics for a numeric field
 * @param {Array} data - Analytics data
 * @param {string} field - Field name to calculate statistics for
 * @returns {Object} Complete statistics object
 */
export function getFieldStatistics(data, field) {
    const values = (Array.isArray(data) ? data : [])
        .map((entry) => Number(entry[field]))
        .filter((value) => Number.isFinite(value));

    if (!values.length) {
        return {
            count: 0,
            min: 0,
            max: 0,
            average: 0,
            median: 0,
            stdDev: 0,
            current: 0
        };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const min = sorted[0];
    const max = sorted[count - 1];
    const average = values.reduce((sum, v) => sum + v, 0) / count;
    const median = count % 2 === 0
        ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
        : sorted[Math.floor(count / 2)];

    const variance = values.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    return {
        count,
        min: Math.round(min * 1000) / 1000,
        max: Math.round(max * 1000) / 1000,
        average: Math.round(average * 1000) / 1000,
        median: Math.round(median * 1000) / 1000,
        stdDev: Math.round(stdDev * 1000) / 1000,
        current: values[values.length - 1]
    };
}