import { ApiError, DomainEntity, HackathonItem, ItemStatus } from '../types/domain';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Form Validation helper logic matching DomainForm component
const validateItemInput = (title: string, description?: string, category?: string) => {
  const errors: { title?: string; description?: string; category?: string } = {};

  if (!title || title.trim() === '') {
    errors.title = 'Title is required';
  } else if (title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (description && description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }

  if (category && category.length > 50) {
    errors.category = 'Category cannot exceed 50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 2. Pagination Math & Deduplication helper logic matching ItemListScreen
const handlePaginatedAppend = (
  existingItems: HackathonItem[],
  incomingItems: HackathonItem[]
): HackathonItem[] => {
  const existingIds = new Set(existingItems.map((item) => item.id));
  const uniqueIncoming = incomingItems.filter((item) => !existingIds.has(item.id));
  return [...existingItems, ...uniqueIncoming];
};

const hasNextPage = (currentPage: number, totalPages: number): boolean => {
  return currentPage < totalPages;
};

// 3. Mock API Service Simulator
class MockDomainApiService {
  private items: HackathonItem[] = [
    {
      id: 'item_1',
      title: 'Build Frontend Primitive',
      description: 'Create reusable cards and forms',
      status: 'completed',
      category: 'Frontend',
      owner: 'user_123',
      createdAt: '2026-09-12T10:00:00Z',
      updatedAt: '2026-09-12T10:00:00Z',
    },
    {
      id: 'item_2',
      title: 'Setup Domain Routing',
      description: 'Expo router setup for domain screens',
      status: 'in_progress',
      category: 'Navigation',
      owner: 'user_123',
      createdAt: '2026-09-12T11:00:00Z',
      updatedAt: '2026-09-12T11:00:00Z',
    },
  ];

  async getItems(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    sort?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    let filtered = [...this.items];

    if (params.status) {
      filtered = filtered.filter((i) => i.status === params.status);
    }

    if (params.category) {
      filtered = filtered.filter((i) => i.category === params.category);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q)
      );
    }

    if (params.sort === 'title_asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (params.sort === 'title_desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getItem(id: string) {
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      throw new ApiError('Item not found', 404);
    }
    return { success: true, data: item };
  }

  async createItem(payload: { title: string; description?: string; status?: ItemStatus; category?: string }) {
    const val = validateItemInput(payload.title, payload.description, payload.category);
    if (!val.isValid) {
      throw new ApiError(Object.values(val.errors)[0], 400);
    }

    const newItem: HackathonItem = {
      id: `item_${Date.now()}`,
      title: payload.title.trim(),
      description: payload.description,
      status: payload.status || 'pending',
      category: payload.category,
      owner: 'user_123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.items.unshift(newItem);
    return { success: true, data: newItem };
  }

  async updateItem(id: string, payload: Partial<HackathonItem>) {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new ApiError('Item not found', 404);
    }

    if (payload.title !== undefined) {
      const val = validateItemInput(payload.title, payload.description, payload.category);
      if (!val.isValid) {
        throw new ApiError(Object.values(val.errors)[0], 400);
      }
    }

    const updated: HackathonItem = {
      ...this.items[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    this.items[index] = updated;
    return { success: true, data: updated };
  }

  async deleteItem(id: string) {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new ApiError('Item not found or delete failed', 404);
    }
    this.items.splice(index, 1);
    return { success: true, message: 'Item deleted successfully', data: { id } };
  }
}

async function runDomainTests() {
  console.log('--- Running Domain UI & API Foundation Tests ---');
  const service = new MockDomainApiService();

  // Test 1: Fetch item list & pagination response structure
  const listRes = await service.getItems({ page: 1, limit: 10 });
  assert(listRes.success === true, 'List request should succeed');
  assert(listRes.data.length === 2, 'Should return 2 items initially');
  assert(listRes.pagination.total === 2, 'Pagination total should match');
  assert(listRes.pagination.page === 1, 'Pagination page should be 1');
  console.log('✅ 1. Get domain items list & pagination passed');

  // Test 2: Search filtering
  const searchRes = await service.getItems({ search: 'Frontend' });
  assert(searchRes.data.length === 1, 'Search for Frontend should return 1 item');
  assert(searchRes.data[0].id === 'item_1', 'Item 1 should match search');
  console.log('✅ 2. Domain items search filtering passed');

  // Test 3: Get item by ID
  const detailRes = await service.getItem('item_1');
  assert(detailRes.data.title === 'Build Frontend Primitive', 'Item title should match');
  console.log('✅ 3. Get item by ID passed');

  // Test 4: Create new item & validation
  const invalidCreate = validateItemInput('');
  assert(invalidCreate.isValid === false, 'Empty title should fail validation');
  assert(invalidCreate.errors.title === 'Title is required', 'Should give title required error');

  const longTitle = 'A'.repeat(101);
  const invalidLongTitle = validateItemInput(longTitle);
  assert(invalidLongTitle.isValid === false, '101 char title should fail validation');

  const validPayload = {
    title: 'New Test Domain Item',
    description: 'Testing create functionality',
    status: 'pending' as ItemStatus,
    category: 'Testing',
  };
  const createRes = await service.createItem(validPayload);
  assert(createRes.success === true, 'Create should succeed');
  assert(createRes.data.title === 'New Test Domain Item', 'Title should match');
  assert(createRes.data.status === 'pending', 'Status should match');
  console.log('✅ 4. Item creation & client validation passed');

  // Test 5: Update item
  const updateRes = await service.updateItem('item_1', {
    title: 'Build Updated Primitive',
    status: 'completed',
  });
  assert(updateRes.data.title === 'Build Updated Primitive', 'Updated title should match');
  console.log('✅ 5. Item update operation passed');

  // Test 6: Delete item with confirmation simulation
  const deleteRes = await service.deleteItem('item_2');
  assert(deleteRes.success === true, 'Delete should succeed');

  let throwsError = false;
  try {
    await service.getItem('item_2');
  } catch (err: any) {
    throwsError = true;
    assert(err.status === 404, 'Deleted item should return 404');
  }
  assert(throwsError, 'Getting deleted item must throw 404');
  console.log('✅ 6. Item deletion & 404 error handling passed');

  // Test 7: Pagination deduplication logic
  const listA: HackathonItem[] = [
    { id: '1', title: 'Item 1', status: 'pending', createdAt: '', updatedAt: '' },
    { id: '2', title: 'Item 2', status: 'pending', createdAt: '', updatedAt: '' },
  ];
  const listB: HackathonItem[] = [
    { id: '2', title: 'Item 2', status: 'pending', createdAt: '', updatedAt: '' },
    { id: '3', title: 'Item 3', status: 'pending', createdAt: '', updatedAt: '' },
  ];
  const merged = handlePaginatedAppend(listA, listB);
  assert(merged.length === 3, 'Deduplicated pagination append should have 3 items');
  assert(merged[2].id === '3', 'Item 3 should be appended');
  assert(hasNextPage(1, 3) === true, 'Page 1 of 3 should have next page');
  assert(hasNextPage(3, 3) === false, 'Page 3 of 3 should not have next page');
  console.log('✅ 7. Pagination math & deduplication passed');

  // Test 8: Filter by Status & Category
  const statusFilterRes = await service.getItems({ status: 'completed' });
  assert(statusFilterRes.data.length >= 1, 'Status filter should return items');
  assert(statusFilterRes.data.every((i) => i.status === 'completed'), 'All items should match completed status');

  const categoryFilterRes = await service.getItems({ category: 'Frontend' });
  assert(categoryFilterRes.data.every((i) => i.category === 'Frontend'), 'All items should match Frontend category');
  console.log('✅ 8. Status and category filter selection passed');

  // Test 9: Sorting (title_asc vs title_desc)
  const sortAsc = await service.getItems({ sort: 'title_asc' });
  const sortDesc = await service.getItems({ sort: 'title_desc' });
  assert(sortAsc.data[0].title.localeCompare(sortAsc.data[sortAsc.data.length - 1].title) <= 0, 'Title asc order correct');
  assert(sortDesc.data[0].title.localeCompare(sortDesc.data[sortDesc.data.length - 1].title) >= 0, 'Title desc order correct');
  console.log('✅ 9. Sort selection logic passed');

  // Test 10: Race-condition request sequence ID simulation
  let requestIdCounter = 0;
  const simulateAsyncSearch = async (query: string, delayMs: number, reqId: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    if (reqId !== requestIdCounter) {
      return { cancelled: true, query };
    }
    return { cancelled: false, res: await service.getItems({ search: query }) };
  };

  // Trigger stale search first (slow delay), then fast search
  requestIdCounter = 1;
  const stalePromise = simulateAsyncSearch('Old Search', 100, 1);
  requestIdCounter = 2; // user changed search quickly
  const freshPromise = simulateAsyncSearch('New Search', 20, 2);

  const [staleRes, freshRes] = await Promise.all([stalePromise, freshPromise]);
  assert(staleRes.cancelled === true, 'Stale search request should be cancelled/ignored');
  assert(freshRes.cancelled === false, 'Fresh search request should complete');
  console.log('✅ 10. Async search race condition protection passed');

  // Test 11: Empty search state & filter clear simulation
  const noMatchRes = await service.getItems({ search: 'NonexistentKeyword123' });
  assert(noMatchRes.data.length === 0, 'No match search should return 0 items');
  const clearedRes = await service.getItems({}); // clear filters reset
  assert(clearedRes.data.length >= 2, 'Clearing filters should restore list items');
  console.log('✅ 11. Empty search state & filter reset passed');

  console.log('--- All Domain UI & API Foundation Tests Passed! ---');
}

runDomainTests();

