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
