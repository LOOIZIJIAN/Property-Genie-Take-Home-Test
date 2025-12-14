# Property Search Application

A modern property listing search application built with Next.js, featuring advanced filtering, sorting, and responsive design.

## Features

### Core Features
- **Property Search & Listing**: Browse properties with detailed information
- **Advanced Filtering**: Filter by price range, property types, and location
- **Sorting Options**: Sort by date (newest first), price (low to high, high to low)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Pagination**: Navigate through property listings efficiently

### Search & Filtering
- Price range filtering (min/max)
- Multiple property type selection (Condominium, Apartment, Terrace, etc.)
- Location filtering by state and city
- Real-time filter application

### Property Display
- Property cards with key information (price, bedrooms, bathrooms, size)
- Property images and descriptions
- Location details
- Property type badges

## Technology Stack

- **Frontend**: Next.js 16 with App Router
- **UI Library**: Material-UI (MUI)
- **Styling**: Tailwind CSS + MUI components
- **TypeScript**: Full type safety
- **State Management**: React hooks

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pgtht
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
pgtht/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main property search page
│   ├── layout.tsx         # Root layout with MUI theme
│   ├── globals.css        # Global styles
│   └── theme.ts           # MUI theme configuration
├── components/            # React components
│   ├── PropertyCard.tsx   # Individual property display
│   └── PropertyFilters.tsx # Search filters component
├── lib/                   # Utility functions
│   ├── api.ts            # API functions with mock data
│   └── mockData.ts       # Mock data for development
├── types/                 # TypeScript type definitions
│   └── property.ts       # Property-related types
└── public/               # Static assets
```

## API Integration

The application is designed to work with the Property Genie API. Currently, it uses mock data for development purposes.

### API Endpoints
- `GET /api/v1/properties` - Fetch properties with filters
- `GET /api/v1/states` - Fetch available states
- `GET /api/v1/cities` - Fetch cities by state

### Switching to Real API

To use the real API, update `lib/api.ts`:
```typescript
const USE_MOCK_DATA = false; // Change to false
```

## Features Implementation

### Filtering System
- Price range filtering with min/max inputs
- Multi-select property types with chips display
- Cascading location filters (state → city)
- Real-time filter application

### Sorting Options
- Default: Newest properties first (by created_at)
- Price: Low to High
- Price: High to Low

### Responsive Design
- Mobile-first approach
- Responsive grid layout (1-4 columns based on screen size)
- Touch-friendly interface
- Optimized for various screen sizes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Consistent component structure
- Responsive design patterns

## Deployment

The application can be deployed on various platforms:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Other Platforms
- Netlify
- AWS Amplify
- Railway
- Any platform supporting Next.js

## Future Enhancements

### Bonus Features (Planned)
- **Advanced Search**: Search by location with autocomplete
- **Save Filters**: Save and manage search preferences
- **Property Details**: Detailed property view pages
- **Favorites**: Save favorite properties
- **Map Integration**: Property locations on map
- **Virtual Tours**: 360° property views

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
