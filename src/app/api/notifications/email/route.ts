'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createEmailNotification, markEmailAsSent } from '@/lib/db'
import { sendInterviewInvitation, sendStatusUpdateEmail, sendInterviewReminderEmail } from '@/lib/email/emailService'

export async function POST(request: NextRequest) {
  try {
    const { 
      type, 
      recipientId, 
      recipientEmail, 
      recipientName,
      jobTitle,
      companyName,
      interviewDate,
      interviewTime,
      interviewLocation,
      status,
      additionalInfo,
      recruiterName,
      recruiterEmail,
      relatedEntityId
    } = await request.json()

    // Validate input
    if (!type || !recipientId || !recipientEmail || !recipientName || !relatedEntityId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create email notification record in database
    const db = request.env?.DB
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Generate email content based on type
    let emailResult
    let subject
    let body

    switch (type) {
      case 'interview_invitation':
        if (!jobTitle || !companyName || !interviewDate || !interviewTime || !interviewLocation || !recruiterName) {
          return NextResponse.json(
            { error: 'Missing required fields for interview invitation' },
            { status: 400 }
          )
        }

        emailResult = await sendInterviewInvitation({
          candidateEmail: recipientEmail,
          candidateName: recipientName,
          jobTitle,
          companyName,
          interviewDate,
          interviewTime,
          interviewLocation,
          recruiterName,
          recruiterEmail
        })

        subject = `Interview Invitation: ${jobTitle} at ${companyName}`
        body = `You have been invited to an interview for the ${jobTitle} position at ${companyName} on ${interviewDate} at ${interviewTime}.`
        break

      case 'status_update':
        if (!jobTitle || !companyName || !status || !recruiterName) {
          return NextResponse.json(
            { error: 'Missing required fields for status update' },
            { status: 400 }
          )
        }

        emailResult = await sendStatusUpdateEmail({
          candidateEmail: recipientEmail,
          candidateName: recipientName,
          jobTitle,
          companyName,
          status,
          additionalInfo,
          recruiterName
        })

        subject = `Application Status Update: ${jobTitle} at ${companyName}`
        body = `Your application status for the ${jobTitle} position at ${companyName} has been updated to: ${status}.`
        break

      case 'reminder':
        if (!jobTitle || !companyName || !interviewDate || !interviewTime || !interviewLocation || !recruiterName) {
          return NextResponse.json(
            { error: 'Missing required fields for interview reminder' },
            { status: 400 }
          )
        }

        // Calculate hours until interview
        const interviewDateTime = new Date(`${interviewDate}T${interviewTime}`)
        const hoursUntilInterview = Math.round((interviewDateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60))

        emailResult = await sendInterviewReminderEmail({
          candidateEmail: recipientEmail,
          candidateName: recipientName,
          jobTitle,
          companyName,
          interviewDate,
          interviewTime,
          interviewLocation,
          recruiterName,
          hoursUntilInterview
        })

        subject = `Reminder: Your Interview for ${jobTitle} at ${companyName}`
        body = `This is a reminder that your interview for the ${jobTitle} position at ${companyName} is scheduled on ${interviewDate} at ${interviewTime}.`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid email notification type' },
          { status: 400 }
        )
    }

    // Create notification record in database
    const notificationId = await createEmailNotification(db, {
      recipientId,
      subject,
      body,
      type,
      relatedEntityId
    })

    // If email was sent successfully, mark as sent
    if (emailResult.success) {
      await markEmailAsSent(db, notificationId)
    }

    return NextResponse.json({
      id: notificationId,
      success: emailResult.success,
      messageId: emailResult.messageId,
      message: 'Email notification sent successfully'
    })
  } catch (error) {
    console.error('Email notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send email notification' },
      { status: 500 }
    )
  }
}
