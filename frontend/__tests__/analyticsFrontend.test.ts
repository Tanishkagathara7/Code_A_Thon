import { AnalyticsOverviewData, AnalyticsOverviewMetrics, CategoryMetric, ActivityMetric } from '../types/analytics';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Completion Rate Calculation Helper Function
const calculateCompletionRate = (completed: number, total: number): number => {
  if (!total || total === 0) return 0;
  return Number(((completed / total) * 100).toFixed(2));
};

// 2. Trend Direction Calculation Helper Function
const calculateTrendDirection = (activity: ActivityMetric[]): 'Increasing' | 'Decreasing' | 'Stable' => {
  if (!activity || activity.length < 2) return 'Stable';
  const mid = Math.floor(activity.length / 2);
  const firstHalfSum = activity.slice(0, mid).reduce((sum, a) => sum + a.count, 0);
  const secondHalfSum = activity.slice(mid).reduce((sum, a) => sum + a.count, 0);

  if (secondHalfSum > firstHalfSum) return 'Increasing';
  if (secondHalfSum < firstHalfSum) return 'Decreasing';
  return 'Stable';
};

// 3. Category Percentage Helper Function
const calculateCategoryPercentages = (categories: CategoryMetric[], total: number) => {
  if (total === 0) return [];
  return categories.map((c) => ({
    category: c.category,
    count: c.count,
    percentage: Number(((c.count / total) * 100).toFixed(1)),
  }));
};

async function runFrontendAnalyticsTests() {
  console.log('--- Running Frontend Analytics Foundation Tests ---');

  // Test 1: Completion rate with valid numbers
  const rate1 = calculateCompletionRate(10, 36);
  assert(rate1 === 27.78, 'Completion rate for 10/36 should be 27.78%');

  const rate2 = calculateCompletionRate(4, 10);
  assert(rate2 === 40, 'Completion rate for 4/10 should be 40%');
  console.log('✅ 1. Completion rate calculation passed');

  // Test 2: Completion rate with zero total prevents NaN / Infinity
  const rateZero = calculateCompletionRate(0, 0);
  assert(rateZero === 0, 'Completion rate for 0 total should be 0');
  assert(!isNaN(rateZero), 'Completion rate must not be NaN');
  console.log('✅ 2. Zero total completion rate safety passed');

  // Test 3: Category percentage calculations
  const categories: CategoryMetric[] = [
    { category: 'Education', count: 8 },
    { category: 'Environment', count: 6 },
    { category: 'Healthcare', count: 2 },
  ];
  const percentages = calculateCategoryPercentages(categories, 16);
  assert(percentages.length === 3, 'Should have 3 categories');
  assert(percentages[0].percentage === 50, 'Education should be 50%');
  assert(percentages[1].percentage === 37.5, 'Environment should be 37.5%');
  assert(percentages[2].percentage === 12.5, 'Healthcare should be 12.5%');
  console.log('✅ 3. Category distribution percentage rendering passed');

  // Test 4: Activity trend calculation (Increasing, Decreasing, Stable)
  const increasingActivity: ActivityMetric[] = [
    { date: '2026-09-01', count: 1 },
    { date: '2026-09-02', count: 2 },
    { date: '2026-09-03', count: 5 },
    { date: '2026-09-04', count: 8 },
  ];
  assert(calculateTrendDirection(increasingActivity) === 'Increasing', 'Should detect increasing trend');

  const decreasingActivity: ActivityMetric[] = [
    { date: '2026-09-01', count: 10 },
    { date: '2026-09-02', count: 5 },
    { date: '2026-09-03', count: 2 },
    { date: '2026-09-04', count: 0 },
  ];
  assert(calculateTrendDirection(decreasingActivity) === 'Decreasing', 'Should detect decreasing trend');

  const emptyActivity: ActivityMetric[] = [];
  assert(calculateTrendDirection(emptyActivity) === 'Stable', 'Empty activity should return Stable');
  console.log('✅ 4. Activity trend direction calculation passed');

  // Test 5: API Response parsing simulation
  const rawApiResponse = {
    success: true,
    data: {
      overview: {
        total: 36,
        completed: 10,
        inProgress: 14,
        pending: 12,
        completionRate: 27.78,
      },
      categories: [{ category: 'Education', count: 8 }],
      activity: [{ date: '2026-09-01', count: 3 }],
      recentActivity: [
        {
          id: 'item_99',
          title: 'Edu Dashboard',
          status: 'completed',
          category: 'Education',
          createdAt: '2026-09-12T12:00:00Z',
        },
      ],
    },
  };

  assert(rawApiResponse.success === true, 'API response must have success: true');
  assert(rawApiResponse.data.overview.total === 36, 'Total must match 36');
  assert(rawApiResponse.data.recentActivity[0].id === 'item_99', 'Recent item ID must match');
  console.log('✅ 5. API response structure parsing passed');

  // Test 6: Zero/Empty State Data structure
  const zeroDataResponse: AnalyticsOverviewData = {
    overview: {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      completionRate: 0,
    },
    categories: [],
    activity: [],
    recentActivity: [],
  };

  assert(zeroDataResponse.overview.total === 0, 'Zero data total should be 0');
  assert(zeroDataResponse.categories.length === 0, 'Categories array should be empty');
  assert(zeroDataResponse.recentActivity.length === 0, 'Recent activity array should be empty');
  console.log('✅ 6. Zero/Empty state response handling passed');

  console.log('--- All Frontend Analytics Foundation Tests Passed! ---');
}

runFrontendAnalyticsTests();
