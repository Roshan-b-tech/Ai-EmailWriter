import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
      'https://ai-email-writer-frontend.onrender.com',
      'https://ai-email-writer-41wfh9sj8-roshangehlot500-gmailcoms-projects.vercel.app',
      'https://ai-email-writer-gamma.vercel.app',
      'https://ai-emailwriter.onrender.com',
      'http://localhost:5173'
    ]
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize Groq client
const apiKey = process.env.GROQ_API_KEY || 'your-groq-api-key-here';
console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');

const groq = new Groq({
  apiKey: apiKey
});

// Initialize nodemailer transporter
const emailUser = process.env.EMAIL_USER || 'your-email@gmail.com';
const emailPass = process.env.EMAIL_PASS || 'your-app-password';
console.log('Email User loaded:', emailUser);
console.log('Email Pass loaded:', emailPass ? '***' : 'NOT FOUND');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

// Generate email endpoint
app.post('/api/generate-email', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional email writer. Generate emails that are well-structured, professional, and engaging. Always provide both a subject line and email content. Format your response as JSON with "subject" and "content" fields. Make sure the content is properly formatted with line breaks where appropriate.'
        },
        {
          role: 'user',
          content: `Generate a professional email based on this prompt: ${prompt}. Return only valid JSON with "subject" and "content" fields.`
        }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1000
    });

    const emailContent = completion.choices[0]?.message?.content;

    if (!emailContent) {
      throw new Error('No content generated');
    }

    console.log('Raw AI response:', emailContent);

    // Try to parse as JSON first
    let parsedEmail;
    try {
      parsedEmail = JSON.parse(emailContent);
      console.log('Successfully parsed JSON:', parsedEmail);
    } catch (parseError) {
      console.log('JSON parsing failed, trying manual extraction');

      // Try to extract JSON-like structure manually
      const subjectMatch = emailContent.match(/"subject":\s*"([^"]+)"/);
      const contentMatch = emailContent.match(/"content":\s*"([\s\S]*?)"\s*}/);

      if (subjectMatch && contentMatch) {
        const subject = subjectMatch[1];
        const content = contentMatch[1].replace(/\\n/g, '\n');
        parsedEmail = { subject, content };
        console.log('Manual JSON extraction result:', parsedEmail);
      } else {
        // Try alternative pattern for unquoted content
        const subjectMatch2 = emailContent.match(/"subject":\s*"([^"]+)"/);
        const contentMatch2 = emailContent.match(/"content":\s*([\s\S]*?)\s*}/);

        if (subjectMatch2 && contentMatch2) {
          const subject = subjectMatch2[1];
          const content = contentMatch2[1].trim().replace(/^"|"$/g, '').replace(/\\n/g, '\n');
          parsedEmail = { subject, content };
          console.log('Alternative JSON extraction result:', parsedEmail);
        } else {
          // Fallback to line-based extraction
          const lines = emailContent.split('\n').filter(line => line.trim());
          const subject = lines[0]?.replace(/^(Subject|SUBJECT):\s*/i, '') || 'Generated Email';
          const content = lines.slice(1).join('\n').trim() || emailContent;
          parsedEmail = { subject, content };
          console.log('Line-based extraction result:', parsedEmail);
        }
      }
    }

    // Ensure we have both subject and content
    if (!parsedEmail.subject || !parsedEmail.content) {
      console.log('Missing subject or content, using fallback');
      parsedEmail = {
        subject: parsedEmail.subject || 'Generated Email',
        content: parsedEmail.content || emailContent
      };
    }

    console.log('Final parsed email:', parsedEmail);

    res.json(parsedEmail);
  } catch (error) {
    console.error('Error generating email:', error);
    console.error('Error stack:', error.stack);
    console.error('Environment check:');
    console.error('- GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'SET' : 'NOT SET');
    console.error('- EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
    console.error('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    console.error('- NODE_ENV:', process.env.NODE_ENV);

    res.status(500).json({
      error: 'Failed to generate email',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Send emails endpoint
app.post('/api/send-emails', async (req, res) => {
  try {
    const { recipients, subject, content } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients are required' });
    }

    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content are required' });
    }

    // Send emails to all recipients
    const emailPromises = recipients.map(recipient => {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: recipient.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            ${recipient.name ? `<p>Dear ${recipient.name},</p>` : '<p>Hello,</p>'}
            <div style="white-space: pre-line; line-height: 1.6;">
              ${content.replace(/\n/g, '<br>')}
            </div>
            <br>
            <p>Best regards,<br>AI Email Sender</p>
          </div>
        `
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: `Emails sent successfully to ${recipients.length} recipient(s)`
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({
      error: 'Failed to send emails',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Make sure to set the following environment variables:');
  console.log('- GROQ_API_KEY: Your Groq API key');
  console.log('- EMAIL_USER: Your Gmail address');
  console.log('- EMAIL_PASS: Your Gmail app password');
});