import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  employment_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!jobs) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active jobs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 