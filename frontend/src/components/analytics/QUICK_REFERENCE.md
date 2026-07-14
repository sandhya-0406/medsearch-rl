# Analytics Architecture - Developer Quick Reference

## 🎯 Quick Start: Building New Features

### 1. Add a New Chart

```jsx
// src/components/analytics/charts/MyNewChart.jsx
import { useAnalytics } from '../hooks/useAnalytics';
import AnalyticsChart from './AnalyticsChart';

export default function MyNewChart() {
  const { filteredData, loading, error } = useAnalytics();
  
  if (error) return <ErrorMessage error={error} />;
  if (loading) return <LoadingSpinner />;
  
  return (
    <AnalyticsChart 
      data={filteredData}
      dataKey="myMetric"
      title="My Metric Visualization"
      stroke="#06b6d4"
    />
  );
}
```

### 2. Add a New Filter

```jsx
// 1. Add state to AnalyticsContext
const [selectedMyFilter, setSelectedMyFilter] = useState("default");

// 2. Add to value object
const value = {
  selectedMyFilter,
  setSelectedMyFilter,
  // ... rest of state
};

// 3. Use in FilterToolbar
const { selectedMyFilter, setSelectedMyFilter } = useAnalytics();

// 4. Apply filter in filteredData computation
const filteredData = useMemo(() => {
  // ... existing filters
  return data.filter(entry => {
    const matchesMyFilter = selectedMyFilter === "all" || entry.field === selectedMyFilter;
    return matchesMyFilter && /* other conditions */;
  });
}, [/* include selectedMyFilter in dependencies */]);

// 5. Done! ✨ All components auto-update
```

### 3. Use Calculation Functions

```jsx
import { 
  calculateAverage, 
  calculateBest, 
  calculateTrend,
  calculateMovingAverage 
} from '../utils/statistics';

// In your component
const avgReward = calculateAverage(filteredData, 'reward');
const bestReward = calculateBest(filteredData, 'reward');
const trend = calculateTrend(filteredData, 'reward', true); // higher is better

console.log(trend); // { trend: 'improving', percentage: 5.25, direction: 'up' }
```

### 4. Use Filter Functions

```jsx
import { 
  filterBySearch, 
  filterByAlgorithm, 
  applyMultipleFilters 
} from '../utils/filterData';

// Single filter
const searchResults = filterBySearch(data, query);

// Multiple filters at once
const results = applyMultipleFilters(data, {
  algorithm: 'Double DQN',
  dateFrom: '2026-06-01',
  dateTo: '2026-06-30',
  search: 'checkpoint'
});
```

---

## 📋 Context Usage Patterns

### Getting Data
```jsx
const { filteredData, selectedDomainData, metrics } = useAnalytics();
// filteredData - respects all active filters
// selectedDomainData - raw data for current domain
// metrics - {episodes, reward, loss, iou, success, steps, epsilon}
```

### Getting Filters
```jsx
const { 
  selectedDomain,
  selectedAlgorithm,
  selectedDataset,
  searchQuery,
  sortKey,
  sortDirection
} = useAnalytics();
```

### Setting Filters
```jsx
const { setSelectedDomain, setSearchQuery, resetFilters } = useAnalytics();

// Change domain
setSelectedDomain('mri');

// Update search
setSearchQuery('best');

// Reset everything
resetFilters();
```

### Loading States
```jsx
const { loading, error } = useAnalytics();

if (error) {
  return <div className="text-red-400">Error: {error}</div>;
}

if (loading) {
  return <LoadingSpinner />;
}

return <YourComponent />;
```

---

## 🔄 Data Flow Example

```
User clicks "MRI" domain switcher
         ↓
setSelectedDomain('mri')
         ↓
useEffect in AnalyticsContext triggers
         ↓
analyticsService.getByDomain('mri') called
         ↓
setSelectedDomainData(mriData)
         ↓
filteredData useMemo recalculates
         ↓
metrics useMemo recalculates
         ↓
ALL components re-render with new data
         ↓
User sees updated charts, table, cards ✨
```

---

## 🧪 Testing Patterns

### Test a Utility Function
```javascript
import { calculateAverage, filterByAlgorithm } from '../utils/statistics';

describe('calculateAverage', () => {
  it('calculates average correctly', () => {
    const data = [
      { reward: 10 },
      { reward: 20 },
      { reward: 30 }
    ];
    expect(calculateAverage(data, 'reward')).toBe(20);
  });
});
```

### Test with Mock Service
```javascript
import { render } from '@testing-library/react';
import { AnalyticsProvider } from '../context/AnalyticsContext';

jest.mock('../../../services/analyticsService', () => ({
  analyticsService: {
    getByDomain: jest.fn(() => Promise.resolve(mockData))
  }
}));

test('renders with mock data', () => {
  render(
    <AnalyticsProvider>
      <MyComponent />
    </AnalyticsProvider>
  );
  // assertions...
});
```

