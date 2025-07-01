import { EmailTemplate } from '@components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { firstName } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Support <support@trustwards.io>',
      to: [
        'support@trustwards.io',
      ],
      bcc: [
        'josetamu@trustwards.io',
        'oscarabad@trustwards.io',
        'davidcerezo@trustwards.io'
      ],
      subject: 'Hello world',
      replyTo: 'jose11tamu@gmail.com',
      react: EmailTemplate({ firstName }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}