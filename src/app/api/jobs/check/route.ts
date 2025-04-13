import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Check if the jobs table exists
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: 'Jobs table does not exist or is not accessible', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      exists: true,
      count: data?.length || 0,
      sample: data?.[0] || null
    });
  } catch (error) {
    console.error('Error checking jobs table:', error);
    return NextResponse.json(
      { error: 'Failed to check jobs table' },
      { status: 500 }
    );
  }
} 