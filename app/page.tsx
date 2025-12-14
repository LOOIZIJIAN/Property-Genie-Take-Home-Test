'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Property, PropertyFilters, SortOption } from '@/types/property';
import { fetchProperties } from '@/app/api/properties';
import PropertyCard from '@/components/PropertyCard';
import PropertyFiltersComponent from '@/components/PropertyFilters';

const SORT_OPTIONS: SortOption[] = [
  { value: 'created_at', label: 'Default (Newest First)' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function PropertySearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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

      console.log('Fetched properties:', response.data);

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
    loadProperties();
  }, [loadProperties]);

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (event: { target: { value: string } }) => {
    setSortBy(event.target.value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h3" component="h1" className="mb-6 font-bold">
        Property Search
      </Typography>
      
      <PropertyFiltersComponent 
        filters={filters} 
        onFiltersChange={handleFiltersChange} 
      />
      
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="body1" className="text-gray-600">
          {loading ? 'Loading...' : `${total} properties found`}
        </Typography>
        
        <FormControl size="small" className="min-w-48">
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
      
      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box className="flex justify-center py-12">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {properties.map((property) => (
              <Box key={property.id}>
                <PropertyCard property={property} />
              </Box>
            ))}
          </Box>
          
          {properties.length === 0 && !loading && (
            <Box className="text-center py-12">
              <Typography variant="h6" className="text-gray-500">
                No properties found matching your criteria.
              </Typography>
            </Box>
          )}
          
          {totalPages > 1 && (
            <Box className="flex justify-center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
