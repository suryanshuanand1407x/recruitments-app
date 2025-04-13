'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import FileUpload from '@/components/forms/FileUpload'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Job, Candidate, Application } from '@/types'
import { createJob, getJobs, getCandidates, getApplications } from '@/lib/api'

// Integration with AI components
import { mockParseJobDescription } from '@/ai/jdParser'
import { mockMatchJobWithResumes } from '@/ai/matching'
import { shortlistCandidates } from '@/ai/shortlisting'

// Mock data for demonstration
const mockJobs = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    postedDate: '2025-03-28',
    matchedCandidates: 12,
    status: 'active'
  },
  {
    id: 'job2',
    title: 'Machine Learning Engineer',
    company: 'TechCorp',
    location: 'New York, NY',
    postedDate: '2025-04-01',
    matchedCandidates: 8,
    status: 'active'
  },
  {
    id: 'job3',
    title: 'Product Manager',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    postedDate: '2025-03-15',
    matchedCandidates: 15,
    status: 'active'
  }
]

const mockCandidates = [
  {
    id: 'cand1',
    name: 'Alex Johnson',
    matchScore: 0.92,
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: [
      {
        company: 'Web Solutions Inc.',
        title: 'Senior Developer',
        duration: '2020 - Present',
        description: 'Led frontend development team'
      }
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        year: '2018'
      }
    ],
    jobId: 'job1',
    status: 'shortlisted',
    matchedSkills: ['React', 'TypeScript']
  },
  {
    id: 'cand2',
    name: 'Jamie Smith',
    matchScore: 0.88,
    skills: ['React', 'JavaScript', 'CSS'],
    experience: [
      {
        company: 'Creative Designs',
        title: 'Frontend Developer',
        duration: '2019 - Present',
        description: 'Developed responsive web applications'
      }
    ],
    education: [
      {
        institution: 'Design Institute',
        degree: 'Bachelor of Arts',
        field: 'Web Design',
        year: '2019'
      }
    ],
    jobId: 'job1',
    status: 'shortlisted',
    matchedSkills: ['React', 'JavaScript', 'CSS']
  },
  {
    id: 'cand3',
    name: 'Taylor Wilson',
    matchScore: 0.85,
    skills: ['Angular', 'TypeScript', 'Node.js'],
    experience: [
      {
        company: 'Tech Innovations',
        title: 'Full Stack Developer',
        duration: '2018 - Present',
        description: 'Built enterprise applications'
      }
    ],
    education: [
      {
        institution: 'State University',
        degree: 'Master of Science',
        field: 'Software Engineering',
        year: '2018'
      }
    ],
    jobId: 'job1',
    status: 'pending',
    matchedSkills: ['TypeScript', 'Node.js']
  },
  {
    id: 'cand4',
    name: 'Morgan Lee',
    matchScore: 0.95,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
    experience: [
      {
        company: 'AI Research Lab',
        title: 'ML Engineer',
        duration: '2017 - Present',
        description: 'Developed machine learning models'
      }
    ],
    education: [
      {
        institution: 'Tech University',
        degree: 'PhD',
        field: 'Computer Science',
        year: '2017'
      }
    ],
    jobId: 'job2',
    status: 'interviewed',
    matchedSkills: ['Python', 'Machine Learning']
  }
]

