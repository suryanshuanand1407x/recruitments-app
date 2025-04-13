# Deployment Guide for Recruitment Matching Application

This guide outlines the steps to deploy the Recruitment Matching Application to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (can sign up with GitHub)
- OpenAI API key (for production deployment)
- Resend API key (for email functionality)

## Preparing for Deployment

### 1. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
# API Keys
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=your_resend_api_key

# Database Configuration
DATABASE_URL=your_database_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
```

### 2. Update package.json

Ensure the package.json file has the correct build and start scripts:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### 3. Create a Vercel Configuration File

Create a `vercel.json` file in the project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## Deployment Steps

### 1. Push to GitHub

1. Create a new GitHub repository
2. Initialize Git in your project folder:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/recruitment-app.git
   git push -u origin main
   ```

### 2. Deploy to Vercel

1. Log in to your Vercel account
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
5. Add Environment Variables:
   - Add all variables from your `.env.local` file
6. Click "Deploy"

### 3. Verify Deployment

1. Once deployment is complete, Vercel will provide a URL
2. Visit the URL to ensure the application is working correctly
3. Test key functionality:
   - User registration and login
   - Job description and resume uploads
   - Matching and shortlisting
   - Email notifications

## Post-Deployment Tasks

### 1. Set Up Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain and follow the verification steps

### 2. Configure Analytics and Monitoring

1. In your Vercel project dashboard, go to "Analytics"
2. Enable Vercel Analytics to monitor performance and usage

### 3. Set Up Continuous Deployment

Vercel automatically sets up continuous deployment from your GitHub repository. Any push to the main branch will trigger a new deployment.

## Troubleshooting

### Common Issues

1. **API Keys Not Working**: Verify that all environment variables are correctly set in the Vercel dashboard.

2. **Database Connection Issues**: Ensure your database is accessible from Vercel's servers and the connection string is correct.

3. **Build Failures**: Check the build logs in Vercel for specific errors.

4. **Email Sending Failures**: Verify your Resend API key and ensure the email templates are correctly formatted.

### Getting Help

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Cloudflare Workers Documentation: https://developers.cloudflare.com/workers/
