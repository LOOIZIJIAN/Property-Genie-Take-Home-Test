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

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onFiltersChange({
      ...filters,
      [field]: numValue,
    });
  };

  const handlePropertyTypesChange = (event: any) => {
    const value = event.target.value;
    onFiltersChange({
      ...filters,
      propertyTypes: typeof value === 'string' ? value.split(',') : value,
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
    <Paper className="p-4 mb-6">
      <Typography variant="h6" className="mb-4">Filters</Typography>
      
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TextField
          label="Min Price (RM)"
          type="number"
          value={filters.minPrice || ''}
          onChange={(e) => handlePriceChange('minPrice', e.target.value)}
          size="small"
        />
        
        <TextField
          label="Max Price (RM)"
          type="number"
          value={filters.maxPrice || ''}
          onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
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