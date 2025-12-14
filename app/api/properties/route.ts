import { NextRequest, NextResponse } from 'next/server';
import { PropertySearchParams } from '@/types/property';
import { getProperties } from '@/lib/propertyService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { params } = body as { params: PropertySearchParams };
    
    const result = await getProperties(params);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
