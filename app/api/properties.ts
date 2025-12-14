import { Property, PropertySearchParams } from '@/types/property';

export async function fetchProperties(params: PropertySearchParams = {}): Promise<{
  data: Property[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ params }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  
  return response.json();
}

export async function fetchStates(): Promise<string[]> {
  const response = await fetch('/api/states');
  
  if (!response.ok) {
    throw new Error('Failed to fetch states');
  }
  
  return response.json();
}

export async function fetchCities(state: string): Promise<string[]> {
  const response = await fetch(`/api/cities?state=${encodeURIComponent(state)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }
  
  return response.json();
}

