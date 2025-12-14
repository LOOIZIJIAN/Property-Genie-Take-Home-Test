'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
} from '@mui/material';
import {
  Bookmark,
  Delete,
  Edit,
  PlayArrow,
} from '@mui/icons-material';
import { SavedSearch, PropertyFilters } from '@/types/property';
import {
  getSavedSearches,
  deleteSavedSearch,
  updateSavedSearch,
} from '@/lib/savedSearches';

interface SavedSearchesProps {
  onApplySearch: (filters: PropertyFilters, sort?: string) => void;
  currentFilters?: PropertyFilters;
  currentSort?: string;
}

export default function SavedSearchesComponent({
  onApplySearch,
}: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  const [editName, setEditName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only access localStorage after component mounts on client
    setMounted(true);
    const searches = getSavedSearches();
    setSavedSearches(searches);
  }, []);

  const loadSavedSearches = () => {
    setSavedSearches(getSavedSearches());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this saved search?')) {
      deleteSavedSearch(id);
      loadSavedSearches();
    }
  };

  const handleEdit = (search: SavedSearch) => {
    setEditingSearch(search);
    setEditName(search.name);
    setOpenDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingSearch && editName.trim()) {
      updateSavedSearch(
        editingSearch.id,
        editName.trim(),
        editingSearch.filters,
        editingSearch.sort
      );
      loadSavedSearches();
      setOpenDialog(false);
      setEditingSearch(null);
      setEditName('');
    }
  };

  const handleApply = (search: SavedSearch) => {
    onApplySearch(search.filters, search.sort);
  };

  const formatFilters = (filters: PropertyFilters): string => {
    const parts: string[] = [];
    if (filters.minPrice) parts.push(`Min: RM ${filters.minPrice.toLocaleString()}`);
    if (filters.maxPrice) parts.push(`Max: RM ${filters.maxPrice.toLocaleString()}`);
    if (filters.propertyTypes?.length) {
      parts.push(`Types: ${filters.propertyTypes.join(', ')}`);
    }
    if (filters.state) parts.push(`State: ${filters.state}`);
    if (filters.city) parts.push(`City: ${filters.city}`);
    return parts.length > 0 ? parts.join(' • ') : 'No filters';
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || savedSearches.length === 0) {
    return null;
  }

  return (
    <>
      <Paper className="p-4 mb-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="flex items-center gap-2">
            <Bookmark fontSize="small" />
            Saved Searches
          </Typography>
        </Box>
        
        <List>
          {savedSearches.map((search, index) => (
            <Box key={search.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box className="flex items-center gap-2">
                      <Typography variant="subtitle1" className="font-semibold">
                        {search.name}
                      </Typography>
                      {search.sort && (
                        <Chip
                          label={search.sort === 'price_asc' ? 'Price: Low to High' : 
                                 search.sort === 'price_desc' ? 'Price: High to Low' : 
                                 'Newest First'}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" className="text-gray-600 mt-1">
                      {formatFilters(search.filters)}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Box className="flex items-center gap-1">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleApply(search)}
                      title="Apply search"
                      color="primary"
                    >
                      <PlayArrow fontSize="small" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleEdit(search)}
                      title="Edit name"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleDelete(search.id)}
                      title="Delete"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              {index < savedSearches.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Saved Search</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Name"
            fullWidth
            variant="outlined"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveEdit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" disabled={!editName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
