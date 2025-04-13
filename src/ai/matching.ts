/**
 * Matching Engine
 * 
 * This module implements the matching algorithm between job descriptions and resumes
 * using text embeddings and cosine similarity.
 */

import { SentenceTransformer } from 'sentence-transformers';

// Initialize the sentence transformer model
// In production, this would load the model from a proper path
let model: SentenceTransformer;

// Interface for embedding vectors
interface Embedding {
  vector: number[];
  text: string;
}

/**
 * Initialize the embedding model
 */
export async function initializeModel() {
  try {
    // In a real implementation, this would load the model
    // For now, we'll use a mock implementation
    console.log('Initializing sentence transformer model...');
    model = {} as SentenceTransformer;
    return true;
  } catch (error) {
    console.error('Error initializing embedding model:', error);
    return false;
  }
}

/**
 * Generate embeddings for text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    if (!model) {
      await initializeModel();
    }
    
    // In a real implementation, this would call the model to generate embeddings
    // For now, we'll use a mock implementation that returns random vectors
    return mockGenerateEmbedding(text);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Mock function to generate embeddings
 */
function mockGenerateEmbedding(text: string): number[] {
  // Generate a deterministic but unique vector based on the text
  // This is just for demonstration purposes
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const vector = [];
  for (let i = 0; i < 384; i++) { // Using 384 dimensions like all-MiniLM-L6-v2
    // Generate a value between -1 and 1 based on the seed and position
    vector.push(Math.sin(seed * (i + 1) * 0.01) * 0.5);
  }
  return vector;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Match a job description with multiple resumes
 */
export async function matchJobWithResumes(
  jobDescription: { id: string; title: string; keySkills: string[]; description: string },
  resumes: Array<{ id: string; candidateName: string; skills: string[]; experience: any[]; education: any[] }>
): Promise<Array<{ resumeId: string; candidateName: string; score: number; matchedSkills: string[] }>> {
  try {
    // Create a combined text representation of the job
    const jobText = `${jobDescription.title}. Required skills: ${jobDescription.keySkills.join(', ')}. ${jobDescription.description}`;
    
    // Generate embedding for the job
    const jobEmbedding = await generateEmbedding(jobText);
    
    // Process each resume
    const matches = await Promise.all(resumes.map(async (resume) => {
      // Create a combined text representation of the resume
      const resumeText = `${resume.candidateName}. Skills: ${resume.skills.join(', ')}. Experience: ${
        resume.experience.map(exp => `${exp.title} at ${exp.company}`).join(', ')
      }. Education: ${
        resume.education.map(edu => `${edu.degree} in ${edu.field} from ${edu.institution}`).join(', ')
      }`;
      
      // Generate embedding for the resume
      const resumeEmbedding = await generateEmbedding(resumeText);
      
      // Calculate similarity score
      const score = cosineSimilarity(jobEmbedding, resumeEmbedding);
      
      // Find matched skills
      const matchedSkills = resume.skills.filter(skill => 
        jobDescription.keySkills.some(jobSkill => 
          jobSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      
      return {
        resumeId: resume.id,
        candidateName: resume.candidateName,
        score,
        matchedSkills
      };
    }));
    
    // Sort by score in descending order
    return matches.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error matching job with resumes:', error);
    throw new Error('Failed to match job with resumes');
  }
}

/**
 * Match a resume with multiple job descriptions
 */
export async function matchResumeWithJobs(
  resume: { id: string; candidateName: string; skills: string[]; experience: any[]; education: any[] },
  jobDescriptions: Array<{ id: string; title: string; keySkills: string[]; description: string }>
): Promise<Array<{ jobId: string; title: string; score: number; matchedSkills: string[] }>> {
  try {
    // Create a combined text representation of the resume
    const resumeText = `${resume.candidateName}. Skills: ${resume.skills.join(', ')}. Experience: ${
      resume.experience.map(exp => `${exp.title} at ${exp.company}`).join(', ')
    }. Education: ${
      resume.education.map(edu => `${edu.degree} in ${edu.field} from ${edu.institution}`).join(', ')
    }`;
    
    // Generate embedding for the resume
    const resumeEmbedding = await generateEmbedding(resumeText);
    
    // Process each job
    const matches = await Promise.all(jobDescriptions.map(async (job) => {
      // Create a combined text representation of the job
      const jobText = `${job.title}. Required skills: ${job.keySkills.join(', ')}. ${job.description}`;
      
      // Generate embedding for the job
      const jobEmbedding = await generateEmbedding(jobText);
      
      // Calculate similarity score
      const score = cosineSimilarity(resumeEmbedding, jobEmbedding);
      
      // Find matched skills
      const matchedSkills = resume.skills.filter(skill => 
        job.keySkills.some(jobSkill => 
          jobSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      
      return {
        jobId: job.id,
        title: job.title,
        score,
        matchedSkills
      };
    }));
    
    // Sort by score in descending order
    return matches.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error matching resume with jobs:', error);
    throw new Error('Failed to match resume with jobs');
  }
}
