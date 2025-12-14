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
│   ├── api/               # API routes
│   │   ├── cities/       # Cities API
│   │   ├── properties/   # Properties API
│   │   └── states/       # States API
│   ├── page.tsx           # Main property search page
│   ├── layout.tsx         # Root layout with MUI theme
│   ├── globals.css        # Global styles
│   └── theme.ts           # MUI theme configuration
├── components/            # React components
│   ├── PropertyCard.tsx   # Individual property display
│   ├── PropertyFilters.tsx # Search filters component
│   ├── PropertySearchClient.tsx # Client-side search logic
│   ├── SavedSearches.tsx  # Saved searches component
│   └── ThemeProvider.tsx  # MUI Theme provider wrapper
├── lib/                   # Utility functions
│   ├── mockData.ts       # Mock data for development
│   ├── propertyService.ts # Service to fetch properties
│   └── savedSearches.ts   # Local storage management for searches
├── types/                 # TypeScript type definitions
│   └── property.ts       # Property-related types
└── public/               # Static assets
```

## Features

### Property Search and Filtering
- **Filtering**: Users can filter properties by:
  - Minimum and Maximum Price
  - Property Types (e.g., Condominium, Terrace, Bungalow)
  - Location (State and City)
- **Sorting**: Properties can be sorted by price (low-high, high-low) and date added.

### Saved Searches
- Users can save their current search criteria (filters and sort preference) for future use.
- Saved searches are stored locally and can be easily accessed or deleted.

## Important Note

**Mock Data Usage**:
Most of the property images returned by the external API are currently forbidden or inaccessible. To ensure a consistent user interface during development, the application uses dummy images provided in `lib/mockData.ts`. This allows for proper visualization of the property cards even when the real image URLs are not working.
