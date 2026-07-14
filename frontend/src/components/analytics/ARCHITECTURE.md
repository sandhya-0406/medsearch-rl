# Analytics Data-Driven Architecture Guide

## Overview

The Analytics module has been completely refactored into a professional, data-driven architecture following best practices from platforms like TensorBoard, Weights & Biases, and NVIDIA Clara.

**Key Principles:**
- ✅ Single source of truth (Context)
- ✅ No prop drilling
- ✅ No component imports mock data directly
- ✅ Service layer for backend-ready API
- ✅ Reusable utility functions
- ✅ Automatic reactivity when filters change

---

## Architecture Layers

### 1. **Data Layer** (`src/data/analytics/`)

Mock datasets organized by domain:
```
overall.js  - Complete benchmark data
mri.js      - MRI domain analytics
esad.js     - ESAD domain analytics
mesad.js    - MESAD domain analytics
```

Each dataset contains:
- `episode` - Training episode number
- `reward` - Agent reward
- `loss` - Training loss
- `iou` - Intersection over Union metric
- `success` - Success rate percentage
- `steps` - Environment steps
- `epsilon` - Exploration rate
- `checkpoint` - Checkpoint type (Best, Final, Intermediate)
- `status` - Training status (Completed, Running, Queued)
- `algorithm` - Algorithm name
- `dataset` - Domain identifier
- `trainingDate` - Training date
- `experiment` - Full experiment metadata

### 2. **Service Layer** (`src/services/analyticsService.js`)

Abstracts data access from components. All components call through here.

**Current Implementation:** Returns mock data  
**Future Implementation:** Replaces with Flask API calls

```javascript
// Today
return Promise.resolve(analyticsByDomain.mri);

// Tomorrow
return fetch("/api/analytics/mri").then(r => r.json());
```

**Available Methods:**
```javascript
analyticsService.getOverall()    // Overall domain
analyticsService.getMRI()        // MRI domain
analyticsService.getESAD()       // ESAD domain
analyticsService.getMESAD()      // MESAD domain
analyticsService.getByDomain(domain)  // Any domain
analyticsService.refreshAll()    // Refresh all data
```

### 3. **Context Layer** (`src/components/analytics/context/AnalyticsContext.jsx`)

Centralized state management with automatic reactivity.

**State Managed:**
```javascript
// Filter State
selectedDomain           // Current domain
selectedRange            // Episode range
selectedDataset          // Dataset filter
selectedEpisodeWindow    // Last N episodes
selectedDateFrom/To      // Date range
selectedAlgorithm        // Algorithm filter
searchQuery              // Search filter
sortKey / sortDirection  // Sorting

// Data State
selectedDomainData       // Raw domain data
filteredData             // Computed filtered data
metrics                  // Computed summary
experiments              // Unique experiments

// Loading State
loading                  // Data loading flag
error                    // Error message
```

**Key Features:**
- Automatic data fetching when domain changes
- Automatic recomputation when any filter changes (via useMemo)
- Metrics summary computed from filtered data
- Experiment extraction from filtered data

**Actions:**
```javascript
setSelectedDomain(domain)
setSelectedRange(range)
setSelectedDataset(dataset)
setSelectedEpisodeWindow(window)
setSelectedDateFrom(date)
setSelectedDateTo(date)
setSelectedAlgorithm(algorithm)
setSearchQuery(query)
setSortKey(key)
setSortDirection(direction)
resetFilters()
refreshData()
```

### 4. **Hook Layer** (`src/components/analytics/hooks/useAnalytics.js`)

Single hook for all components to consume context.

```javascript
const {
  // State
  selectedDomain,
  selectedRange,
  selectedDataset,
  selectedEpisodeWindow,
  selectedDateFrom,
  selectedDateTo,
  selectedAlgorithm,
  searchQuery,
  sortKey,
  sortDirection,
  
  // Data
  selectedDomainData,
  filteredData,
  metrics,
  experiments,
  
  // Loading
  loading,
  error,
  
  // Actions
  setSelectedDomain,
  setSelectedRange,
  setSelectedDataset,
  setSelectedEpisodeWindow,
  setSelectedDateFrom,
  setSelectedDateTo,
  setSelectedAlgorithm,
  setSearchQuery,
  setSortKey,
  setSortDirection,
  resetFilters,
  refreshData,
  
  // Labels
  domainLabels
} = useAnalytics();
```

### 5. **Utility Layer** (`src/components/analytics/utils/`)

#### Statistics Utilities (`statistics.js`)

Reusable calculation functions:

