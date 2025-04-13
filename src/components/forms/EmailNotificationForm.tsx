'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CalendarIcon, CheckCircle2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

export default function EmailNotificationForm({ 
  candidateId,
  candidateName,
  candidateEmail,
  jobTitle,
  companyName,
  type = 'interview_invitation',
  onSend
}) {
  const [notificationType, setNotificationType] = useState(type)
  const [interviewDate, setInterviewDate] = useState(new Date())
  const [interviewTime, setInterviewTime] = useState('10:00')
  const [interviewLocation, setInterviewLocation] = useState('Video Call (Zoom)')
  const [status, setStatus] = useState('shortlisted')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [recruiterName, setRecruiterName] = useState('Alex Recruiter')
  const [recruiterEmail, setRecruiterEmail] = useState('recruiter@example.com')
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)
    setError('')
    setSendSuccess(false)

    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate a successful API call
      console.log('Sending email notification:', {
        type: notificationType,
        recipientId: candidateId,
        recipientEmail: candidateEmail,
        recipientName: candidateName,
        jobTitle,
        companyName,
        interviewDate: format(interviewDate, 'yyyy-MM-dd'),
        interviewTime,
        interviewLocation,
        status,
        additionalInfo,
        recruiterName,
        recruiterEmail,
        relatedEntityId: 'mock-entity-id'
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSendSuccess(true)
      
      if (onSend) {
        onSend({
          type: notificationType,
          status: notificationType === 'status_update' ? status : 'interview_scheduled'
        })
      }
    } catch (err) {
      setError('Failed to send notification. Please try again.')
      console.error('Email notification error:', err)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Email Notification</CardTitle>
        <CardDescription>
          Notify the candidate about their application status or schedule an interview
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 bg-destructive/15">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {sendSuccess && (
          <Alert className="mb-4 bg-green-100">
            <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
            <AlertDescription className="text-green-600">
              Email notification sent successfully!
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification-type">Notification Type</Label>
            <Select 
              value={notificationType} 
              onValueChange={setNotificationType}
            >
              <SelectTrigger id="notification-type">
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interview_invitation">Interview Invitation</SelectItem>
                <SelectItem value="status_update">Status Update</SelectItem>
                <SelectItem value="reminder">Interview Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Candidate</Label>
              <Input value={candidateName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={candidateEmail} disabled />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input value={jobTitle} disabled />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={companyName} disabled />
            </div>
          </div>
          
          {(notificationType === 'interview_invitation' || notificationType === 'reminder') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interview-date">Interview Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="interview-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {interviewDate ? format(interviewDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={interviewDate}
                        onSelect={setInterviewDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interview-time">Interview Time</Label>
                  <Input
                    id="interview-time"
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interview-location">Interview Location</Label>
                <Input
                  id="interview-location"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  placeholder="e.g., Zoom call, Office address, etc."
                />
              </div>
            </>
          )}
          
          {notificationType === 'status_update' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="status">Application Status</Label>
                <Select 
                  value={status} 
                  onValueChange={setStatus}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interviewed">Interviewed</SelectItem>
                    <SelectItem value="rejected">Not Selected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional-info">Additional Information</Label>
                <Textarea
                  id="additional-info"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Any additional information to include in the email..."
                  rows={3}
                />
              </div>
            </>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recruiter-name">Recruiter Name</Label>
              <Input
                id="recruiter-name"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recruiter-email">Recruiter Email</Label>
              <Input
                id="recruiter-email"
                type="email"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Notification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
