-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON jobs;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON jobs;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON jobs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON jobs
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON jobs
  FOR DELETE USING (true); 