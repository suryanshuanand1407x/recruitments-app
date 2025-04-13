# Data Models for Recruitment Matching Application

This document defines the core data models for the recruitment matching application.

## User Model
```
User {
  id: string (UUID)
  email: string
  password: string (hashed)
  name: string
  role: enum ["recruiter", "candidate", "admin"]
  company: string (for recruiters)
  createdAt: datetime
  updatedAt: datetime
}
```

## Job Description (JD) Model
```
JobDescription {
  id: string (UUID)
  title: string
  company: string
  location: string
  description: text
  requirements: text
  responsibilities: text
  salary: string (optional)
  employmentType: string (full-time, part-time, contract)
  recruiterId: string (foreign key to User)
  status: enum ["active", "filled", "closed"]
  originalFile: string (path to uploaded file)
  createdAt: datetime
  updatedAt: datetime
}
```

## JD Summary Model (AI-generated)
```
JDSummary {
  id: string (UUID)
  jobDescriptionId: string (foreign key to JobDescription)
  keySkills: array of strings
  requiredExperience: string
  educationRequirements: string
  embedding: vector (for similarity matching)
  createdAt: datetime
  updatedAt: datetime
}
```

## CV/Resume Model
```
Resume {
  id: string (UUID)
  candidateId: string (foreign key to User)
  originalFile: string (path to uploaded file)
  fileName: string
  fileType: string
  createdAt: datetime
  updatedAt: datetime
}
```

## CV Summary Model (AI-generated)
```
ResumeSummary {
  id: string (UUID)
  resumeId: string (foreign key to Resume)
  candidateName: string
  skills: array of strings
  experience: array of objects {
    company: string
    title: string
    duration: string
    description: string
  }
  education: array of objects {
    institution: string
    degree: string
    field: string
    year: string
  }
  embedding: vector (for similarity matching)
  createdAt: datetime
  updatedAt: datetime
}
```

## Match Model
```
Match {
  id: string (UUID)
  jobDescriptionId: string (foreign key to JobDescription)
  resumeId: string (foreign key to Resume)
  score: float (0-1, similarity score)
  status: enum ["pending", "shortlisted", "rejected", "interviewed", "hired"]
  notes: text (optional, recruiter notes)
  createdAt: datetime
  updatedAt: datetime
}
```

## Interview Model
```
Interview {
  id: string (UUID)
  matchId: string (foreign key to Match)
  scheduledTime: datetime
  duration: integer (minutes)
  location: string (or meeting link)
  status: enum ["scheduled", "completed", "cancelled", "rescheduled"]
  feedback: text (optional)
  createdAt: datetime
  updatedAt: datetime
}
```

## Email Notification Model
```
EmailNotification {
  id: string (UUID)
  recipientId: string (foreign key to User)
  subject: string
  body: text
  type: enum ["interview_invitation", "status_update", "reminder"]
  relatedEntityId: string (could be matchId or interviewId)
  status: enum ["pending", "sent", "failed"]
  sentAt: datetime (optional)
  createdAt: datetime
  updatedAt: datetime
}
```
