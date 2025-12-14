import { NextResponse } from 'next/server';
import { ApiProperty } from '@/types/property';

const API_BASE_URL = 'https://agents.propertygenie.com.my/.netlify/functions/properties-mock';

export async function GET() {
  try {
    // Fetch properties to extract unique states
    // Fetch a large batch to get all states
    const response = await fetch(`${API_BASE_URL}?page=1&limit=1000`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    const apiResponse = await response.json();
    const items = apiResponse.items || [];
    
    // Extract unique states
    const statesSet = new Set<string>();
    items.forEach((item: ApiProperty) => {
      if (item.state) {
        statesSet.add(item.state);
      }
    });
    
    const states = Array.from(statesSet).sort();
    
    return NextResponse.json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json(
      { error: 'Failed to fetch states' },
      { status: 500 }
    );
  }
}

