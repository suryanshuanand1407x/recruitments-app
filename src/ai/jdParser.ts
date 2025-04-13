/**
 * Job Description Parser
 * 
 * This module uses OpenAI's GPT-3.5-turbo to extract structured information from job descriptions.
 * It identifies key skills, requirements, responsibilities, and other relevant information.
 * Includes fallback to mock implementation when API calls fail due to quota limitations.
 */

import OpenAI from 'openai';

// Initialize OpenAI client
// In production, API key should be stored in environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-development',
});

interface JDSummary {
  title: string;
  keySkills: string[];
  requiredExperience: string;
  educationRequirements: string;
  responsibilities: string[];
  employmentType: string;
  location: string;
  salaryRange?: string;
}

/**
 * Parse a job description text and extract structured information
 * Falls back to mock implementation if API call fails
 */
export async function parseJobDescription(jdText: string): Promise<JDSummary> {
  try {
    // Define the prompt for GPT-3.5-turbo
    const prompt = `
      Extract the following information from this job description in JSON format:
      1. Job title
      2. Key skills required (as an array of strings)
      3. Required years of experience
      4. Education requirements
      5. Key responsibilities (as an array of strings)
      6. Employment type (full-time, part-time, contract)
      7. Location (remote, hybrid, or office location)
      8. Salary range (if mentioned)

      Return ONLY valid JSON with these fields: title, keySkills, requiredExperience, educationRequirements, responsibilities, employmentType, location, salaryRange.
      
      Job Description:
      ${jdText}
    `;

    try {
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Changed from gpt-4 to gpt-3.5-turbo for compatibility
        messages: [
          { role: 'system', content: 'You are a job description parser that extracts structured information.' },
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
      
      const parsedData = JSON.parse(jsonMatch[0]) as JDSummary;
      
      // Ensure all required fields are present
      const summary: JDSummary = {
        title: parsedData.title || 'Unknown Title',
        keySkills: Array.isArray(parsedData.keySkills) ? parsedData.keySkills : [],
        requiredExperience: parsedData.requiredExperience || 'Not specified',
        educationRequirements: parsedData.educationRequirements || 'Not specified',
        responsibilities: Array.isArray(parsedData.responsibilities) ? parsedData.responsibilities : [],
        employmentType: parsedData.employmentType || 'Not specified',
        location: parsedData.location || 'Not specified',
        salaryRange: parsedData.salaryRange
      };

      return summary;
    } catch (apiError) {
      // Log the API error
      console.error('OpenAI API error:', apiError);
      console.log('Falling back to mock implementation due to API error');
      
      // Fall back to mock implementation
      return mockParseJobDescription(jdText);
    }
  } catch (error) {
    console.error('Error parsing job description:', error);
    // Fall back to mock implementation for any error
    return mockParseJobDescription(jdText);
  }
}

/**
 * Mock function for development without API key or when API calls fail
 */
export function mockParseJobDescription(jdText: string): JDSummary {
  console.log('Using mock job description parser');
  
  // Extract job title from the first few lines
  const titleMatch = jdText.match(/(?:job title|position|role)[:|\s]+([^\n]+)/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Software Developer';
  
  // Simple keyword extraction for skills
  const techSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker'];
  const keySkills = techSkills.filter(skill => 
    jdText.toLowerCase().includes(skill.toLowerCase())
  );
  
  // If no skills found, add some default ones
  if (keySkills.length === 0) {
    keySkills.push('Communication', 'Problem Solving', 'Teamwork');
  }
  
  // Extract experience requirement
  const expMatch = jdText.match(/(\d+)[\+\s]*(?:years|yrs)/i);
  const requiredExperience = expMatch ? `${expMatch[1]}+ years` : '3+ years';
  
  // Extract education
  const eduMatch = jdText.match(/(?:degree|bachelor|master|phd|bs|ms)[\s\w]+(?:in|of)[\s\w]+(?:computer|software|information|engineering|science|business)/i);
  const educationRequirements = eduMatch ? eduMatch[0].trim() : "Bachelor's degree in Computer Science or related field";
  
  // Default responsibilities
  const responsibilities = [
    "Develop and maintain software applications",
    "Collaborate with cross-functional teams",
    "Write clean, efficient, and maintainable code",
    "Participate in code reviews and testing"
  ];
  
  // Extract employment type
  const employmentTypeMatch = jdText.match(/full[\s-]*time|part[\s-]*time|contract/i);
  const employmentType = employmentTypeMatch ? employmentTypeMatch[0].trim() : 'Full-time';
  
  // Extract location
  const locationMatch = jdText.match(/(?:location|based in|position is in)[:|\s]+([^\n,\.]+)/i);
  const remoteMatch = jdText.match(/remote|work from home|wfh/i);
  const location = locationMatch ? locationMatch[1].trim() : (remoteMatch ? 'Remote' : 'On-site');
  
  // Extract salary if present
  const salaryMatch = jdText.match(/\$[\d,]+\s*-\s*\$[\d,]+|\$[\d,]+\s*per\s*(?:year|annum|yr)/i);
  const salaryRange = salaryMatch ? salaryMatch[0].trim() : undefined;
  
  return {
    title,
    keySkills,
    requiredExperience,
    educationRequirements,
    responsibilities,
    employmentType,
    location,
    salaryRange
  };
}
