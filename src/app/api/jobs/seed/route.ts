import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const sampleJobs = [
  {
    title: "Senior Full Stack Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    description: "We are looking for a Senior Full Stack Developer to join our team. The ideal candidate will have experience with React, Node.js, and PostgreSQL.",
    requirements: ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS"],
    salary: "$150,000 - $180,000 per year",
    employment_type: "Full-time",
    status: "active"
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Solutions",
    location: "Remote",
    description: "Join our team as a Machine Learning Engineer to work on cutting-edge AI projects. Experience with TensorFlow and PyTorch required.",
    requirements: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"],
    salary: "$140,000 - $170,000 per year",
    employment_type: "Full-time",
    status: "active"
  },
  {
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "New York, NY",
    description: "We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure.",
    requirements: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    salary: "$130,000 - $160,000 per year",
    employment_type: "Full-time",
    status: "active"
  }
];

export async function POST() {
  try {
    // First, check if the jobs table exists
    const { error: tableError } = await supabase
      .from('jobs')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('Error checking jobs table:', tableError);
      return NextResponse.json(
        { error: 'Jobs table does not exist or is not accessible' },
        { status: 500 }
      );
    }

    // Insert the sample jobs
    const { data, error } = await supabase
      .from('jobs')
      .insert(sampleJobs)
      .select();

    if (error) {
      console.error('Error inserting jobs:', error);
      return NextResponse.json(
        { error: `Failed to insert jobs: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Sample jobs added successfully",
      data 
    });
  } catch (error) {
    console.error('Error seeding jobs:', error);
    return NextResponse.json(
      { error: `Failed to seed jobs: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 