-- Drop all existing tables (ignore errors if they don't exist)
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS internship_roles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create internship_roles table
CREATE TABLE internship_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  location TEXT NOT NULL,
  duration INTEGER NOT NULL,
  stipend INTEGER,
  application_deadline DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role_id UUID REFERENCES internship_roles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  university TEXT NOT NULL,
  course TEXT NOT NULL,
  year TEXT NOT NULL,
  cgpa DECIMAL(4,2) NOT NULL,
  motivation TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  ai_score INTEGER DEFAULT 0,
  ai_feedback TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'rejected', 'accepted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active roles" ON internship_roles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can insert applications" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all roles" ON internship_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admins can manage applications" ON applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Anyone can view FAQs" ON faqs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage FAQs" ON faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Insert admin user
INSERT INTO admin_users (email) VALUES ('nagashreeshyl@gmail.com');

-- Insert sample roles
INSERT INTO internship_roles (title, department, description, requirements, location, duration, stipend, application_deadline) VALUES
('Frontend Developer Intern', 'Engineering', 'Work on React-based web applications and user interfaces. Learn modern frontend technologies and best practices.', 'Knowledge of HTML, CSS, JavaScript, React. Currently pursuing Computer Science or related field.', 'Remote', 3, 25000, '2024-12-31'),
('Backend Developer Intern', 'Engineering', 'Develop APIs and server-side applications using Node.js and databases. Gain experience in scalable backend systems.', 'Knowledge of Node.js, databases, REST APIs. Currently pursuing Computer Science or related field.', 'Remote', 3, 25000, '2024-12-31'),
('Data Science Intern', 'Analytics', 'Analyze data, build machine learning models, and create insights for business decisions.', 'Knowledge of Python, pandas, scikit-learn. Currently pursuing Data Science, Statistics, or related field.', 'Remote', 4, 30000, '2024-12-31'),
('UI/UX Design Intern', 'Design', 'Create user-centered designs for web and mobile applications. Work with design systems and prototyping tools.', 'Knowledge of Figma, Adobe Creative Suite, design principles. Currently pursuing Design or related field.', 'Remote', 3, 20000, '2024-12-31'),
('Marketing Intern', 'Marketing', 'Support digital marketing campaigns, content creation, and social media management.', 'Knowledge of digital marketing, content creation, social media. Currently pursuing Marketing, Communications, or related field.', 'Remote', 3, 15000, '2024-12-31');

-- Insert FAQs
INSERT INTO faqs (question, answer, category) VALUES
('What is the application process?', 'Submit your application through our portal with your resume and motivation letter. Our AI system will score your application, and our team will review it within 5-7 business days.', 'Application'),
('What are the stipend amounts?', 'Stipends vary by role and range from ₹15,000 to ₹30,000 per month depending on the position and your experience level.', 'Compensation'),
('Are internships remote?', 'Yes, all our internships are remote-friendly. You can work from anywhere with a stable internet connection.', 'Work'),
('What is the duration of internships?', 'Most internships are 3-4 months long, with the possibility of extension based on performance and business needs.', 'Duration'),
('When do internships start?', 'Internships have flexible start dates. Once selected, we will coordinate with you to find a suitable start date.', 'Timeline'),
('What support do interns receive?', 'All interns are assigned a mentor and receive regular feedback. You will also have access to our learning resources and team meetings.', 'Support');
