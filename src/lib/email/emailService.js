/**
 * Email Service Integration
 * 
 * This module provides functionality to send emails using the Resend API.
 * It includes methods for sending interview invitations, status updates, and reminders.
 */

// In a real implementation, we would use the Resend SDK
// import { Resend } from 'resend';

// Mock Resend client for development
class MockResend {
  constructor() {
    this.emails = {
      send: async (options) => {
        console.log('Sending email with options:', options);
        return { id: 'mock_email_id_' + Date.now(), data: options };
      }
    };
  }
}

// Initialize Resend client
// In production, API key should be stored in environment variables
// const resend = new Resend(process.env.RESEND_API_KEY || 'mock_api_key');
const resend = new MockResend();

/**
 * Send an email using the Resend API
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = 'AI Recruitment Match <notifications@airecruitmentmatch.com>'
}) {
  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html
    });
    
    return {
      success: true,
      messageId: result.id
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send an interview invitation email to a candidate
 */
export async function sendInterviewInvitation({
  candidateEmail,
  candidateName,
  jobTitle,
  companyName,
  interviewDate,
  interviewTime,
  interviewLocation,
  recruiterName,
  recruiterEmail
}) {
  const subject = `Interview Invitation: ${jobTitle} at ${companyName}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Interview Invitation</h2>
      <p>Dear ${candidateName},</p>
      <p>Congratulations! Your profile has been shortlisted for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Interview Details</h3>
        <p><strong>Date:</strong> ${interviewDate}</p>
        <p><strong>Time:</strong> ${interviewTime}</p>
        <p><strong>Location:</strong> ${interviewLocation}</p>
      </div>
      
      <p>Please confirm your availability by replying to this email or contacting ${recruiterName} directly at ${recruiterEmail}.</p>
      
      <p>We look forward to speaking with you!</p>
      
      <p>Best regards,<br>${recruiterName}<br>${companyName}</p>
    </div>
  `;
  
  return await sendEmail({
    to: candidateEmail,
    subject,
    html
  });
}

/**
 * Send an application status update email to a candidate
 */
export async function sendStatusUpdateEmail({
  candidateEmail,
  candidateName,
  jobTitle,
  companyName,
  status,
  additionalInfo,
  recruiterName
}) {
  let statusText;
  let statusDescription;
  
  switch (status) {
    case 'shortlisted':
      statusText = 'Application Shortlisted';
      statusDescription = 'Your application has been shortlisted for further consideration.';
      break;
    case 'interviewed':
      statusText = 'Interview Completed';
      statusDescription = 'Thank you for attending the interview. We will be in touch with next steps soon.';
      break;
    case 'rejected':
      statusText = 'Application Update';
      statusDescription = 'After careful consideration, we have decided to proceed with other candidates.';
      break;
    case 'hired':
      statusText = 'Congratulations!';
      statusDescription = 'We are pleased to offer you the position.';
      break;
    default:
      statusText = 'Application Update';
      statusDescription = 'There has been an update to your application.';
  }
  
  const subject = `${statusText}: ${jobTitle} at ${companyName}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${statusText}</h2>
      <p>Dear ${candidateName},</p>
      <p>${statusDescription}</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Application Details</h3>
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
      </div>
      
      ${additionalInfo ? `<p>${additionalInfo}</p>` : ''}
      
      <p>If you have any questions, please don't hesitate to reach out.</p>
      
      <p>Best regards,<br>${recruiterName}<br>${companyName}</p>
    </div>
  `;
  
  return await sendEmail({
    to: candidateEmail,
    subject,
    html
  });
}

/**
 * Send a reminder email for an upcoming interview
 */
export async function sendInterviewReminderEmail({
  candidateEmail,
  candidateName,
  jobTitle,
  companyName,
  interviewDate,
  interviewTime,
  interviewLocation,
  recruiterName,
  hoursUntilInterview
}) {
  const subject = `Reminder: Your Interview for ${jobTitle} at ${companyName}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Interview Reminder</h2>
      <p>Dear ${candidateName},</p>
      <p>This is a friendly reminder that your interview for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> is scheduled in ${hoursUntilInterview} hours.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Interview Details</h3>
        <p><strong>Date:</strong> ${interviewDate}</p>
        <p><strong>Time:</strong> ${interviewTime}</p>
        <p><strong>Location:</strong> ${interviewLocation}</p>
      </div>
      
      <p>Please make sure to arrive on time or join the virtual meeting link a few minutes early.</p>
      
      <p>If you need to reschedule or have any questions, please let us know as soon as possible.</p>
      
      <p>Best regards,<br>${recruiterName}<br>${companyName}</p>
    </div>
  `;
  
  return await sendEmail({
    to: candidateEmail,
    subject,
    html
  });
}