```javascript
// Basic calculations
calculateAverage(data, field)        // Mean value
calculateBest(data, field)           // Maximum value
calculateWorst(data, field)          // Minimum value
calculateCurrent(data, field)        // Latest value
calculateSuccessRate(data)           // Success percentage

// Advanced calculations
calculateMovingAverage(data, field, windowSize)  // Smoothed trend
calculateTrend(data, field, higherIsBetter)      // Improvement analysis
getUniqueValues(data, field)                     // Distinct values
getFieldStatistics(data, field)                  // Full statistics object

// Data processing
sliceEpisodes(data, count)           // Get last N episodes
buildMetricSummary(data)             // Summary for all metrics
```

#### Filter Utilities (`filterData.js`)

Reusable filtering functions:

```javascript
filterByEpisodes(data, min, max)     // Episode range
filterByAlgorithm(data, algorithm)   // Algorithm name
filterByDataset(data, dataset)       // Dataset domain
filterByStatus(data, status)         // Training status
filterByCheckpoint(data, type)       // Checkpoint type
filterByDate(data, from, to)         // Date range
filterBySearch(data, query, fields)  // Multi-field search

// Batch filtering
applyMultipleFilters(data, filters)  // Apply multiple filters at once
```

#### Download Utilities (`downloadCSV.js`, `downloadJSON.js`, `downloadPNG.js`)

Export functionality for all data types.

---

## Component Architecture

### AnalyticsProvider (Parent)
```jsx
<AnalyticsProvider>
  <AnalyticsContent />
</AnalyticsProvider>
```

Wraps the entire Analytics page and provides context.

### Consumer Components

All consumer components follow this pattern:

```jsx
export default function MyComponent() {
  const { filteredData, metrics, loading, error } = useAnalytics();
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  
  return <div>{/* render using context data */}</div>;
}
```

**Current Components Using Context:**
- `AnalyticsHeader` - Page header
- `DomainSwitcher` - Domain selection
- `TrainingSummary` - Metric cards
- `AnalyticsFilters` - Filter toolbar
- `RewardChart` - Reward visualization
- `LossChart` - Loss visualization
- `IoUChart` - IoU visualization
- `SuccessChart` - Success rate visualization
- `StepsChart` - Steps visualization
- `EpsilonChart` - Epsilon visualization
- `ExperimentGrid` - Experiment cards
- `MetricsTable` - Data table

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│         AnalyticsProvider                   │
│  (State Management + Data Fetching)         │
└────────────────┬────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼─────┐    ┌────▼──────┐
    │ Filters  │    │    Data   │
    │(UI State)│    │(Computed) │
    └────┬─────┘    └────┬──────┘
         │                │
    ┌────▼────────────────▼────┐
    │  useAnalytics Hook       │
    │  (Data Access Point)     │
    └────┬─────────────────────┘
         │
    ┌────┴──────────────────────┐
    │  Consumer Components      │
    │  (Charts, Tables, Cards)  │
    └───────────────────────────┘
```

---

## Backend Integration Guide

### Current State (Mock)
```javascript
// analyticsService.js
async getByDomain(domain) {
  return Promise.resolve(analyticsByDomain[domain]);
}
```

### Migration Steps

1. **Step 1: Create Flask endpoints**
```python
# Flask backend
@app.route('/api/analytics/<domain>')
def get_analytics(domain):
    # Query database
    # Return JSON array
    return jsonify(analytics_data)
