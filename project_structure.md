# Project Structure for Recruitment Matching Application

## Frontend Structure (Next.js)

```
recruitment-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Home page
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Registration page
│   │   ├── recruiter/          # Recruiter pages
│   │   │   ├── dashboard/      # Recruiter dashboard
│   │   │   ├── jobs/           # Job management
│   │   │   └── candidates/     # Candidate viewing
│   │   └── candidate/          # Candidate pages
│   │       ├── dashboard/      # Candidate dashboard
│   │       └── profile/        # Profile management
│   ├── components/             # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── ui/                 # UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Modal.jsx
│   │   ├── forms/              # Form components
│   │   │   ├── FileUpload.jsx
│   │   │   └── InputField.jsx
│   │   └── dashboard/          # Dashboard components
│   │       ├── JobCard.jsx
│   │       ├── CandidateCard.jsx
│   │       └── MatchScore.jsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useUpload.js
│   │   └── useMatching.js
│   ├── lib/                    # Utility functions
│   │   ├── auth.js             # Authentication utilities
│   │   ├── db.js               # Database utilities
│   │   └── utils.js            # General utilities
│   ├── ai/                     # AI-related code
│   │   ├── jdParser.js         # JD parsing logic
│   │   ├── cvParser.js         # CV parsing logic
│   │   └── matching.js         # Matching algorithm
│   ├── api/                    # API route handlers
│   │   ├── auth/               # Authentication endpoints
│   │   ├── jobs/               # Job-related endpoints
│   │   ├── resumes/            # Resume-related endpoints
│   │   ├── matching/           # Matching endpoints
│   │   └── interviews/         # Interview endpoints
│   └── styles/                 # Global styles
│       └── globals.css
├── public/                     # Static assets
│   ├── images/
│   └── favicon.ico
├── migrations/                 # Database migrations
│   └── 0001_initial.sql
├── wrangler.toml               # Cloudflare configuration
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
├── README.md                   # Project documentation
├── system_architecture.md      # System architecture documentation
└── data_models.md              # Data models documentation
```

## Backend Structure (Next.js API Routes)

The backend functionality will be implemented using Next.js API routes, which will be organized as follows:

```
src/app/api/
├── auth/                       # Authentication endpoints
│   ├── login/route.js          # Login endpoint
│   ├── register/route.js       # Registration endpoint
│   └── logout/route.js         # Logout endpoint
├── jobs/                       # Job-related endpoints
│   ├── route.js                # GET/POST jobs
│   └── [id]/route.js           # GET/PUT/DELETE specific job
├── resumes/                    # Resume-related endpoints
│   ├── route.js                # GET/POST resumes
│   └── [id]/route.js           # GET/PUT/DELETE specific resume
├── matching/                   # Matching endpoints
│   ├── route.js                # GET/POST matches
│   └── [id]/route.js           # GET/PUT/DELETE specific match
└── interviews/                 # Interview endpoints
    ├── route.js                # GET/POST interviews
    └── [id]/route.js           # GET/PUT/DELETE specific interview
```

## AI Components Structure

```
src/ai/
├── jdParser.js                 # JD parsing using LLM
├── cvParser.js                 # CV parsing using LLM and PyPDF2
├── matching.js                 # Matching algorithm using embeddings
├── shortlisting.js             # Candidate ranking algorithm
└── utils/                      # AI utilities
    ├── embeddings.js           # Embedding generation
    ├── textProcessing.js       # Text preprocessing
    └── similarity.js           # Similarity calculation
```

## Database Structure (Cloudflare D1)

```
migrations/
├── 0001_initial.sql            # Initial schema creation
└── 0002_seed_data.sql          # Optional seed data
```
