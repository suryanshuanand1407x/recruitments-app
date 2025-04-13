'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createResume, getResumesByCandidateId } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { candidateId, originalFile, fileName, fileType } = await request.json()

    // Validate input
    if (!candidateId || !originalFile || !fileName || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create resume entry
    const db = request.env?.DB
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const resumeId = await createResume(db, {
      candidateId,
      originalFile,
      fileName,
      fileType
    })

    return NextResponse.json({
      id: resumeId,
      fileName,
      fileType,
      message: 'Resume uploaded successfully'
    })
  } catch (error) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get('candidateId')

    if (!candidateId) {
      return NextResponse.json(
        { error: 'Candidate ID is required' },
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

    const resumes = await getResumesByCandidateId(db, candidateId)
    return NextResponse.json(resumes)
  } catch (error) {
    console.error('Resume fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}
