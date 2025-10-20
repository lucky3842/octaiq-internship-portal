-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active roles" ON internship_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON internship_roles;

-- Create new policies that work
CREATE POLICY "Public can view active roles" ON internship_roles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage all roles" ON internship_roles
  FOR ALL USING (true);

-- Also fix applications policy
DROP POLICY IF EXISTS "Admins can manage applications" ON applications;
CREATE POLICY "Admin can manage applications" ON applications
  FOR ALL USING (true);
