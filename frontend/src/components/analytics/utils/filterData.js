/**
 * Filter Utilities
 * 
 * Reusable filtering and search functions for analytics data.
 * Decouples data filtering from component logic.
 */

/**
 * Filter data by episode range
 * @param {Array} data - Analytics data
 * @param {number} minEpisode - Minimum episode number (inclusive)
 * @param {number} maxEpisode - Maximum episode number (inclusive)
 * @returns {Array} Filtered data
 */
export function filterByEpisodes(data, minEpisode, maxEpisode) {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (entry) => entry.episode >= minEpisode && entry.episode <= maxEpisode
  );
}

/**
 * Filter data by single algorithm
 * @param {Array} data - Analytics data
 * @param {string} algorithm - Algorithm name to filter by
 * @returns {Array} Filtered data
 */
export function filterByAlgorithm(data, algorithm) {
  if (!Array.isArray(data) || algorithm === "All") return data;
  return data.filter((entry) => entry.algorithm === algorithm);
}

/**
 * Filter data by search query across multiple fields
 * @param {Array} data - Analytics data
 * @param {string} query - Search query string
 * @param {Array<string>} fields - Fields to search in (default: episode, checkpoint, status, algorithm, dataset)
 * @returns {Array} Filtered data
 */
export function filterBySearch(data, query, fields = [
  "episode",
  "checkpoint",
  "status",
  "algorithm",
  "dataset"
]) {
  if (!Array.isArray(data) || !query.trim()) return data;

  const lowerQuery = query.toLowerCase();
  return data.filter((entry) =>
    fields.some((field) =>
      String(entry[field] || "").toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * Filter data by date range
 * @param {Array} data - Analytics data
 * @param {string} dateFrom - Start date (ISO format YYYY-MM-DD)
 * @param {string} dateTo - End date (ISO format YYYY-MM-DD)
 * @returns {Array} Filtered data
 */
export function filterByDate(data, dateFrom = "", dateTo = "") {
  if (!Array.isArray(data)) return [];

  return data.filter((entry) => {
    const entryDate = entry.trainingDate || "";
    const matchesFrom = !dateFrom || entryDate >= dateFrom;
    const matchesTo = !dateTo || entryDate <= dateTo;
    return matchesFrom && matchesTo;
  });
}

/**
 * Filter data by dataset
 * @param {Array} data - Analytics data
 * @param {string} dataset - Dataset identifier
 * @returns {Array} Filtered data
 */
export function filterByDataset(data, dataset) {
  if (!Array.isArray(data) || dataset === "all") return data;
  return data.filter((entry) => entry.dataset === dataset);
}

/**
 * Filter data by status
 * @param {Array} data - Analytics data
 * @param {string} status - Status to filter by (Completed, Running, Queued, etc.)
 * @returns {Array} Filtered data
 */
export function filterByStatus(data, status) {
  if (!Array.isArray(data)) return [];
  return data.filter((entry) => entry.status === status);
}

/**
 * Filter data by checkpoint type
 * @param {Array} data - Analytics data
 * @param {string} checkpointType - Checkpoint type (Best, Final, Intermediate)
 * @returns {Array} Filtered data
 */
export function filterByCheckpoint(data, checkpointType) {
  if (!Array.isArray(data)) return [];
  return data.filter((entry) => entry.checkpoint === checkpointType);
}

/**
 * Apply multiple filters at once
 * @param {Array} data - Analytics data
 * @param {Object} filters - Filter object with keys as filter types
 * @returns {Array} Filtered data
 */
export function applyMultipleFilters(data, filters = {}) {
  let result = [...(Array.isArray(data) ? data : [])];

  if (filters.minEpisode !== undefined && filters.maxEpisode !== undefined) {
    result = filterByEpisodes(result, filters.minEpisode, filters.maxEpisode);
  }

  if (filters.algorithm) {
    result = filterByAlgorithm(result, filters.algorithm);
  }

  if (filters.dataset) {
    result = filterByDataset(result, filters.dataset);
  }

  if (filters.status) {
    result = filterByStatus(result, filters.status);
  }

  if (filters.checkpoint) {
    result = filterByCheckpoint(result, filters.checkpoint);
  }

  if (filters.dateFrom || filters.dateTo) {
    result = filterByDate(result, filters.dateFrom, filters.dateTo);
  }

  if (filters.search) {
    result = filterBySearch(result, filters.search, filters.searchFields);
  }

  return result;
}
