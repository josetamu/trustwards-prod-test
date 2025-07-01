import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>React App with Next.js</title>
            </head>
            <body>
                <ThemeProvider>
                    <div id="root">{children}</div>
                </ThemeProvider>
            </body>
        </html>
    )
}