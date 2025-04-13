'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">AI Recruitment Match</h3>
            <p className="text-sm text-foreground/70">
              Matching the right candidates with the right jobs using advanced AI technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Recruiters</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/recruiter/signup" className="text-foreground/70 hover:text-foreground">
                  Sign Up as Recruiter
                </Link>
              </li>
              <li>
                <Link href="/recruiter/jobs" className="text-foreground/70 hover:text-foreground">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-foreground/70 hover:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Candidates</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/candidate/signup" className="text-foreground/70 hover:text-foreground">
                  Sign Up as Candidate
                </Link>
              </li>
              <li>
                <Link href="/candidate/upload" className="text-foreground/70 hover:text-foreground">
                  Upload Your Resume
                </Link>
              </li>
              <li>
                <Link href="/candidate/matches" className="text-foreground/70 hover:text-foreground">
                  Find Matching Jobs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-foreground/70 hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/70 hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-foreground/70 hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/70 hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-foreground/70">
          <p>© {currentYear} AI Recruitment Match. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
