'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Button,
  SelectChangeEvent,
  Paper,
  Typography,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save, BookmarkBorder } from '@mui/icons-material';
import { PropertyFilters } from '@/types/property';
import { fetchStates, fetchCities } from '@/app/api/properties';
import { saveSearch } from '@/lib/savedSearches';

interface PropertyFiltersProps {
  filters: PropertyFilters;
  sort?: string;
  onFiltersChange: (filters: PropertyFilters) => void;
  onSaveSearch?: () => void;
}

const PROPERTY_TYPES = [
  'Condominium',
  'Apartment',
  'Terrace',
  'Semi-Detached',
  'Bungalow',
  'Townhouse',
];

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function PropertyFiltersComponent({ 
  filters, 
  sort,
  onFiltersChange,
  onSaveSearch,
}: PropertyFiltersProps) {
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  // Local state for debouncing price inputs
  const [minPriceInput, setMinPriceInput] = useState<string>(filters.minPrice?.toString() || '');
  const [maxPriceInput, setMaxPriceInput] = useState<string>(filters.maxPrice?.toString() || '');

  const debouncedMinPrice = useDebounce(minPriceInput, 500);
  const debouncedMaxPrice = useDebounce(maxPriceInput, 500);

  // Sync inputs with filters when filters change externally (e.g. clear filters)
  useEffect(() => {
    if (filters.minPrice?.toString() !== minPriceInput && filters.minPrice !== undefined) {
        setMinPriceInput(filters.minPrice.toString());
    } else if (filters.minPrice === undefined && minPriceInput !== '') {
        setMinPriceInput('');
    }

    if (filters.maxPrice?.toString() !== maxPriceInput && filters.maxPrice !== undefined) {
        setMaxPriceInput(filters.maxPrice.toString());
    } else if (filters.maxPrice === undefined && maxPriceInput !== '') {
        setMaxPriceInput('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Apply debounced price changes
  useEffect(() => {
    const min = debouncedMinPrice ? parseInt(debouncedMinPrice) : undefined;
    const max = debouncedMaxPrice ? parseInt(debouncedMaxPrice) : undefined;

    if (min !== filters.minPrice || max !== filters.maxPrice) {
        // Avoid loop if values match
        if ((min === filters.minPrice && max === filters.maxPrice) ||
            (isNaN(Number(debouncedMinPrice)) && debouncedMinPrice !== '') ||
            (isNaN(Number(debouncedMaxPrice)) && debouncedMaxPrice !== '')) {
            return;
        }

        onFiltersChange({
            ...filters,
            minPrice: min,
            maxPrice: max,
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMinPrice, debouncedMaxPrice]);


  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const statesData = await fetchStates();
        setStates(statesData);
      } catch (error) {
        console.error('Failed to load states:', error);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    if (filters.state) {
      const loadCities = async () => {
        setLoadingCities(true);
        try {
          const citiesData = await fetchCities(filters.state!);
          setCities(citiesData);
        } catch (error) {
          console.error('Failed to load cities:', error);
        } finally {
          setLoadingCities(false);
        }
      };
      loadCities();
    } else {
      setCities([]);
    }
  }, [filters.state]);

  const handlePriceInputChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    if (field === 'minPrice') {
        setMinPriceInput(value);
    } else {
        setMaxPriceInput(value);
    }
  };

  const handlePropertyTypesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFiltersChange({
      ...filters,
      propertyTypes: typeof value === 'string' ? value.split(',') : value as string[],
    });
  };

  const handleStateChange = (value: string | null) => {
    onFiltersChange({
      ...filters,
      state: value || undefined,
      city: undefined, // Reset city when state changes
    });
  };

  const handleCityChange = (value: string | null) => {
    onFiltersChange({
      ...filters,
      city: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setMinPriceInput('');
    setMaxPriceInput('');
  };

  const handleSaveSearch = () => {
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (searchName.trim()) {
      saveSearch(searchName.trim(), filters, sort);
      setSearchName('');
      setSaveDialogOpen(false);
      if (onSaveSearch) {
        onSaveSearch();
      }
    }
  };

  const hasActiveFilters = () => {
    return !!(
      filters.minPrice ||
      filters.maxPrice ||
      filters.propertyTypes?.length ||
      filters.state ||
      filters.city
    );
  };

  return (
    <Paper className="p-4 mb-6 shadow-none md:shadow-sm">
      <Typography variant="h6" className="mb-4">Filters</Typography>
      
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TextField
          label="Min Price (RM)"
          type="number"
          value={minPriceInput}
          onChange={(e) => handlePriceInputChange('minPrice', e.target.value)}
          size="small"
        />
        
        <TextField
          label="Max Price (RM)"
          type="number"
          value={maxPriceInput}
          onChange={(e) => handlePriceInputChange('maxPrice', e.target.value)}
          size="small"
        />
        
        <FormControl size="small">
          <InputLabel>Property Types</InputLabel>
          <Select
            multiple
            value={filters.propertyTypes || []}
            onChange={handlePropertyTypesChange}
            input={<OutlinedInput label="Property Types" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {PROPERTY_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Autocomplete
          options={states}
          value={filters.state || null}
          onChange={(_, value) => handleStateChange(value)}
          loading={loadingStates}
          renderInput={(params) => (
            <TextField {...params} label="State" size="small" />
          )}
        />
        
        <Autocomplete
          options={cities}
          value={filters.city || null}
          onChange={(_, value) => handleCityChange(value)}
          loading={loadingCities}
          disabled={!filters.state}
          renderInput={(params) => (
            <TextField {...params} label="City" size="small" />
          )}
        />
        
        <Button 
          variant="outlined" 
          onClick={clearFilters}
          className="h-10"
        >
          Clear Filters
        </Button>
        
        <Button 
          variant="contained" 
          onClick={handleSaveSearch}
          className="h-10"
          disabled={!hasActiveFilters()}
          startIcon={<Save />}
        >
          Save Search
        </Button>
      </Box>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Search</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Name"
            fullWidth
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="e.g., Condos in KL under 1M"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleConfirmSave();
              }
            }}
          />
          <Typography variant="body2" className="text-gray-500 mt-2">
            Save your current filters and sort preferences for quick access later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmSave} 
            variant="contained" 
            disabled={!searchName.trim()}
            startIcon={<BookmarkBorder />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
