# Huawei ICT Cloud Track Study & Mock Exam Web App

A comprehensive study platform for Huawei Cloud Computing certifications (HCIA and HCIP) with interactive learning materials, practice exams, and progress tracking.

## 🚀 Features

### MVP Features (Current)
- **Authentication**: Supabase Auth for signup/login with protected routes
- **Study Mode**: Static study materials and flashcards
- **Mock Exam Mode**: Practice exams with randomized questions and timer
- **Results Dashboard**: Score tracking and performance analytics
- **Responsive UI**: Dark mode toggle, clean design with Tailwind CSS

### Future Enhancements
- AI-powered study summaries and question generation
- Advanced analytics and learning recommendations
- More certification tracks (HCIE, other Huawei certifications)
- Social features and leaderboards

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite** - Modern React development
- **Tailwind CSS v4.1** - Latest version with Vite plugin
- **React Router v7** - Client-side routing
- **Supabase Client** - Authentication and database
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization for analytics

### Backend
- **Python FastAPI** - High-performance async API
- **Supabase** - PostgreSQL database with real-time features
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation and serialization
- **Python-Jose** - JWT token handling

### Database & Auth
- **Supabase** - PostgreSQL + Auth + Real-time
- **Tables**: users, study_materials, questions, results, flashcards

### Hosting (Planned)
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier)
- **Database**: Supabase (free tier)

## 📁 Project Structure

```
huawei-cloud/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Flashcard.jsx   # (To be implemented)
│   │   │   └── Timer.jsx       # (To be implemented)
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Study.jsx
│   │   │   ├── MockExam.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/           # React context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/             # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── utils/             # Utility functions
│   │   │   └── supabaseClient.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── routes/             # API routes
│   │   │   ├── auth.py
│   │   │   ├── study.py
│   │   │   ├── exam.py
│   │   │   └── results.py
│   │   ├── services/           # Business logic
│   │   │   ├── exam_service.py
│   │   │   └── results_service.py
│   │   ├── utils/              # Utility functions
│   │   │   ├── randomizer.py
│   │   │   └── timer.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.11+** and pip
- **Supabase account** (free tier available)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd huawei-cloud
```

### 2. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Create the following tables in your Supabase dashboard:

```sql
-- Users table (handled by Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study materials table
CREATE TABLE study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT NOT NULL,
  topic TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Results table
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  exam_id TEXT NOT NULL,
  score FLOAT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  time_taken INTEGER NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flashcards table
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Supabase credentials
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_API_BASE_URL=http://localhost:8000/api

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Backend Setup
```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_anon_key
# SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be available at `http://localhost:8000`

## 🎯 Current Status

### ✅ Completed
- Project structure and configuration
- Authentication system with Supabase
- Frontend routing and protected routes
- Core UI components (Navbar, Footer)
- Login and Registration pages
- Home page with hero section
- Backend API structure with FastAPI
- Static data for study materials and questions
- Dark mode implementation
- Responsive design with Tailwind CSS

### 🔄 In Progress
- Study Mode implementation
- Mock Exam interface
- Results Dashboard
- Database schema setup

### 📋 Next Steps
1. **Implement Study Mode** with flashcards and materials
2. **Build Mock Exam interface** with timer and question cards
3. **Create Results Dashboard** with charts and analytics
4. **Set up Supabase database** with proper schema
5. **Deploy to production** (Vercel + Render + Supabase)

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend (.env)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
SECRET_KEY=your-jwt-secret-key
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables in Render dashboard
4. Use the provided Dockerfile for deployment

### Database (Supabase)
- Already hosted, just need to set up tables and RLS policies

## 📝 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## 🎨 Design Features

- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized with Vite and modern React practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
