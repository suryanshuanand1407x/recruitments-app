'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createInterview, getInterviewsByMatchId, getUpcomingInterviewsByRecruiterId, getUpcomingInterviewsByCandidateId } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { matchId, scheduledTime, duration, location } = await request.json()

    // Validate input
    if (!matchId || !scheduledTime || !duration || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate scheduled time is in the future
    const scheduledDate = new Date(scheduledTime)
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future' },
        { status: 400 }
      )
    }

    // Create interview
    const db = request.env?.DB
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const interviewId = await createInterview(db, {
      matchId,
      scheduledTime,
      duration,
      location
    })

    return NextResponse.json({
      id: interviewId,
      matchId,
      scheduledTime,
      duration,
      location,
      status: 'scheduled',
      message: 'Interview scheduled successfully'
    })
  } catch (error) {
    console.error('Interview scheduling error:', error)
    return NextResponse.json(
      { error: 'Failed to schedule interview' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')
    const recruiterId = searchParams.get('recruiterId')
    const candidateId = searchParams.get('candidateId')

    if (!matchId && !recruiterId && !candidateId) {
      return NextResponse.json(
        { error: 'Either matchId, recruiterId, or candidateId is required' },
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

    let interviews
    if (matchId) {
      interviews = await getInterviewsByMatchId(db, matchId)
    } else if (recruiterId) {
      interviews = await getUpcomingInterviewsByRecruiterId(db, recruiterId)
    } else {
      interviews = await getUpcomingInterviewsByCandidateId(db, candidateId!)
    }

    return NextResponse.json(interviews)
  } catch (error) {
    console.error('Interview fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    )
  }
}
