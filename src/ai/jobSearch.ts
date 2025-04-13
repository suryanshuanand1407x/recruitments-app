import OpenAI from 'openai';

// Initialize OpenAI client only on the server side
const openai = typeof window === 'undefined' 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export interface JobSearchResult {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  employmentType: string;
  matchScore: number;
}

export async function searchJobsWithChatGPT(
  skills: string[],
  experience: string,
  education: string
): Promise<JobSearchResult[]> {
  if (!openai) {
    throw new Error('OpenAI client is not available in browser environment');
  }

  try {
    const prompt = `Based on the following candidate profile:
Skills: ${skills.join(', ')}
Experience: ${experience}
Education: ${education}

Please suggest relevant job opportunities. For each job, provide:
1. Job title
2. Company name
3. Location
4. Job description
5. Key requirements
6. Salary range
7. Employment type
8. Match score (0-100)

Format the response as a JSON array of job objects.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful job search assistant. Provide relevant job opportunities based on the candidate's profile."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from ChatGPT');
    }

    try {
      const jobs = JSON.parse(response) as JobSearchResult[];
      return jobs;
    } catch (error) {
      console.error('Error parsing ChatGPT response:', error);
      return getMockJobResults(skills);
    }
  } catch (error) {
    console.error('Error in job search:', error);
    return getMockJobResults(skills);
  }
}

function getMockJobResults(skills: string[]): JobSearchResult[] {
  // Generate mock job results based on skills
  return [
    {
      title: `Senior ${skills[0]} Developer`,
      company: 'TechCorp Inc.',
      location: 'Remote',
      description: `Looking for a skilled ${skills[0]} developer to join our team.`,
      requirements: skills,
      salary: '$100,000 - $150,000',
      employmentType: 'Full-time',
      matchScore: 85
    },
    {
      title: `${skills[0]} Engineer`,
      company: 'Innovate Solutions',
      location: 'San Francisco, CA',
      description: `Seeking an experienced ${skills[0]} engineer for our growing team.`,
      requirements: skills,
      salary: '$90,000 - $130,000',
      employmentType: 'Full-time',
      matchScore: 75
    }
  ];
} 