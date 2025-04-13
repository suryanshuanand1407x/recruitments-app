# AI-Powered Recruitment Platform

A modern recruitment platform built with Next.js, featuring AI-powered resume parsing and job matching.

## Features

- **User Authentication**
  - Email/password authentication
  - Google OAuth integration
  - Role-based access (Candidates and Recruiters)

- **AI-Powered Features**
  - Resume parsing using OpenAI GPT-3.5
  - Automated skill extraction
  - Smart job matching

- **Candidate Features**
  - Profile management
  - Resume upload and parsing
  - Job applications tracking

- **Recruiter Features**
  - Job posting
  - Candidate screening
  - Application management

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI GPT-3.5
- **UI Components**: shadcn/ui

## Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd recruitment-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. Initialize the database:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and shared logic
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Environment Variables

- `DATABASE_URL`: SQLite database URL
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret key for JWT encryption
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `OPENAI_API_KEY`: OpenAI API key for resume parsing

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
