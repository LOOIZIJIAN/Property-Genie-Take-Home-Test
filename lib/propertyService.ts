import { PropertySearchParams, Property, ApiProperty } from '@/types/property';
import { mockPropertiesImages } from '@/lib/mockData';

const API_BASE_URL = 'https://agents.propertygenie.com.my/.netlify/functions/properties-mock';

// Helper function to check if image URL is accessible
async function isImageAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
}

// Get a random mock image
function getRandomMockImage(index: number): string {
  return mockPropertiesImages[index % mockPropertiesImages.length];
}

export async function getProperties(params: PropertySearchParams): Promise<{
  data: Property[];
  total: number;
  page: number;
  totalPages: number;
}> {
  // Build query string
  const searchParams = new URLSearchParams();

  // For client-side filtering, we need to fetch more data
  // If filters are applied, fetch a larger batch to ensure we have enough results
  const hasFilters = params.filters && Object.keys(params.filters).length > 0;
  const fetchLimit = hasFilters ? 1000 : (params.limit || 20);
  const page = hasFilters ? 1 : (params.page || 1);
  
  searchParams.append('page', page.toString());
  searchParams.append('limit', fetchLimit.toString());

  // Map sort options to API format
  if (params.sort) {
    let sortValue = '';
    switch (params.sort) {
      case 'price_asc':
        sortValue = 'price';
        break;
      case 'price_desc':
        sortValue = '-price';
        break;
      case 'created_at':
      default:
        sortValue = '-createdAt'; // Default to newest first
        break;
    }
    if (sortValue) {
      searchParams.append('sort', sortValue);
    }
  }

  // Build request body for the external API
  interface ApiRequestBody {
    minPrice?: number;
    maxPrice?: number;
    propertyTypes?: string[];
    state?: string;
    city?: string;
    bathRooms?: number[];
    [key: string]: unknown;
  }

  const requestBody: ApiRequestBody = {};

  if (params.filters) {
    if (params.filters.minPrice) {
      requestBody.minPrice = params.filters.minPrice;
    }
    if (params.filters.maxPrice) {
      requestBody.maxPrice = params.filters.maxPrice;
    }
    if (params.filters.propertyTypes?.length) {
      requestBody.propertyTypes = params.filters.propertyTypes;
    }
    if (params.filters.state) {
      requestBody.state = params.filters.state;
    }
    if (params.filters.city) {
      requestBody.city = params.filters.city;
    }
  }

  const url = `${API_BASE_URL}?${searchParams.toString()}`;

  // Debug logging
  console.log('API Request:', {
    url,
    body: requestBody,
    filters: params.filters
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    // Revalidate every 60 seconds
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const apiResponse = await response.json();
  const items = apiResponse.items || [];

  // Debug logging
  console.log('API Response:', {
    totalItems: items.length,
    totalCount: apiResponse._meta?.totalCount,
    sampleItems: items.slice(0, 3).map((item: ApiProperty) => ({
      id: item.id,
      name: item.name,
      state: item.state,
      city: item.city,
      type: item.type
    })),
    uniquePropertyTypes: [...new Set(items.map((item: ApiProperty) => item.type))]
  });

  // Check all images in parallel for better performance
  const imageChecks = await Promise.all(
    items.map((item: ApiProperty, index: number) => {
      const imageUrl = item.image || '';
      if (imageUrl) {
        return isImageAccessible(imageUrl).then(isAccessible => ({
          index,
          imageUrl: isAccessible ? imageUrl : getRandomMockImage(index),
        }));
      }
      return Promise.resolve({
        index,
        imageUrl: getRandomMockImage(index),
      });
    })
  );

  // Create a map of index to final image URL
  const imageMap = new Map<number, string>();
  imageChecks.forEach(({ index, imageUrl }) => {
    imageMap.set(index, imageUrl);
  });

  // Transform API response items to Property format
  const transformProperty = (apiProp: ApiProperty, index: number): Property => {
    return {
      id: apiProp.id,
      title: apiProp.name,
      price: apiProp.price,
      property_type: apiProp.type,
      bedrooms: apiProp.bedRooms,
      bathrooms: apiProp.bathRooms,
      size: parseFloat(apiProp.floorSize) || 0,
      location: {
        city: apiProp.city,
        state: apiProp.state,
        address: apiProp.address,
      },
      images: imageMap.get(index) ? [imageMap.get(index)!] : [],
      created_at: apiProp.createdAt,
    };
  };

  // Transform API response to match expected format
  let transformedProperties = items.map((item: ApiProperty, index: number) =>
    transformProperty(item, index)
  );

  // Apply client-side filtering as fallback if API doesn't filter properly
  if (params.filters) {
    transformedProperties = transformedProperties.filter((property: Property) => {
      // State filter
      if (params.filters!.state && property.location.state !== params.filters!.state) {
        return false;
      }
      
      // City filter
      if (params.filters!.city && property.location.city !== params.filters!.city) {
        return false;
      }
      
      // Price filters
      if (params.filters!.minPrice && property.price < params.filters!.minPrice) {
        return false;
      }
      
      if (params.filters!.maxPrice && property.price > params.filters!.maxPrice) {
        return false;
      }
      
      // Property type filter with case-insensitive matching
      if (params.filters!.propertyTypes?.length) {
        const propertyTypeMatch = params.filters!.propertyTypes.some(filterType => 
          property.property_type.toLowerCase() === filterType.toLowerCase() ||
          property.property_type.toLowerCase().includes(filterType.toLowerCase()) ||
          filterType.toLowerCase().includes(property.property_type.toLowerCase())
        );
        if (!propertyTypeMatch) {
          return false;
        }
      }
      
      return true;
    });
  }

  console.log('After client-side filtering:', {
    originalCount: items.length,
    filteredCount: transformedProperties.length,
    appliedFilters: params.filters
  });

  // Update pagination info based on filtered results
  const filteredTotal = transformedProperties.length;
  const pageSize = params.limit || 20;
  const currentPage = params.page || 1;
  const totalPages = Math.ceil(filteredTotal / pageSize);
  
  // Apply pagination to filtered results
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProperties = transformedProperties.slice(startIndex, endIndex);

  return {
    data: paginatedProperties,
    total: filteredTotal,
    page: currentPage,
    totalPages: totalPages,
  };
}
