import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getActiveJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching active jobs:', error);
    throw error;
  }

  return data;
}

export async function createJob(jobData: {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  employmentType: string;
}) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select();

  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }

  return data[0];
}

export async function updateJobStatus(jobId: string, status: string) {
  const { data, error } = await supabase
    .from('jobs')
    .update({ status })
    .eq('id', jobId)
    .select();

  if (error) {
    console.error('Error updating job status:', error);
    throw error;
  }

  return data[0];
} 