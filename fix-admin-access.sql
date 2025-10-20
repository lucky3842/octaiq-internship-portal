-- Check if admin user exists in admin_users table
SELECT * FROM admin_users WHERE email = 'nagashreeshyl@gmail.com';

-- If not found, insert the admin user
INSERT INTO admin_users (email) VALUES ('nagashreeshyl@gmail.com') 
ON CONFLICT (email) DO NOTHING;

-- Verify the admin user is now in the table
SELECT * FROM admin_users WHERE email = 'nagashreeshyl@gmail.com';
