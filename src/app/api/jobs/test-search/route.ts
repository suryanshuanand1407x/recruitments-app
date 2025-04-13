import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sampleCandidate = {
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc',
      duration: '3 years'
    },
    {
      title: 'Full Stack Developer',
      company: 'Web Apps Co',
      duration: '2 years'
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      institution: 'University of Technology'
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    // Sample candidate profile
    const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript'];
    const experience = '5 years of full-stack development experience';
    const education = 'Bachelor\'s in Computer Science';

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
      const jobs = JSON.parse(response);
      return NextResponse.json({ jobs });
    } catch (error) {
      console.error('Error parsing ChatGPT response:', error);
      return NextResponse.json(
        { error: 'Failed to parse job search results' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in job search test:', error);
    return NextResponse.json(
      { error: 'Failed to test job search' },
      { status: 500 }
    );
  }
} 