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

  const page = params.page || 1;
  searchParams.append('page', page.toString());

  if (params.limit) {
    searchParams.append('limit', params.limit.toString());
  }

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
  const transformedProperties = items.map((item: ApiProperty, index: number) =>
    transformProperty(item, index)
  );

  return {
    data: transformedProperties,
    total: apiResponse._meta?.totalCount || 0,
    page: apiResponse._meta?.currentPage || 1,
    totalPages: apiResponse._meta?.pageCount || 1,
  };
}
