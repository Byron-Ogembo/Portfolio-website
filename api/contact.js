import { Resend } from 'resend';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const submissionDate = new Date().toLocaleString();

    const data = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'byronogembo337@gmail.com',
      reply_to: email,
      subject: `New Portfolio Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nDate: ${submissionDate}\n\nMessage:\n${message}`,
    });

    if (data.error) {
      console.error('Resend API Error:', data.error);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
