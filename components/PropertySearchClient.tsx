'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Fab,
  Drawer,
  Button,
} from '@mui/material';
import { ViewList, ViewModule, FilterList } from '@mui/icons-material';
import { Property, PropertyFilters, SortOption } from '@/types/property';
import { fetchProperties } from '@/app/api/properties';
import PropertyCard from '@/components/PropertyCard';
import SkeletonPropertyCard from '@/components/SkeletonPropertyCard';
import PropertyFiltersComponent from '@/components/PropertyFilters';
import SavedSearchesComponent from '@/components/SavedSearches';

const SORT_OPTIONS: SortOption[] = [
  { value: 'created_at', label: 'Default (Newest First)' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

interface PropertySearchClientProps {
  initialProperties: Property[];
  initialTotal: number;
  initialTotalPages: number;
}

export default function PropertySearchClient({
  initialProperties,
  initialTotal,
  initialTotalPages,
}: PropertySearchClientProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [refreshSavedSearches, setRefreshSavedSearches] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchProperties({
        page: currentPage,
        limit: 12,
        sort: sortBy,
        filters,
      });

      setProperties(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, filters]);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, filters]);

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  const handleSortChange = (event: { target: { value: string } }) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplySavedSearch = (savedFilters: PropertyFilters, savedSort?: string) => {
    setFilters(savedFilters);
    if (savedSort) {
      setSortBy(savedSort);
    }
    setCurrentPage(1);
  };

  const handleSaveSearch = () => {
    setRefreshSavedSearches((prev) => prev + 1);
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'grid' | 'list' | null,
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const filtersContent = (
    <PropertyFiltersComponent
      filters={filters}
      sort={sortBy}
      onFiltersChange={handleFiltersChange}
      onSaveSearch={handleSaveSearch}
    />
  );

  return (
    <Container maxWidth="xl" className="py-8 relative">
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Typography variant="h3" component="h1" className="font-bold">
          Property Search
        </Typography>

        {/* Mobile Filter Toggle */}
        <Box className="md:hidden">
            <Fab
                color="primary"
                aria-label="filter"
                onClick={() => setMobileFiltersOpen(true)}
                size="medium"
                className="fixed bottom-6 right-6 z-50"
            >
                <FilterList />
            </Fab>
        </Box>
      </Box>

      {/* Saved Searches */}
      <SavedSearchesComponent
        onApplySearch={handleApplySavedSearch}
        key={refreshSavedSearches}
      />

      {/* Desktop Filters */}
      <Box className="hidden md:block sticky top-0 z-10 bg-white/95 backdrop-blur pt-4 pb-2 -mx-4 px-4 shadow-sm mb-6 rounded-b-lg transition-all">
        {filtersContent}
      </Box>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
            sx: {
                maxHeight: '90vh',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 2
            }
        }}
      >
        <Box className="mb-4 flex justify-between items-center">
            <Typography variant="h6">Filters</Typography>
            <Button onClick={() => setMobileFiltersOpen(false)}>Close</Button>
        </Box>
        {filtersContent}
      </Drawer>

      {/* Controls Bar */}
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-gray-50 p-4 rounded-lg">
        <Typography variant="body1" className="text-gray-600 font-medium">
          {loading ? 'Updating...' : `${total} properties found`}
        </Typography>

        <Box className="flex items-center gap-4 w-full sm:w-auto">
            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                size="small"
            >
                <ToggleButton value="grid" aria-label="grid view">
                    <ViewModule />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                    <ViewList />
                </ToggleButton>
            </ToggleButtonGroup>

            <FormControl size="small" className="min-w-48 bg-white">
            <InputLabel>Sort By</InputLabel>
            <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
            >
                {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {loading ? (
        <Box className={`grid gap-6 mb-8 ${
            viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1'
          }`}>
          {[...Array(8)].map((_, i) => (
             <Box key={i}>
                <SkeletonPropertyCard viewMode={viewMode} />
             </Box>
          ))}
        </Box>
      ) : (
        <>
          <Box className={`grid gap-6 mb-8 ${
            viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1'
          }`}>
            {properties.map((property) => (
              <Box key={property.id}>
                <PropertyCard property={property} viewMode={viewMode} />
              </Box>
            ))}
          </Box>

          {properties.length === 0 && (
            <Box className="text-center py-12 bg-gray-50 rounded-lg">
              <Typography variant="h6" className="text-gray-500">
                No properties found matching your criteria.
              </Typography>
              <Button
                variant="outlined"
                className="mt-4"
                onClick={() => handleFiltersChange({})}
              >
                Clear all filters
              </Button>
            </Box>
          )}

          {totalPages > 1 && (
            <Box className="flex justify-center pb-8">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
