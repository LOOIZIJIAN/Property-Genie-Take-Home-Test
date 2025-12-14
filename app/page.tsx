import { getProperties } from '@/lib/propertyService';
import PropertySearchClient from '@/components/PropertySearchClient';

export default async function PropertySearchPage() {
  // Fetch initial data on the server
  const initialData = await getProperties({
    page: 1,
    limit: 12,
    sort: 'created_at',
  });

  return (
    <PropertySearchClient
      initialProperties={initialData.data}
      initialTotal={initialData.total}
      initialTotalPages={initialData.totalPages}
    />
  );
}
