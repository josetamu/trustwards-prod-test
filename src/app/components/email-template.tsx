import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  message: string;
}

//This is the email template that we will receive from the user.
export function EmailTemplate({ firstName, message}: EmailTemplateProps) {
  return (
    <div>
      <h1>Hi, I'm {firstName}!</h1>
      <p>{message}.</p>
    </div>
  );
}