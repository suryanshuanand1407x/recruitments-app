'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/db'
import { cookies } from 'next/headers'
import { generateId } from '@/lib/db'

// In a real app, we would use a proper password hashing library
function hashPassword(password: string): string {
  // This is a placeholder - in production use bcrypt or similar
  return password
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, company } = await request.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (role === 'recruiter' && !company) {
      return NextResponse.json(
        { error: 'Company name is required for recruiters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const db = request.env?.DB
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const existingUser = await getUserByEmail(db, email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user
    const hashedPassword = hashPassword(password)
    const userId = await createUser(db, {
      email,
      password: hashedPassword,
      name,
      role: role as 'recruiter' | 'candidate' | 'admin',
      company
    })

    // Set session cookie
    const sessionId = generateId()
    cookies().set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })

    // Return user data (excluding password)
    return NextResponse.json({
      id: userId,
      name,
      email,
      role,
      company: company || null
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
