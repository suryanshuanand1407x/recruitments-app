'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto px-4 py-12">
      {session && (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Welcome back, {session.user?.name || 'there'}!</h1>
          <p className="text-muted-foreground mt-2">Signed in as {session.user?.email}</p>
        </div>
      )}
      
      <section className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          AI-Powered Recruitment Matching
        </h1>
        <p className="text-xl text-foreground/80 max-w-3xl mb-8">
          Connect the right candidates with the right jobs using advanced AI technology.
          Our platform automatically matches job descriptions with resumes to find the perfect fit.
        </p>
        {session ? (
          <Button size="lg" asChild>
            <Link href={`/${session.user.userType}/dashboard`}>
              Go to Dashboard
            </Link>
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="min-w-[200px]" asChild>
              <Link href="/signin?type=recruiter">I&apos;m a Recruiter</Link>
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px]" asChild>
              <Link href="/signin?type=candidate">I&apos;m a Candidate</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>For Recruiters</CardTitle>
              <CardDescription>Upload job descriptions and find matching candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 list-decimal list-inside text-foreground/80">
                <li>Upload your job descriptions</li>
                <li>Our AI extracts key skills and requirements</li>
                <li>View ranked candidates based on match percentage</li>
                <li>Send interview invitations with one click</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>For Candidates</CardTitle>
              <CardDescription>Upload your resume and get matched with relevant jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 list-decimal list-inside text-foreground/80">
                <li>Upload your resume or CV</li>
                <li>Our AI extracts your skills and experience</li>
                <li>Get matched with relevant job opportunities</li>
                <li>Receive interview invitations automatically</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Matching</CardTitle>
              <CardDescription>Powered by advanced natural language processing</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 list-disc list-inside text-foreground/80">
                <li>NLP/LLM for parsing job descriptions and resumes</li>
                <li>Semantic understanding of skills and requirements</li>
                <li>Vector embeddings for accurate similarity matching</li>
                <li>Automatic shortlisting of top candidates</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Our AI analyzes job descriptions and resumes to find the best matches based on skills, 
                experience, and requirements, saving hours of manual screening.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Automated Shortlisting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Candidates are automatically ranked by match percentage, allowing recruiters to 
                focus on the most promising candidates first.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>One-Click Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Send interview invitations to matched candidates with a single click, 
                streamlining the recruitment process.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Intuitive Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Both recruiters and candidates get personalized dashboards showing matches, 
                application status, and upcoming interviews.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
