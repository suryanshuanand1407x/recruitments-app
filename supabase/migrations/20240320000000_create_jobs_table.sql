-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL,
    salary TEXT,
    employment_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active jobs
CREATE POLICY "Allow public read access to active jobs" ON public.jobs
    FOR SELECT
    USING (status = 'active');

-- Allow authenticated users to create jobs
CREATE POLICY "Allow authenticated users to create jobs" ON public.jobs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update their own jobs
CREATE POLICY "Allow authenticated users to update their own jobs" ON public.jobs
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 