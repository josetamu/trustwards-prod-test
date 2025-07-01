import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  message: string;
  files: File[];
}

export function EmailTemplate({ firstName, message, files }: EmailTemplateProps) {
  return (
    <div>
      <h1>Hi, I'm {firstName}!</h1>
      <p>{message}.</p>
      {files.map((file) => (
        <p>{file.name}</p>
      ))}
    </div>
  );
}