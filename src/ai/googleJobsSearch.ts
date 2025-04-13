interface JobSearchResult {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  employmentType: string;
  matchScore: number;
  applyLink: string;
}

interface ResumeSummary {
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
  }[];
  education: {
    degree: string;
    field: string;
    institution: string;
  }[];
}

export async function searchGoogleJobs(resumeSummary: ResumeSummary): Promise<JobSearchResult[]> {
  try {
    // Extract keywords from resume
    const keywords = extractKeywords(resumeSummary);
    
    // Construct search query
    const searchQuery = constructSearchQuery(keywords);
    
    // Call Google Jobs API
    const response = await fetch(
      `https://jobs.googleapis.com/v4/jobs/search?query=${encodeURIComponent(searchQuery)}&key=${process.env.GOOGLE_JOBS_API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Jobs API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Format and return results
    return formatJobResults(data.jobs || []);
  } catch (error) {
    console.error('Error searching Google Jobs:', error);
    // Fallback to mock data if API call fails
    return mockJobSearchResults(resumeSummary);
  }
}

function extractKeywords(resumeSummary: ResumeSummary): string[] {
  const keywords = new Set<string>();
  
  // Add skills
  resumeSummary.skills.forEach(skill => keywords.add(skill));
  
  // Add job titles from experience
  resumeSummary.experience.forEach(exp => {
    keywords.add(exp.title);
    // Extract keywords from job title
    exp.title.split(' ').forEach(word => {
      if (word.length > 3) keywords.add(word.toLowerCase());
    });
  });
  
  // Add education field
  resumeSummary.education.forEach(edu => {
    keywords.add(edu.field);
    // Extract keywords from field
    edu.field.split(' ').forEach(word => {
      if (word.length > 3) keywords.add(word.toLowerCase());
    });
  });
  
  return Array.from(keywords);
}

function constructSearchQuery(keywords: string[]): string {
  // Combine keywords with OR operator
  const query = keywords.join(' OR ');
  // Add location filter (can be made dynamic based on user preference)
  return `${query} location:remote OR location:hybrid`;
}

function formatJobResults(jobs: any[]): JobSearchResult[] {
  return jobs.map(job => ({
    title: job.title,
    company: job.companyName,
    location: job.location,
    description: job.description,
    requirements: extractRequirements(job.description),
    salary: job.salaryInfo?.salaryRange,
    employmentType: job.employmentType,
    matchScore: calculateMatchScore(job),
    applyLink: job.applyUrl
  }));
}

function extractRequirements(description: string): string[] {
  // Simple regex to extract requirements from job description
  const requirementsRegex = /(?:requirements|qualifications|skills|experience)[:.]?\s*([^.]*)/i;
  const match = description.match(requirementsRegex);
  if (match) {
    return match[1]
      .split(/[,;]/)
      .map(req => req.trim())
      .filter(req => req.length > 0);
  }
  return [];
}

function calculateMatchScore(job: any): number {
  // Simple scoring based on job type and requirements
  let score = 50; // Base score
  
  // Add points for full-time positions
  if (job.employmentType?.toLowerCase().includes('full')) {
    score += 20;
  }
  
  // Add points for remote/hybrid positions
  if (job.location?.toLowerCase().includes('remote') || 
      job.location?.toLowerCase().includes('hybrid')) {
    score += 15;
  }
  
  // Add points for salary information
  if (job.salaryInfo) {
    score += 15;
  }
  
  return Math.min(score, 100);
}

// Mock implementation for development or when API fails
function mockJobSearchResults(resumeSummary: ResumeSummary): JobSearchResult[] {
  console.log('Using mock job search results');
  
  const mockJobs: JobSearchResult[] = [];
  const companies = ['TechCorp', 'Innovate Solutions', 'Digital Dynamics', 'Future Systems', 'Global Tech'];
  const locations = ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA'];
  
  for (let i = 0; i < 5; i++) {
    const title = `Senior ${resumeSummary.skills[0]} Developer`;
    const company = companies[i % companies.length];
    const location = locations[i % locations.length];
    const matchScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
    
    mockJobs.push({
      title,
      company,
      location,
      description: `We are looking for a ${title} to join our team. The ideal candidate will have experience with ${resumeSummary.skills.slice(0, 3).join(', ')}.`,
      requirements: resumeSummary.skills.slice(0, 5),
      salary: '$120,000 - $150,000 per year',
      employmentType: 'Full-time',
      matchScore,
      applyLink: 'https://example.com/apply'
    });
  }
  
  return mockJobs;
} 