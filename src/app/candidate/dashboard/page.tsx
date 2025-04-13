'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import FileUpload from '@/components/forms/FileUpload'
import { parseResume, ResumeSummary } from '@/ai/cvParser'
import { matchResumeWithJobs } from '@/ai/matching'
import { searchJobsWithChatGPT, JobSearchResult } from '@/ai/jobSearch'

interface File {
  name: string;
  text: () => Promise<string>;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  keySkills: string[];
  description: string;
  status: string;
}

interface Match {
  jobId: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  score: number;
  matchedSkills: string[];
  status: string;
}

interface UploadResponse {
  skills: string[];
  experience: string;
  education: string;
}

export default function CandidateDashboard() {
  const { data: session } = useSession()
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [processingResume, setProcessingResume] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeSummary | null>(null)
  const [matchedJobs, setMatchedJobs] = useState<Match[]>([])
  const [activeTab, setActiveTab] = useState('matches')
  const [error, setError] = useState<string | null>(null)
  const [jobResults, setJobResults] = useState<JobSearchResult[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setResumeData(data);

      // Search for jobs using the API route
      const searchResponse = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: data.skills,
          experience: data.experience,
          education: data.education,
        }),
      });

      if (!searchResponse.ok) {
        throw new Error('Failed to search for jobs');
      }

      const searchData = await searchResponse.json();
      setJobResults(searchData);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to process resume');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return <Badge variant="outline">Matched</Badge>
      case 'applied':
        return <Badge variant="secondary">Applied</Badge>
      case 'interview_scheduled':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Interview Scheduled</Badge>
      case 'rejected':
        return <Badge variant="destructive">Not Selected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name || 'there'}!</h1>
        <p className="text-muted-foreground mt-2">Signed in as {session?.user?.email}</p>
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Resume
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {jobResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobResults.map((job, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <p className="text-gray-500 mb-4">{job.location}</p>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="text-gray-600">{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">{job.salary}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {job.employmentType}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">
                    Match Score: {job.matchScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
