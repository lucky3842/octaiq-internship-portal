-- Drop and recreate the policy for internship_roles
DROP POLICY IF EXISTS "Admin can manage all roles" ON internship_roles;
DROP POLICY IF EXISTS "Public can view active roles" ON internship_roles;

-- Allow public to view active roles
CREATE POLICY "Public can view active roles" ON internship_roles
  FOR SELECT USING (is_active = true);

-- Allow anyone to insert/update/delete roles (simplified for now)
CREATE POLICY "Anyone can manage roles" ON internship_roles
  FOR ALL USING (true);
