import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
  const rawFrom = (process.env.RESEND_FROM_EMAIL || 'info@igniteclub.tech').trim();
  const emailMatch = rawFrom.match(/<([^>]+)>/);
  const fromEmail = emailMatch ? emailMatch[1].trim() : rawFrom;
  const from = `IGNITE Club <${fromEmail}>`;

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
