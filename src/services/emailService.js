const RESEND_API_KEY = process.env.REACT_APP_RESEND_API_KEY

export const sendEmail = async (to, subject, html) => {
  if (!RESEND_API_KEY) {
    console.log('Email would be sent:', { to, subject })
    return { success: true }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'OctaIQ <noreply@octaiq.com>',
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return await response.json()
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

export const sendApplicationConfirmation = (email, name, roleName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
      <h1 style="color: #FFD700;">Application Received!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for applying to the <strong>${roleName}</strong> internship at OctaIQ.</p>
      <p>We've received your application and will review it shortly. You'll hear from us within 5-7 business days.</p>
      <p>Best regards,<br>The OctaIQ Team</p>
    </div>
  `
  return sendEmail(email, 'Application Received - OctaIQ Internship', html)
}

export const sendStatusUpdate = (email, name, roleName, status, message = '') => {
  const statusColors = {
    shortlisted: '#22c55e',
    rejected: '#ef4444',
    accepted: '#FFD700'
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
      <h1 style="color: ${statusColors[status] || '#FFD700'};">Application Update</h1>
      <p>Hi ${name},</p>
      <p>Your application for <strong>${roleName}</strong> has been <strong style="color: ${statusColors[status]}">${status}</strong>.</p>
      ${message ? `<p>${message}</p>` : ''}
      <p>Best regards,<br>The OctaIQ Team</p>
    </div>
  `
  return sendEmail(email, `Application ${status.charAt(0).toUpperCase() + status.slice(1)} - OctaIQ`, html)
}
