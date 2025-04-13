'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createMatch, getMatchesByJobDescriptionId, getMatchesByCandidateId, updateMatchStatus } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { jobDescriptionId, resumeId, score } = await request.json()

    // Validate input
    if (!jobDescriptionId || !resumeId || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (score < 0 || score > 1) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 1' },
        { status: 400 }
      )
    }

    // Create match
    const db = request.env?.DB
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const matchId = await createMatch(db, {
      jobDescriptionId,
      resumeId,
      score
    })

    return NextResponse.json({
      id: matchId,
      jobDescriptionId,
      resumeId,
      score,
      status: 'pending',
      message: 'Match created successfully'
    })
  } catch (error) {
    console.error('Match creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobDescriptionId = searchParams.get('jobDescriptionId')
    const candidateId = searchParams.get('candidateId')

    if (!jobDescriptionId && !candidateId) {
      return NextResponse.json(
        { error: 'Either jobDescriptionId or candidateId is required' },
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

    let matches
    if (jobDescriptionId) {
      matches = await getMatchesByJobDescriptionId(db, jobDescriptionId)
    } else {
      matches = await getMatchesByCandidateId(db, candidateId!)
    }

    return NextResponse.json(matches)
  } catch (error) {
    console.error('Match fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
