import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface SigninRequest {
  email: string
  password: string
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as SigninRequest

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Auth error:', authError)
      
      if (authError.message === 'Email not confirmed') {
        return NextResponse.json(
          { error: 'Please confirm your email before signing in' },
          { status: 401 }
        )
      }
      
      if (authError.message === 'Invalid login credentials') {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    // Set session cookie
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: authData.session?.access_token || '',
      refresh_token: authData.session?.refresh_token || '',
    })

    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json(
        { error: 'Failed to set session' },
        { status: 500 }
      )
    }

    // Return success response with user data
    return NextResponse.json({
      message: 'Sign in successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        userType: authData.user.user_metadata.user_type,
        ...profileData
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    )
  }
} 