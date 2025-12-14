// API Response Property (raw from API)
export interface ApiProperty {
  id: string;
  name: string;
  slug: string;
  type: string;
  category: string;
  section: string;
  image: string;
  bedRooms: number;
  bathRooms: number;
  floorSize: string;
  landSize: string | null;
  address: string;
  price: number;
  account: {
    id: string;
    name: string;
    email: string;
    phone: string;
    slug: string;
  };
  country: string;
  state: string;
  city: string;
  postcode: string;
  furnishings: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  createdAt: string;
}

// Internal Property (transformed for UI)
export interface Property {
  id: string;
  title: string;
  price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  location: {
    city: string;
    state: string;
    address: string;
  };
  images: string[];
  created_at: string;
  description?: string;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  propertyTypes?: string[];
  state?: string;
  city?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface PropertySearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  filters?: PropertyFilters;
}