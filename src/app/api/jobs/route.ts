'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createJobDescription, getJobDescriptionsByRecruiterId } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { title, company, location, description, requirements, responsibilities, salary, employmentType, recruiterId, originalFile } = await request.json()

    // Validate input
    if (!title || !company || !location || !description || !requirements || !responsibilities || !employmentType || !recruiterId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create job description
    const db = request.env?.DB
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const jobId = await createJobDescription(db, {
      title,
      company,
      location,
      description,
      requirements,
      responsibilities,
      salary,
      employmentType,
      recruiterId,
      originalFile
    })

    return NextResponse.json({
      id: jobId,
      title,
      company,
      location,
      status: 'active',
      message: 'Job description created successfully'
    })
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create job description' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recruiterId = searchParams.get('recruiterId')

    if (!recruiterId) {
      return NextResponse.json(
        { error: 'Recruiter ID is required' },
        { status: 400 }
      )
    }

    const db = request.env?.DB
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const jobs = await getJobDescriptionsByRecruiterId(db, recruiterId)
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Job fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job descriptions' },
      { status: 500 }
    )
  }
}
