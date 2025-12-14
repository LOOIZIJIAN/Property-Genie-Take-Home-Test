import { Property } from '@/types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Condominium in KLCC',
    price: 850000,
    property_type: 'Condominium',
    bedrooms: 3,
    bathrooms: 2,
    size: 1200,
    location: {
      city: 'Kuala Lumpur',
      state: 'Kuala Lumpur',
      address: 'Jalan Ampang, KLCC'
    },
    images: ['/placeholder-property.jpg'],
    created_at: '2024-01-15T10:00:00Z',
    description: 'Luxurious condominium with city view'
  },
  {
    id: '2',
    title: 'Spacious Terrace House in Petaling Jaya',
    price: 650000,
    property_type: 'Terrace',
    bedrooms: 4,
    bathrooms: 3,
    size: 1800,
    location: {
      city: 'Petaling Jaya',
      state: 'Selangor',
      address: 'SS2, Petaling Jaya'
    },
    images: ['/placeholder-property.jpg'],
    created_at: '2024-01-14T09:30:00Z',
    description: 'Family-friendly terrace house'
  },
  {
    id: '3',
    title: 'Luxury Bungalow in Shah Alam',
    price: 1200000,
    property_type: 'Bungalow',
    bedrooms: 5,
    bathrooms: 4,
    size: 2500,
    location: {
      city: 'Shah Alam',
      state: 'Selangor',
      address: 'Section 7, Shah Alam'
    },
    images: ['/placeholder-property.jpg'],
    created_at: '2024-01-13T14:20:00Z',
    description: 'Spacious bungalow with garden'
  },
  {
    id: '4',
    title: 'Cozy Apartment in Georgetown',
    price: 450000,
    property_type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    size: 900,
    location: {
      city: 'Georgetown',
      state: 'Penang',
      address: 'Lebuh Armenian, Georgetown'
    },
    images: ['/placeholder-property.jpg'],
    created_at: '2024-01-12T11:15:00Z',
    description: 'Heritage area apartment'
  },
  {
    id: '5',
    title: 'Semi-Detached House in Johor Bahru',
    price: 580000,
    property_type: 'Semi-Detached',
    bedrooms: 4,
    bathrooms: 3,
    size: 1600,
    location: {
      city: 'Johor Bahru',
      state: 'Johor',
      address: 'Taman Molek, Johor Bahru'
    },
    images: ['/placeholder-property.jpg'],
    created_at: '2024-01-11T16:45:00Z',
    description: 'Well-maintained semi-detached house'
  },
  {
    id: '6',
    title: 'Townhouse in Cyberjaya',
    price: 720000,
    property_type: 'Townhouse',
    bedrooms: 3,
    bathrooms: 3,
    size: 1400,
    location: {
      city: 'Cyberjaya',
      state: 'Selangor',
      address: 'Presint 9, Cyberjaya'
    },
    images: ['/placeholder-property.jpg'],
    created_at: '2024-01-10T08:30:00Z',
    description: 'Modern townhouse in tech hub'
  }
];

export const mockStates = [
  'Kuala Lumpur',
  'Selangor',
  'Penang',
  'Johor',
  'Perak',
  'Kedah',
  'Kelantan',
  'Terengganu',
  'Pahang',
  'Negeri Sembilan',
  'Melaka',
  'Sabah',
  'Sarawak'
];

export const mockCities: Record<string, string[]> = {
  'Kuala Lumpur': ['Kuala Lumpur'],
  'Selangor': ['Petaling Jaya', 'Shah Alam', 'Subang Jaya', 'Cyberjaya', 'Klang'],
  'Penang': ['Georgetown', 'Butterworth', 'Bayan Lepas'],
  'Johor': ['Johor Bahru', 'Skudai', 'Iskandar Puteri'],
  'Perak': ['Ipoh', 'Taiping', 'Teluk Intan'],
  'Kedah': ['Alor Setar', 'Sungai Petani', 'Kulim'],
  'Kelantan': ['Kota Bharu', 'Tanah Merah'],
  'Terengganu': ['Kuala Terengganu', 'Kemaman'],
  'Pahang': ['Kuantan', 'Temerloh', 'Bentong'],
  'Negeri Sembilan': ['Seremban', 'Port Dickson'],
  'Melaka': ['Melaka City', 'Jasin'],
  'Sabah': ['Kota Kinabalu', 'Sandakan', 'Tawau'],
  'Sarawak': ['Kuching', 'Miri', 'Sibu']
};

export const mockPropertiesImages = [
  "https://loremflickr.com/640/480/house?lock=1",
  "https://loremflickr.com/640/480/apartment?lock=2",
  "https://loremflickr.com/640/480/house?lock=3",
  "https://loremflickr.com/640/480/mansion?lock=4",
  "https://loremflickr.com/640/480/house?lock=5",
  "https://loremflickr.com/640/480/apartment?lock=6",
  "https://loremflickr.com/640/480/house?lock=7",
  "https://loremflickr.com/640/480/villa?lock=8",
  "https://loremflickr.com/640/480/house?lock=9",
  "https://loremflickr.com/640/480/apartment?lock=10",
  "https://loremflickr.com/640/480/house?lock=11",
  "https://loremflickr.com/640/480/condo?lock=12",
  "https://loremflickr.com/640/480/house?lock=13",
  "https://loremflickr.com/640/480/apartment?lock=14",
  "https://loremflickr.com/640/480/house?lock=15",
  "https://loremflickr.com/640/480/luxury?lock=16",
  "https://loremflickr.com/640/480/house?lock=17",
  "https://loremflickr.com/640/480/apartment?lock=18",
  "https://loremflickr.com/640/480/house?lock=19",
  "https://loremflickr.com/640/480/loft?lock=20"
]