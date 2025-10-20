-- Drop existing policies for applications
DROP POLICY IF EXISTS "Admin can manage applications" ON applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;

-- Create new policies that allow all operations
CREATE POLICY "Anyone can manage applications" ON applications
  FOR ALL USING (true);

-- Also ensure applications table RLS is disabled (simpler approach)
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