---

## 🚀 Optimization Tips

### Memoize Expensive Calculations
```jsx
import { useMemo } from 'react';

const expensiveResult = useMemo(() => {
  // Heavy computation
  return calculate(data);
}, [data]); // Only recalculate when data changes
```

### Use Pagination for Large Lists
```jsx
const pageSize = 10;
const paginatedData = useMemo(() => {
  const start = (page - 1) * pageSize;
  return filteredData.slice(start, start + pageSize);
}, [filteredData, page]);
```

### Avoid Re-renders
```jsx
// ❌ BAD - Computes on every render
const result = calculateAverage(filteredData, 'reward');

// ✅ GOOD - Memoized
const result = useMemo(
  () => calculateAverage(filteredData, 'reward'),
  [filteredData]
);
```

---

## 🔌 Backend Integration Checklist

- [ ] Create Flask endpoints: `/api/analytics/{domain}`
- [ ] Define response schema (match current mock structure)
- [ ] Update `analyticsService.js` - replace mock with `fetch()`
- [ ] Add error handling - service throws on API errors
- [ ] Add loading state - set `loading = true` during fetch
- [ ] Test with real data - verify context updates
- [ ] Add caching - optional, store in sessionStorage
- [ ] Add real-time updates - optional, use WebSocket

**Example Flask endpoint:**
```python
@app.route('/api/analytics/<domain>')
def get_analytics(domain):
    if domain not in ['overall', 'mri', 'esad', 'mesad']:
        return jsonify({'error': 'Invalid domain'}), 400
    
    data = get_analytics_from_db(domain)
    return jsonify(data)
```

**Update service:**
```javascript
async getByDomain(domain) {
  const response = await fetch(`/api/analytics/${domain}`);
  if (!response.ok) throw new Error('API error');
  return response.json();
}
```

---

## 📁 File Checklist: New Module Setup

Copy this structure for any new feature module:

```
frontend/src/
└── components/mymodule/
    ├── context/
    │   └── MyModuleContext.jsx          (Provider + hook)
    ├── hooks/
    │   └── useMyModule.js                (Export hook)
    ├── services/
    │   └── mymoduleService.js            (Data access)
    ├── utils/
    │   ├── calculations.js               (Business logic)
    │   └── filters.js                    (Filter logic)
    ├── components/
    │   ├── MyComponent1.jsx
    │   ├── MyComponent2.jsx
    │   └── ...
    └── README.md                         (Module documentation)
```

---

## 🐛 Common Issues & Fixes

### Issue: Component not updating when filter changes
**Solution:** Ensure component uses `useAnalytics()` and accesses correct slice of state

### Issue: Loading never completes
**Solution:** Check `analyticsService` - must return Promise that resolves

### Issue: Data missing after domain switch
**Solution:** Verify domain data exists in `src/data/analytics/{domain}.js`

### Issue: Wrong data in charts
**Solution:** Charts should use `filteredData` (respects filters) or `selectedDomainData` (full domain)?

### Issue: Performance slow with large datasets
**Solution:** Add pagination like MetricsTable does, or use windowing library

---

## 📚 File Reference

| File | Purpose | Modify For |
|------|---------|-----------|
| `analyticsService.js` | Data access | Backend integration |
| `AnalyticsContext.jsx` | State + fetching | Add filter, loading state |
| `useAnalytics.js` | Hook export | Add new context fields |
| `statistics.js` | Calculations | Add calculation functions |
| `filterData.js` | Filtering | Add filter functions |
| `AnalyticsChart.jsx` | Chart template | Customize chart behavior |
| `MetricsTable.jsx` | Table template | Customize columns |

---

## ✅ Quality Checklist

Before shipping a new component:

- [ ] Uses `useAnalytics()` hook, not direct imports
- [ ] Handles loading state with spinner
- [ ] Handles error state with message
- [ ] Handles empty data state gracefully
- [ ] Uses memoization for expensive computations
- [ ] No prop drilling - all from context
- [ ] Works with filters - respects filteredData
- [ ] Has proper TypeScript/JSDoc comments
- [ ] Tested with various data states
- [ ] Mobile responsive
- [ ] Accessible (keyboard, screen readers)

---

## 🎓 Learning Resources

1. **Start here:** `ARCHITECTURE.md` (full guide)
2. **Example:** `MetricsTable.jsx` (real component using context)
3. **Deep dive:** React Context + useMemo + useEffect patterns
4. **Reference:** Each utility function has JSDoc comments

---

Generated: 2026-06-28  
Version: 1.0  
Status: Ready to use ✅
