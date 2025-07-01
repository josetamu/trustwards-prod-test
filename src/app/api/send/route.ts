import { EmailTemplate } from '@components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    
    // Get the form data from the request
    const formData = await req.formData();
    const firstName = formData.get('firstName') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const type = formData.get('type') as string;
    const files = formData.getAll('files') as File[];


    // Basic validations to check if the fields are filled
    if (!firstName || !email || !message || !type) {
      return Response.json({ 
        error: 'Missing required fields: firstName, email, message, or type' 
      }, { status: 400 });
    }

    // Check if the API key is configured
    if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
      return Response.json({ 
        error: 'Resend API key not configured' 
      }, { status: 500 });
    }

    
/* Here we structure the email to send, we send it to the support email and the bcc is an array of emails to send the email to, but the user can't see them. 
In react we pass the email template with the data we need in this case the first name, the message and the files. attachments is used for the files. */
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
      subject: type,
      replyTo: email,
      react: EmailTemplate({ firstName, message, files }),
      attachments: files && files.length > 0 ? await Promise.all(
        files.map(async file => ({
          content: Buffer.from(await file.arrayBuffer()),
          filename: file.name,
        }))
      ) : undefined,
    });

    if (error) {
      return Response.json({ 
        error: error.message || 'Failed to send email',
        details: error 
      }, { status: 500 });
    }


    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}