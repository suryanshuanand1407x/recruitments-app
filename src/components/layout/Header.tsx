'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            AI Recruitment Match
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-foreground/80 hover:text-foreground">
            Home
          </Link>
          
          {session?.user?.userType === 'recruiter' && (
            <>
              <Link href="/recruiter/dashboard" className="text-foreground/80 hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/recruiter/jobs" className="text-foreground/80 hover:text-foreground">
                Manage Jobs
              </Link>
              <Link href="/recruiter/candidates" className="text-foreground/80 hover:text-foreground">
                Candidates
              </Link>
            </>
          )}
          
          {session?.user?.userType === 'candidate' && (
            <>
              <Link href="/candidate/dashboard" className="text-foreground/80 hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/candidate/profile" className="text-foreground/80 hover:text-foreground">
                My Profile
              </Link>
            </>
          )}
          
          <Link href="/about" className="text-foreground/80 hover:text-foreground">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {!session && !isLoading ? (
            <>
              <Link href="/signin">
                <Button variant="outline">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button>
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <Button variant="outline" onClick={() => signOut()}>
              Log Out
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
