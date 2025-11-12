import nodemailer from 'nodemailer';

// Check if required environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('Missing required email environment variables: EMAIL_USER and/or EMAIL_PASSWORD');
  console.error('Please set these in Vercel Environment Variables:');
  console.error('1. Go to Vercel Dashboard > purenote > Settings > Environment Variables');
  console.error('2. Add EMAIL_USER (your Gmail address)');
  console.error('3. Add EMAIL_PASSWORD (Gmail App Password - not your main password)');
  console.error('   Note: If you have 2FA enabled, use an App Password: https://myaccount.google.com/apppasswords');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Check if environment variables are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return res.status(500).json({ 
      message: 'Email service is not configured. Please check server logs.',
      error: 'Missing EMAIL_USER or EMAIL_PASSWORD environment variables'
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'purenote.contact@gmail.com',
      replyTo: email,
      subject: `${subject} (from ${name})`,
      html: `
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });
    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    
    // Return more specific error messages based on the error
    if (error.message.includes('Invalid login')) {
      return res.status(500).json({ 
        message: 'Failed to authenticate with email service. Check credentials.',
        error: 'Invalid email credentials'
      });
    }
    
    return res.status(500).json({ 
      message: 'Failed to send email',
      error: error.message
    });
  }
}
