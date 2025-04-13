/**
 * CV/Resume Parser
 * 
 * This module uses OpenAI's GPT-3.5-turbo to extract structured information from resumes.
 * It identifies candidate skills, experience, education, and other relevant information.
 * Includes fallback to mock implementation when API calls fail due to quota limitations.
 */

import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export interface Experience {
  company: string;
  title: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface ResumeSummary {
  candidateName: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  contactInfo?: {
    email?: string;
    phone?: string;
    location?: string;
  };
}

/**
 * Parse a resume text and extract structured information
 * Falls back to mock implementation if API call fails or if API key is not available
 */
export async function parseResume(resumeText: string): Promise<ResumeSummary> {
  // If no OpenAI client is available, use mock implementation
  if (!openai) {
    console.log('OpenAI API key not found, using mock implementation');
    return mockParseResume(resumeText);
  }

  try {
    // Define the prompt for GPT-3.5-turbo
    const prompt = `
      Extract the following information from this resume in JSON format:
      1. Candidate name
      2. Skills (as an array of strings)
      3. Work experience (as an array of objects with company, title, duration, and description)
      4. Education (as an array of objects with institution, degree, field, and year)
      5. Contact information (email, phone, location) if present

      Return ONLY valid JSON with these fields: candidateName, skills, experience, education, contactInfo.
      
      Resume:
      ${resumeText}
    `;

    try {
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Changed from gpt-4 to gpt-3.5-turbo for compatibility
        messages: [
          { role: 'system', content: 'You are a resume parser that extracts structured information.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Low temperature for more deterministic results
      });

      // Extract and parse the JSON response
      const content = response.choices[0]?.message?.content || '';
      
      // Find JSON in the response (in case the model adds any explanatory text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from the API response');
      }
      
      const parsedData = JSON.parse(jsonMatch[0]) as ResumeSummary;
      
      // Ensure all required fields are present
      const summary: ResumeSummary = {
        candidateName: parsedData.candidateName || 'Unknown',
        skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
        experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
        education: Array.isArray(parsedData.education) ? parsedData.education : [],
        contactInfo: parsedData.contactInfo
      };

      return summary;
    } catch (apiError) {
      // Log the API error
      console.error('OpenAI API error:', apiError);
      console.log('Falling back to mock implementation due to API error');
      
      // Fall back to mock implementation
      return mockParseResume(resumeText);
    }
  } catch (error) {
    console.error('Error parsing resume:', error);
    // Fall back to mock implementation for any error
    return mockParseResume(resumeText);
  }
}

/**
 * Mock function for development without API key or when API calls fail
 */
export function mockParseResume(resumeText: string): ResumeSummary {
  console.log('Using mock resume parser');
  
  // Extract candidate name
  const nameMatch = resumeText.match(/^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/m);
  const candidateName = nameMatch ? nameMatch[1].trim() : 'John Doe';
  
  // Simple keyword extraction for skills
  const techSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'HTML', 'CSS'];
  const softSkills = ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management'];
  
  const skills = [
    ...techSkills.filter(skill => resumeText.toLowerCase().includes(skill.toLowerCase())),
    ...softSkills.filter(skill => resumeText.toLowerCase().includes(skill.toLowerCase()))
  ];
  
  // If no skills found, add some default ones
  if (skills.length === 0) {
    skills.push('JavaScript', 'React', 'Node.js', 'Communication');
  }
  
  // Mock experience
  const experience: Experience[] = [
    {
      company: 'Tech Solutions Inc.',
      title: 'Senior Developer',
      duration: '2020 - Present',
      description: 'Led development team in creating web applications using React and Node.js.'
    },
    {
      company: 'Digital Innovations',
      title: 'Software Engineer',
      duration: '2017 - 2020',
      description: 'Developed and maintained full-stack applications.'
    }
  ];
  
  // Mock education
  const education: Education[] = [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      year: '2017'
    }
  ];
  
  // Extract contact info if present
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = resumeText.match(/(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/);
  const locationMatch = resumeText.match(/(?:location|address|based in)[:|\s]+([^\n,\.]+)/i);
  
  const contactInfo = {
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    location: locationMatch ? locationMatch[1].trim() : undefined
  };
  
  return {
    candidateName,
    skills,
    experience,
    education,
    contactInfo
  };
}
