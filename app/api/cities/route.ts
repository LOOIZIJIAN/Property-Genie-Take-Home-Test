import { NextRequest, NextResponse } from 'next/server';
import { ApiProperty } from '@/types/property';

const API_BASE_URL = 'https://agents.propertygenie.com.my/.netlify/functions/properties-mock';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');
    
    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }
    
    // Fetch properties filtered by state to extract unique cities
    const response = await fetch(`${API_BASE_URL}?page=1&limit=1000`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state: state,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    const apiResponse = await response.json();
    const items = apiResponse.items || [];
    
    // Extract unique cities for the given state
    const citiesSet = new Set<string>();
    items.forEach((item: ApiProperty) => {
      if (item.city && item.state === state) {
        citiesSet.add(item.city);
      }
    });
    
    const cities = Array.from(citiesSet).sort();
    
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

