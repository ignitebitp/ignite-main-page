import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

let resendInstance = null;
const getResend = () => {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

/**
 * Send an email via Resend API
 * @param {string|string[]} to - Recipient email(s)
 * @param {string} subject - Email subject line
 * @param {string} html - HTML email body content
 */
export const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[Mailer] RESEND_API_KEY not set. Mock email to: ${to} | Subject: "${subject}"`);
    return { mock: true, id: `mock-${Date.now()}` };
  }

  const resend = getResend();
  // Resend default onboarding sender works out of the box for testing
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const from = fromEmail.includes('<') ? fromEmail : `IGNITE Technical Club <${fromEmail}>`;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error('[Mailer] Resend API error:', error);
      throw new Error(error.message || 'Resend failed to send email');
    }

    console.log('[Mailer] Email delivered successfully:', data?.id || data);
    return data;
  } catch (error) {
    console.error('[Mailer] Failed to transmit email:', error);
    throw error;
  }
};
