// Database utility functions for the recruitment matching application
import { D1Database } from '@cloudflare/workers-types'

// Generate a UUID for database IDs
export function generateId(): string {
  return crypto.randomUUID()
}

// User-related database functions
export async function createUser(db: D1Database, userData: {
  email: string;
  password: string;
  name: string;
  role: 'recruiter' | 'candidate' | 'admin';
  company?: string;
}): Promise<string> {
  const id = generateId()
  
  await db.prepare(`
    INSERT INTO users (id, email, password, name, role, company)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    userData.email,
    userData.password, // Note: In production, this should be hashed
    userData.name,
    userData.role,
    userData.company || null
  ).run()
  
  return id
}

export async function getUserByEmail(db: D1Database, email: string) {
  return await db.prepare(`
    SELECT * FROM users WHERE email = ?
  `).bind(email).first()
}

export async function getUserById(db: D1Database, id: string) {
  return await db.prepare(`
    SELECT * FROM users WHERE id = ?
  `).bind(id).first()
}

// Job Description related functions
export async function createJobDescription(db: D1Database, jobData: {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salary?: string;
  employmentType: string;
  recruiterId: string;
  originalFile?: string;
}): Promise<string> {
  const id = generateId()
  
  await db.prepare(`
    INSERT INTO job_descriptions (
      id, title, company, location, description, requirements, 
      responsibilities, salary, employment_type, recruiter_id, original_file
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    jobData.title,
    jobData.company,
    jobData.location,
    jobData.description,
    jobData.requirements,
    jobData.responsibilities,
    jobData.salary || null,
    jobData.employmentType,
    jobData.recruiterId,
    jobData.originalFile || null
  ).run()
  
  return id
}

export async function getJobDescriptionsByRecruiterId(db: D1Database, recruiterId: string) {
  return await db.prepare(`
    SELECT * FROM job_descriptions WHERE recruiter_id = ? ORDER BY created_at DESC
  `).bind(recruiterId).all()
}

export async function getJobDescriptionById(db: D1Database, id: string) {
  return await db.prepare(`
    SELECT * FROM job_descriptions WHERE id = ?
  `).bind(id).first()
}

export async function getActiveJobDescriptions(db: D1Database): Promise<Array<{
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  keySkills: string[];
  postedDate: string;
  status: string;
}>> {
  const { results } = await db.prepare(`
    SELECT id, title, company, location, description, key_skills, posted_date, status
    FROM job_descriptions
    WHERE status = 'active'
    ORDER BY posted_date DESC
  `).all()
  
  return results.map(row => ({
    id: String(row.id),
    title: String(row.title),
    company: String(row.company),
    location: String(row.location),
    description: String(row.description),
    keySkills: JSON.parse(String(row.key_skills)),
    postedDate: String(row.posted_date),
    status: String(row.status)
  }))
}

// Resume related functions
export async function createResume(db: D1Database, resumeData: {
  candidateId: string;
  originalFile: string;
  fileName: string;
  fileType: string;
}): Promise<string> {
  const id = generateId()
  
  await db.prepare(`
    INSERT INTO resumes (id, candidate_id, original_file, file_name, file_type)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    id,
    resumeData.candidateId,
    resumeData.originalFile,
    resumeData.fileName,
    resumeData.fileType
  ).run()
  
  return id
}

export async function getResumesByCandidateId(db: D1Database, candidateId: string) {
  return await db.prepare(`
    SELECT * FROM resumes WHERE candidate_id = ? ORDER BY created_at DESC
  `).bind(candidateId).all()
}

// Match related functions
export async function createMatch(db: D1Database, matchData: {
  jobDescriptionId: string;
  resumeId: string;
  score: number;
}): Promise<string> {
  const id = generateId()
  
  await db.prepare(`
    INSERT INTO matches (id, job_description_id, resume_id, score)
    VALUES (?, ?, ?, ?)
  `).bind(
    id,
    matchData.jobDescriptionId,
    matchData.resumeId,
    matchData.score
  ).run()
  
  return id
}

export async function getMatchesByJobDescriptionId(db: D1Database, jobDescriptionId: string) {
  return await db.prepare(`
    SELECT m.*, r.candidate_id, rs.candidate_name, rs.skills, rs.experience, rs.education
    FROM matches m
    JOIN resumes r ON m.resume_id = r.id
    JOIN resume_summaries rs ON r.id = rs.resume_id
    WHERE m.job_description_id = ?
    ORDER BY m.score DESC
  `).bind(jobDescriptionId).all()
}

export async function getMatchesByCandidateId(db: D1Database, candidateId: string) {
  return await db.prepare(`
    SELECT m.*, jd.title, jd.company, jd.location, jd.employment_type
    FROM matches m
    JOIN resumes r ON m.resume_id = r.id
    JOIN job_descriptions jd ON m.job_description_id = jd.id
    WHERE r.candidate_id = ?
    ORDER BY m.score DESC
  `).bind(candidateId).all()
}

export async function updateMatchStatus(db: D1Database, matchId: string, status: string, notes?: string) {
  await db.prepare(`
    UPDATE matches
    SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(status, notes || null, matchId).run()
}

// Interview related functions
export async function createInterview(db: D1Database, interviewData: {
  matchId: string;
  scheduledTime: string; // ISO date string
  duration: number; // minutes
  location: string;
}): Promise<string> {
  const id = generateId()
  
  await db.prepare(`
    INSERT INTO interviews (id, match_id, scheduled_time, duration, location)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    id,
    interviewData.matchId,
    interviewData.scheduledTime,
    interviewData.duration,
    interviewData.location
  ).run()
  
  return id
}

export async function getInterviewsByMatchId(db: D1Database, matchId: string) {
  return await db.prepare(`
    SELECT * FROM interviews WHERE match_id = ? ORDER BY scheduled_time ASC
  `).bind(matchId).all()
}

export async function getUpcomingInterviewsByRecruiterId(db: D1Database, recruiterId: string) {
  return await db.prepare(`
    SELECT i.*, m.id as match_id, jd.title, jd.company, r.candidate_id, rs.candidate_name
    FROM interviews i
    JOIN matches m ON i.match_id = m.id
    JOIN job_descriptions jd ON m.job_description_id = jd.id
    JOIN resumes r ON m.resume_id = r.id
    JOIN resume_summaries rs ON r.id = rs.resume_id
    WHERE jd.recruiter_id = ? AND i.status = 'scheduled' AND i.scheduled_time > CURRENT_TIMESTAMP
    ORDER BY i.scheduled_time ASC
  `).bind(recruiterId).all()
}

export async function getUpcomingInterviewsByCandidateId(db: D1Database, candidateId: string) {
  return await db.prepare(`
    SELECT i.*, m.id as match_id, jd.title, jd.company, jd.location
    FROM interviews i
    JOIN matches m ON i.match_id = m.id
    JOIN job_descriptions jd ON m.job_description_id = jd.id
    JOIN resumes r ON m.resume_id = r.id
    WHERE r.candidate_id = ? AND i.status = 'scheduled' AND i.scheduled_time > CURRENT_TIMESTAMP
    ORDER BY i.scheduled_time ASC
  `).bind(candidateId).all()
}

// Email notification functions
export async function createEmailNotification(db: D1Database, emailData: {
  recipientId: string;
  subject: string;
  body: string;
  type: 'interview_invitation' | 'status_update' | 'reminder';
  relatedEntityId: string;
}): Promise<string> {
  const id = generateId()
  
  await db.prepare(`
    INSERT INTO email_notifications (id, recipient_id, subject, body, type, related_entity_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    emailData.recipientId,
    emailData.subject,
    emailData.body,
    emailData.type,
    emailData.relatedEntityId
  ).run()
  
  return id
}

export async function markEmailAsSent(db: D1Database, emailId: string) {
  await db.prepare(`
    UPDATE email_notifications
    SET status = 'sent', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(emailId).run()
}

export async function getPendingEmails(db: D1Database) {
  return await db.prepare(`
    SELECT * FROM email_notifications WHERE status = 'pending' ORDER BY created_at ASC
  `).all()
}
