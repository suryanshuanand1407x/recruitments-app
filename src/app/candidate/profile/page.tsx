'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  // Only allow access to users with userType 'candidate'
  if (session?.user?.userType !== 'candidate') {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and manage your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg">{session?.user?.email}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
            <p className="text-lg capitalize">{session?.user?.userType}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p className="text-lg">{session?.user?.name || 'Not set'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 