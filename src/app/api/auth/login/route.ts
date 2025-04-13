'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/db'
import { cookies } from 'next/headers'
import { generateId } from '@/lib/db'

// In a real app, we would use a proper password verification function
function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  // This is a placeholder - in production use bcrypt or similar
  return inputPassword === storedPassword
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get user from database
    const db = request.env?.DB
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const user = await getUserByEmail(db, email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

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
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company || null
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    )
  }
}
