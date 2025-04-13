import { NextRequest, NextResponse } from 'next/server';
import { searchJobsWithChatGPT } from '@/ai/jobSearch';

interface SearchRequest {
  skills: string[];
  experience: string;
  education: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SearchRequest;
    const { skills, experience, education } = body;

    if (!skills || !experience || !education) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const jobs = await searchJobsWithChatGPT(skills, experience, education);
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error in job search:', error);
    return NextResponse.json(
      { error: 'Failed to search for jobs' },
      { status: 500 }
    );
  }
} 