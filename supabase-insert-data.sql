-- Insert admin user (ignore if exists)
INSERT INTO admin_users (email) VALUES ('nagashreeshyl@gmail.com') ON CONFLICT (email) DO NOTHING;

-- Insert sample internship roles (ignore if exists)
INSERT INTO internship_roles (title, department, description, requirements, location, duration, stipend, application_deadline) VALUES
('Frontend Developer Intern', 'Engineering', 'Work on React-based web applications and user interfaces. Learn modern frontend technologies and best practices.', 'Knowledge of HTML, CSS, JavaScript, React. Currently pursuing Computer Science or related field.', 'Remote', 3, 25000, '2024-12-31'),
('Backend Developer Intern', 'Engineering', 'Develop APIs and server-side applications using Node.js and databases. Gain experience in scalable backend systems.', 'Knowledge of Node.js, databases, REST APIs. Currently pursuing Computer Science or related field.', 'Remote', 3, 25000, '2024-12-31'),
('Data Science Intern', 'Analytics', 'Analyze data, build machine learning models, and create insights for business decisions.', 'Knowledge of Python, pandas, scikit-learn. Currently pursuing Data Science, Statistics, or related field.', 'Remote', 4, 30000, '2024-12-31'),
('UI/UX Design Intern', 'Design', 'Create user-centered designs for web and mobile applications. Work with design systems and prototyping tools.', 'Knowledge of Figma, Adobe Creative Suite, design principles. Currently pursuing Design or related field.', 'Remote', 3, 20000, '2024-12-31'),
('Marketing Intern', 'Marketing', 'Support digital marketing campaigns, content creation, and social media management.', 'Knowledge of digital marketing, content creation, social media. Currently pursuing Marketing, Communications, or related field.', 'Remote', 3, 15000, '2024-12-31')
ON CONFLICT DO NOTHING;

-- Insert FAQs for chatbot (ignore if exists)
INSERT INTO faqs (question, answer, category) VALUES
('What is the application process?', 'Submit your application through our portal with your resume and motivation letter. Our AI system will score your application, and our team will review it within 5-7 business days.', 'Application'),
('What are the stipend amounts?', 'Stipends vary by role and range from ₹15,000 to ₹30,000 per month depending on the position and your experience level.', 'Compensation'),
('Are internships remote?', 'Yes, all our internships are remote-friendly. You can work from anywhere with a stable internet connection.', 'Work'),
('What is the duration of internships?', 'Most internships are 3-4 months long, with the possibility of extension based on performance and business needs.', 'Duration'),
('When do internships start?', 'Internships have flexible start dates. Once selected, we will coordinate with you to find a suitable start date.', 'Timeline'),
('What support do interns receive?', 'All interns are assigned a mentor and receive regular feedback. You will also have access to our learning resources and team meetings.', 'Support')
ON CONFLICT DO NOTHING;
