# Property Genie Technical Interview Guide

This project is a modern real estate property search application built with **Next.js 16**, **React 19**, and **TypeScript**. It demonstrates a production-ready architecture focusing on performance, SEO, and user experience.

Use this guide to prepare for technical discussions regarding the codebase. The topics are split into three levels of complexity.

---

## 🟢 Level 1: Fundamentals (Easy)

### **Core Technologies**
*   **Next.js 16 (App Router):** The latest framework version using the file-system based router in the `app/` directory.
*   **React 19:** Utilizes the latest React features, including robust support for Server Components.
*   **TypeScript:** Strictly typed codebase. All data models are defined in `types/property.ts` (e.g., `Property`, `PropertyFilters`) to ensure code safety and better developer experience.
*   **Styling Strategy:** A hybrid approach:
    *   **Tailwind CSS:** Used for layout, spacing, and responsive utilities (e.g., `flex`, `grid`, `p-4`).
    *   **Material UI (MUI):** Used for complex interactive components like Selects, Dialogs, Pagination, and Cards to speed up development and ensure accessibility.

### **Component Architecture**
*   **Modular Design:** UI is broken down into small, reusable components located in `components/` (e.g., `PropertyCard.tsx`, `SkeletonPropertyCard.tsx`).
*   **Props & State:** Data flows down from parent to child via props. Interactive elements (like filters) communicate changes back up via callback functions.

---

## 🟡 Level 2: Application Structure (Intermediate)

### **Next.js App Router Patterns**
*   **Route Structure:**
    *   `app/layout.tsx`: The **Root Layout**. It handles global providers (`ClientThemeProvider`) and font optimization. It persists across page navigations.
    *   `app/page.tsx`: The main **Page**. It is an `async` Server Component that fetches the initial data before sending HTML to the browser.
*   **Server vs. Client Components:**
    *   **Server Components (`app/page.tsx`):** Render on the server. They have direct access to backend resources and reduce the JavaScript bundle sent to the client. Used here for the initial data fetch.
    *   **Client Components (`'use client'`):** Components like `PropertySearchClient.tsx` and `PropertyFilters.tsx` utilize browser APIs (`window`, `localStorage`) and React hooks (`useState`, `useEffect`) for interactivity.

### **API Route Handlers (`app/api/`)**
*   **Proxy Pattern:** The application uses Next.js Route Handlers (`app/api/properties/route.ts`) to act as a proxy between the frontend and the external mock API.
    *   **Why?** It avoids CORS issues, hides potential API keys (if they existed), and allows for server-side transformation of data before it reaches the client.
*   **Dynamic Resources:** Specific endpoints for `states` and `cities` allow for dynamic population of filter dropdowns based on available data.

### **State Management**
*   **Local State:** `useState` manages UI state (loading flags, current filters, pagination).
*   **URL as State (Partial):** While internal state is used, best practice often involves syncing state to URL search params (sharable links). Currently, the app passes initial data from the server, then takes over with client-side state in `PropertySearchClient`.
*   **Context API:** Used implicitly by MUI via `ThemeProvider` to share theme data across the component tree.

---

## 🔴 Level 3: Advanced & Performance (Expert)

### **Performance Optimization**
*   **Server-Side Rendering (SSR):**
    *   The initial page load (`app/page.tsx`) fetches data on the server. This ensures the user sees content immediately (First Contentful Paint) and is critical for **SEO** (crawlers see content without executing JS).
*   **Parallel Promise Execution:**
    *   **Location:** `lib/propertyService.ts`
    *   **Technique:** `Promise.all()` is used to check the accessibility of multiple image URLs concurrently.
    *   **Benefit:** Instead of waiting for each image check sequentially (Sum of all delays), it waits only for the slowest single check (Max of one delay), drastically reducing API response time.
*   **Debouncing:**
    *   **Location:** `components/PropertyFilters.tsx` (`useDebounce` hook)
    *   **Technique:** Delays the execution of the filter update function until the user stops typing for 500ms.
    *   **Benefit:** Prevents flooding the API with a request for every single keystroke in the "Min/Max Price" inputs.
*   **Caching & Revalidation (ISR):**
    *   **Location:** `lib/propertyService.ts`
    *   **Technique:** `fetch(url, { next: { revalidate: 60 } })`
    *   **Benefit:** Caches the external API response for 60 seconds. Subsequent requests within this window are instant, reducing load on the external server and speeding up the app.
*   **Font Optimization:**
    *   **Location:** `app/layout.tsx`
    *   **Technique:** `next/font` (Geist)
    *   **Benefit:** Fonts are automatically optimized and self-hosted at build time, preventing Cumulative Layout Shift (CLS).

### **Data Engineering & Resilience**
*   **Robust Data Transformation:**
    *   The `getProperties` function in `lib/propertyService.ts` doesn't just pass data through; it normalizes it. It handles missing images by falling back to mock data and transforms raw API fields into a clean `Property` interface used by the UI.
*   **Hybrid Filtering Logic:**
    *   The app implements a **Fallback Filtering Strategy**. It attempts to send filters to the API, but also re-applies filters in memory (JavaScript) on the returned data. This ensures 100% accuracy even if the mock API has limitations or partial support for complex queries.

### **Client-Side Persistence**
*   **Location:** `lib/savedSearches.ts`
*   **Technique:** Uses `localStorage` to save user search preferences.
*   **Implementation:** A service layer wraps `localStorage` interactions, handling JSON parsing/stringifying and error handling, keeping the React components clean.