export default function RecruiterDashboard() {
  const { data: session } = useSession()
  const [selectedJob, setSelectedJob] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [processingJD, setProcessingJD] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [shortlistedCandidates, setShortlistedCandidates] = useState([])
  const [activeTab, setActiveTab] = useState('jobs')
  const [jobs, setJobs] = useState<Job[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const handleFileUpload = async (file) => {
    console.log('Job description uploaded:', file.name)
    
    // Show processing state
    setProcessingJD(true)
    
    try {
      // In a real implementation, this would send the file to the server
      // and call the AI parsing and matching functions
      
      // Simulate file reading and processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock JD parsing
      const jdText = `
        Job Title: Senior Full Stack Developer
        
        Company: TechCorp
        
        Location: Remote (US-based)
        
        Employment Type: Full-time
        
        About the Role:
        We are seeking an experienced Full Stack Developer to join our growing team. The ideal candidate will have strong experience with modern JavaScript frameworks and backend technologies.
        
        Required Skills:
        - 5+ years of experience in web development
        - Proficiency in React, Node.js, and TypeScript
        - Experience with RESTful APIs and GraphQL
        - Strong understanding of database design and optimization
        - Experience with cloud platforms (AWS, Azure, or GCP)
        
        Responsibilities:
        - Develop and maintain web applications using React and Node.js
        - Collaborate with cross-functional teams to define and implement new features
        - Write clean, efficient, and maintainable code
        - Participate in code reviews and contribute to technical discussions
        - Troubleshoot and debug applications
        
        Education:
        Bachelor's degree in Computer Science or related field, or equivalent practical experience
        
        Salary Range:
        $120,000 - $150,000 per year, depending on experience
      `
      
      const parsedJD = mockParseJobDescription(jdText)
      setJobData(parsedJD)
      
      // Mock matching with candidates
      // In a real implementation, this would call the matching API
      const filteredCandidates = mockCandidates.filter(candidate => 
        candidate.skills.some(skill => 
          parsedJD.keySkills.includes(skill)
        )
      )
      
      // Apply shortlisting algorithm
      const shortlisted = shortlistCandidates(filteredCandidates, {
        minMatchScore: 0.7,
        maxCandidates: 10
      })
      
      setShortlistedCandidates(shortlisted)
      
      // Show success message
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 5000)
      
      // Switch to candidates tab
      setActiveTab('candidates')
    } catch (error) {
      console.error('Error processing job description:', error)
    } finally {
      setProcessingJD(false)
    }
  }

  const handleSelectJob = (jobId) => {
    if (selectedJob === jobId) {
      setSelectedJob(null)
    } else {
      setSelectedJob(jobId)
      
      // Filter candidates for the selected job
      const filteredCandidates = mockCandidates.filter(candidate => candidate.jobId === jobId)
      setShortlistedCandidates(filteredCandidates)
    }
  }

  const sendInterviewInvite = (candidateId) => {
    // In a real implementation, this would call the API to send an interview invitation
    console.log(`Sending interview invitation to candidate ${candidateId}`)
    
    // Update the candidate status in the UI
    setShortlistedCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: 'interview_scheduled' }
          : candidate
      )
    )
    
    // Show success message
    alert(`Interview invitation sent to ${shortlistedCandidates.find(c => c.id === candidateId)?.name}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name || 'there'}!</h1>
        <p className="text-muted-foreground mt-2">Signed in as {session?.user?.email}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          <TabsTrigger value="upload">Upload Job</TabsTrigger>
          <TabsTrigger value="candidates">Matched Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Scheduled Interviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockJobs.map(job => (
              <Card 
                key={job.id} 
                className={`cursor-pointer transition-colors ${
                  selectedJob === job.id ? 'border-primary' : ''
                }`}
                onClick={() => handleSelectJob(job.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company} • {job.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                    <span className="text-primary font-medium">{job.matchedCandidates} matches</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/recruiter/jobs/${job.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleSelectJob(job.id);
                      setActiveTab('candidates');
                    }}>View Matches</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {jobData && !selectedJob && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Recently Uploaded Job</CardTitle>
                <CardDescription>AI-extracted information from your job description</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Job Title</h3>
                    <p>{jobData.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Key Skills Required</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {jobData.keySkills.map(skill => (
                        <span 
                          key={skill} 
                          className="bg-secondary text-secondary-foreground text-xs rounded-full px-2 py-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Experience Required</h3>
                    <p>{jobData.requiredExperience}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Education Requirements</h3>
                    <p>{jobData.educationRequirements}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Employment Type</h3>
                    <p>{jobData.employmentType}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>{jobData.location}</p>
                  </div>
                  
                  {jobData.salaryRange && (
                    <div>
                      <h3 className="font-medium">Salary Range</h3>
                      <p>{jobData.salaryRange}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => setActiveTab('candidates')}>
                      View Matched Candidates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upload">
          <div className="max-w-2xl mx-auto">
            {uploadSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">Job description uploaded and processed successfully! AI matching has begun.</span>
              </div>
            )}
            
            {processingJD && (
              <div className="mb-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="mb-3">Processing job description with AI...</div>
                      <Progress value={undefined} className="h-2 w-full max-w-md" />
                      <div className="mt-3 text-sm text-muted-foreground">
                        Extracting requirements, skills, and responsibilities...
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <FileUpload type="jd" onUpload={handleFileUpload} />
          </div>
        </TabsContent>
        
        <TabsContent value="candidates">
          {shortlistedCandidates.length > 0 ? (
            <div>
              {selectedJob && (
                <h2 className="text-xl font-semibold mb-4">
                  Matched Candidates for {mockJobs.find(job => job.id === selectedJob)?.title || jobData?.title}
                </h2>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shortlistedCandidates.map(candidate => (
                  <Card key={candidate.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                        <div className="bg-primary/10 text-primary font-medium rounded-full px-2 py-1 text-sm">
                          {Math.round(candidate.matchScore * 100)}% Match
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Match Score</span>
                          <span>{Math.round(candidate.matchScore * 100)}%</span>
                        </div>
                        <Progress value={candidate.matchScore * 100} className="h-2" />
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-sm text-muted-foreground">Experience: </span>
                        <span className="text-sm">
                          {candidate.experience[0]?.title} at {candidate.experience[0]?.company}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-sm text-muted-foreground">Matched Skills: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {candidate.matchedSkills.map(skill => (
                            <span 
                              key={skill} 
                              className="bg-secondary text-secondary-foreground text-xs rounded-full px-2 py-1"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/recruiter/candidates/${candidate.id}`}>View Profile</Link>
                        </Button>
                        {candidate.status === 'shortlisted' ? (
                          <Button size="sm" onClick={() => sendInterviewInvite(candidate.id)}>
                            Schedule Interview
                          </Button>
                        ) : candidate.status === 'interviewed' ? (
                          <Button size="sm">Send Offer</Button>
                        ) : candidate.status === 'interview_scheduled' ? (
                          <Button size="sm" variant="outline" disabled>
                            Interview Scheduled
                          </Button>
                        ) : (
                          <Button size="sm">Shortlist</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No candidates matched yet. Upload a job description or select a job to view matched candidates.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="interviews">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Manage your scheduled interviews with candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium border-b">
                    <div>Candidate</div>
                    <div>Position</div>
                    <div>Date & Time</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  <div className="grid grid-cols-5 p-4 border-b">
                    <div>Morgan Lee</div>
                    <div>Machine Learning Engineer</div>
                    <div>Apr 10, 2025 - 10:00 AM</div>
                    <div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Confirmed
                      </span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div>Jamie Smith</div>
                    <div>Senior Frontend Developer</div>
                    <div>Apr 12, 2025 - 2:00 PM</div>
                    <div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                        Pending
                      </span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Send Reminder</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