```

2. **Step 2: Update service layer (no component changes needed)**
```javascript
// analyticsService.js
async getByDomain(domain) {
  const response = await fetch(`/api/analytics/${domain}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}
```

3. **Components automatically use new data** ✨

---

## API Contract (Expected)

### GET `/api/analytics`
Returns all domain analytics.

**Response:**
```json
{
  "overall": [...],
  "mri": [...],
  "esad": [...],
  "mesad": [...]
}
```

### GET `/api/analytics/{domain}`
Returns analytics for specific domain.

**Response:**
```json
[
  {
    "episode": 1,
    "reward": 10.5,
    "loss": 1.2,
    "iou": 0.18,
    "success": 45,
    "steps": 95,
    "epsilon": 0.99,
    "checkpoint": "Intermediate",
    "status": "Completed",
    "algorithm": "Double DQN",
    "dataset": "mri",
    "trainingDate": "2026-06-28",
    "experiment": {...}
  },
  ...
]
```

---

## Scalability & Reusability

This architecture is designed to be the reference implementation for ALL future modules:

- **Agent Explorer** - Use same Context/Hook/Service pattern
- **Replay Studio** - Reuse filter utilities
- **Classification** - Reuse statistics utilities
- **Heatmaps** - Reuse download utilities
- **Comparison Lab** - Extend filtering logic
- **Explainability** - Extend visualization patterns
- **Research Playground** - Build on same foundation

---

## Key Benefits

✅ **Zero Coupling** - Components don't know about data source  
✅ **Easy Testing** - Mock service in unit tests  
✅ **Easy Backend Migration** - Change service, components unchanged  
✅ **Automatic Reactivity** - All data updates flow through context  
✅ **No Prop Drilling** - Use hook in any component, anywhere  
✅ **Professional Quality** - Matches TensorBoard/W&B architecture  
✅ **Developer Experience** - Clear patterns, easy to extend  

---

## File Structure

```
frontend/src/
├── data/analytics/
│   ├── overall.js
│   ├── mri.js
│   ├── esad.js
│   ├── mesad.js
│   └── index.js
├── services/
│   └── analyticsService.js           ← NEW
├── components/analytics/
│   ├── context/
│   │   └── AnalyticsContext.jsx       ← REFACTORED
│   ├── hooks/
│   │   └── useAnalytics.js            ← REFACTORED
│   ├── utils/
│   │   ├── statistics.js              ← ENHANCED
│   │   ├── filterData.js              ← NEW
│   │   ├── downloadCSV.js
│   │   ├── downloadJSON.js
│   │   └── downloadPNG.js
│   ├── charts/
│   │   ├── RewardChart.jsx
│   │   ├── LossChart.jsx
│   │   ├── IoUChart.jsx
│   │   ├── SuccessChart.jsx
│   │   ├── StepsChart.jsx
│   │   └── EpsilonChart.jsx
│   ├── tables/
│   │   └── MetricsTable.jsx
│   ├── experiments/
│   │   ├── ExperimentGrid.jsx
│   │   └── ExperimentCard.jsx
│   ├── filters/
│   │   ├── AnalyticsFilters.jsx
│   │   └── FilterToolbar.jsx
│   ├── AnalyticsHeader.jsx
│   ├── DomainSwitcher.jsx
│   ├── TrainingSummary.jsx
│   └── MetricCard.jsx
└── pages/Analytics/
    └── index.jsx
```

---

## Quick Start for New Features

### Adding a New Chart
```jsx
import { useAnalytics } from '../hooks/useAnalytics';
import AnalyticsChart from './AnalyticsChart';

export default function MyNewChart() {
  const { filteredData, loading } = useAnalytics();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <AnalyticsChart 
      data={filteredData}
      dataKey="myField"
      title="My Metric"
    />
  );
}
```

### Adding a New Filter
1. Add state to AnalyticsContext
2. Add action setter
3. Include in filter logic
4. Add UI to FilterToolbar
5. Done! ✨

### Using Utilities in Components
```jsx
import { calculateAverage, filterByAlgorithm } from '../utils/statistics';
import { filterBySearch } from '../utils/filterData';

// Inside component
const avgReward = calculateAverage(data, 'reward');
const filtered = filterBySearch(data, query);
```

---

## Debugging Tips

### Check Context Data
```javascript
const { filteredData, metrics, loading, error } = useAnalytics();
console.log('Filtered:', filteredData);
console.log('Metrics:', metrics);
console.log('Loading:', loading);
console.log('Error:', error);
```

### Verify Service Call
```javascript
// In analyticsService.js
async getByDomain(domain) {
  console.log(`Fetching ${domain}...`);
  const data = await analyticsService.getByDomain(domain);
  console.log('Result:', data);
  return data;
}
```

### Test Filters
```javascript
import { filterBySearch, filterByAlgorithm } from '../utils/filterData';

const test = filterBySearch(data, 'reward');
console.log(test.length); // Should be > 0
```

---

## Performance Considerations

- Data is memoized at context level
- Filtered data recomputes only when dependencies change
- Components rerender only when their specific slice of state changes
- Charts use recharts memoization for rendering
- Table uses pagination to avoid rendering 1000+ rows

**Optimization Pattern:**
```javascript
const filteredData = useMemo(() => {
  // Heavy computation
  return result;
}, [dependency1, dependency2]); // Only recompute when these change
```

---

## Testing Strategy

### Unit Tests
```javascript
// Test utilities
expect(calculateAverage([{reward: 10}, {reward: 20}], 'reward')).toBe(15);
expect(filterByAlgorithm(data, 'Double DQN')).toHaveLength(5);
```

### Integration Tests
```javascript
// Mock service, render component
jest.mock('../../../services/analyticsService');
render(<AnalyticsProvider><MyComponent /></AnalyticsProvider>);
```

### E2E Tests
```javascript
// Test full data flow
cy.get('[data-testid=domain-switcher]').click('mri');
cy.get('[data-testid=metrics-table]').should('exist');
```

---

## Troubleshooting

### Issue: Components not updating when filters change
**Solution:** Ensure component uses `useAnalytics()` hook and accesses state correctly

### Issue: Loading never completes
**Solution:** Check analyticsService - service must return Promise

### Issue: Data shows for one domain but not another
**Solution:** Verify data exists in src/data/analytics/{domain}.js

### Issue: Charts showing wrong data
**Solution:** Charts use `selectedDomainData` (full) or `filteredData` (filtered) - verify which is intended

---

Generated: 2026-06-28  
Architecture Version: 1.0  
Status: Production Ready ✅
