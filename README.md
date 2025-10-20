# OctaIQ Internship Portal

A modern, AI-powered internship portal built with React, TailwindCSS, Supabase, and OpenAI GPT-4o-mini.

## Features

- 🎨 Modern black and yellow theme with smooth animations
- 🤖 AI chatbot for instant support and queries
- 📝 Smart application form with AI resume scoring
- 👨‍💼 Admin dashboard for managing applications
- 📧 Automated email notifications
- 📱 Fully responsive design
- 🔒 Secure authentication and data management

## Tech Stack

- **Frontend**: React 18, TailwindCSS, Framer Motion
- **Backend**: Supabase (Database, Auth, Storage)
- **AI**: OpenAI GPT-4o-mini
- **Email**: Resend API
- **Deployment**: Netlify

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd octaiq-internship-portal
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required environment variables:
- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key
- `REACT_APP_RESEND_API_KEY`: Your Resend API key

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor
3. Create a storage bucket named "resumes" with private access
4. Update your environment variables with Supabase credentials

### 4. OpenAI Setup

1. Get an API key from OpenAI
2. Add it to your environment variables

### 5. Resend Setup

1. Sign up for Resend and get an API key
2. Add it to your environment variables
3. Verify your domain for email sending

### 6. Run the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in Netlify dashboard

## Admin Access

Default admin credentials:
- **Email**: nagashreeshyl@gmail.com
- **Password**: Shiva3842

To set up admin access:
1. The admin email is already inserted in the database schema
2. Create an auth user in Supabase Auth with email `nagashreeshyl@gmail.com` and password `Shiva3842`
3. Login at `/admin/login`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Chatbot.jsx     # AI chatbot component
│   └── Header.jsx      # Navigation header
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Internships.jsx # Internship listings
│   ├── ApplicationForm.jsx # Application form
│   ├── AdminLogin.jsx  # Admin authentication
│   └── AdminDashboard.jsx # Admin panel
├── services/           # API services
│   ├── aiService.js    # OpenAI integration
│   └── emailService.js # Resend integration
├── lib/                # Configuration
│   ├── supabase.js     # Supabase client
│   └── openai.js       # OpenAI client
└── App.js              # Main app component
```

## Key Features

### AI Chatbot
- Answers questions about internships, applications, and company
- Uses RAG (Retrieval-Augmented Generation) with Supabase vector database
- Available on every page with floating chat button

### Smart Application Form
- Collects comprehensive applicant information
- AI-powered resume scoring and feedback
- File upload for resumes
- Form validation with Zod schema

### Admin Dashboard
- View and manage all applications
- Filter by status (pending, shortlisted, rejected, accepted)
- Update application status with email notifications
- View AI scores and feedback
- Export functionality

### Email Notifications
- Application confirmation emails
- Status update notifications
- Professional email templates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email admin@octaiq.com or create an issue in the repository.
