import { SavedSearch, PropertyFilters } from '@/types/property';

const STORAGE_KEY = 'propertygenie_saved_searches';

export function getSavedSearches(): SavedSearch[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as SavedSearch[];
  } catch (error) {
    console.error('Error loading saved searches:', error);
    return [];
  }
}

export function saveSearch(
  name: string,
  filters: PropertyFilters,
  sort?: string
): SavedSearch {
  const searches = getSavedSearches();
  const newSearch: SavedSearch = {
    id: Date.now().toString(),
    name,
    filters,
    sort,
    createdAt: new Date().toISOString(),
  };
  
  searches.unshift(newSearch); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  return newSearch;
}

export function deleteSavedSearch(id: string): void {
  const searches = getSavedSearches();
  const filtered = searches.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateSavedSearch(
  id: string,
  name: string,
  filters: PropertyFilters,
  sort?: string
): void {
  const searches = getSavedSearches();
  const index = searches.findIndex((s) => s.id === id);
  if (index !== -1) {
    searches[index] = {
      ...searches[index],
      name,
      filters,
      sort,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  }
}

