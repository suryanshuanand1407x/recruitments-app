/**
 * Shortlisting Algorithm
 * 
 * This module implements the candidate ranking and shortlisting algorithm
 * based on match scores and additional criteria.
 */

interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  skills: string[];
  experience: any[];
  education: any[];
  matchedSkills: string[];
}

interface ShortlistOptions {
  minMatchScore?: number;
  maxCandidates?: number;
  requiredSkills?: string[];
  minExperienceYears?: number;
}

/**
 * Shortlist candidates based on match scores and additional criteria
 */
export function shortlistCandidates(
  candidates: Candidate[],
  options: ShortlistOptions = {}
): Candidate[] {
  // Set default options
  const {
    minMatchScore = 0.7, // 70% match threshold by default
    maxCandidates = 10,
    requiredSkills = [],
    minExperienceYears = 0
  } = options;

  // Filter candidates by minimum match score
  let filteredCandidates = candidates.filter(candidate => 
    candidate.matchScore >= minMatchScore
  );

  // Filter by required skills if specified
  if (requiredSkills.length > 0) {
    filteredCandidates = filteredCandidates.filter(candidate => {
      const candidateSkills = candidate.skills.map(skill => skill.toLowerCase());
      return requiredSkills.every(skill => 
        candidateSkills.includes(skill.toLowerCase())
      );
    });
  }

  // Filter by minimum experience if specified
  if (minExperienceYears > 0) {
    filteredCandidates = filteredCandidates.filter(candidate => {
      // This is a simplified approach - in a real implementation,
      // we would parse the experience durations more accurately
      const totalExperience = estimateTotalExperience(candidate.experience);
      return totalExperience >= minExperienceYears;
    });
  }

  // Sort by match score in descending order
  filteredCandidates.sort((a, b) => b.matchScore - a.matchScore);

  // Limit to maximum number of candidates
  return filteredCandidates.slice(0, maxCandidates);
}

/**
 * Estimate total years of experience from experience entries
 * This is a simplified implementation
 */
function estimateTotalExperience(experience: any[]): number {
  let totalYears = 0;

  for (const exp of experience) {
    if (exp.duration) {
      // Try to extract years from duration strings like "2018 - 2021" or "3 years"
      const yearMatch = exp.duration.match(/(\d{4})\s*-\s*(\d{4}|present|current)/i);
      if (yearMatch) {
        const startYear = parseInt(yearMatch[1]);
        const endYear = yearMatch[2].toLowerCase() === 'present' || 
                        yearMatch[2].toLowerCase() === 'current' 
                        ? new Date().getFullYear() 
                        : parseInt(yearMatch[2]);
        totalYears += endYear - startYear;
      } else {
        const directYearsMatch = exp.duration.match(/(\d+)\s*(?:years|yrs|year)/i);
        if (directYearsMatch) {
          totalYears += parseInt(directYearsMatch[1]);
        }
      }
    }
  }

  return totalYears;
}

/**
 * Calculate a weighted match score based on multiple factors
 */
export function calculateWeightedScore(
  candidate: Candidate,
  jobRequirements: {
    keySkills: string[];
    requiredExperience: string;
    educationRequirements: string;
  }
): number {
  // Base score from embedding similarity
  let score = candidate.matchScore;

  // Weight for matched skills (up to 20% boost)
  const skillMatchRatio = candidate.matchedSkills.length / jobRequirements.keySkills.length;
  score += skillMatchRatio * 0.2;

  // Weight for experience match (up to 10% boost)
  const requiredYears = parseInt(jobRequirements.requiredExperience.match(/\d+/)?.[0] || '0');
  if (requiredYears > 0) {
    const candidateYears = estimateTotalExperience(candidate.experience);
    const experienceRatio = Math.min(candidateYears / requiredYears, 1.5);
    score += (experienceRatio / 1.5) * 0.1;
  }

  // Cap the score at 1.0
  return Math.min(score, 1.0);
}
