import nodemailer from 'nodemailer';

// Check if environment variables are configured
const isDev = !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD;

if (isDev) {
  console.warn('Email service not configured. Messages will be logged only.');
}

if (isDev) return res.status(200).json({ message: 'Message reçu! (Mode développement)' });



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
// Check if environment variables are configured
const isDev = !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD;

if (isDev) {
  console.warn('Email service not configured. Messages will be logged only.');
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
