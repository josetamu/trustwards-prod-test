import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
    /*  Note! If you do not add suppressHydrationWarning to your <html> you will get warnings because next-themes updates that element. 
        This property only applies one level deep, so it won't block hydration warnings on other elements. 
    */
    return (
        <html lang="en" suppressHydrationWarning> 
            <head>
                <title>React App with Next.js</title>
            </head>
            <body>
                <ThemeProvider> {/* Client component from next-themes */}
                    <div id="root">{children}</div>
                </ThemeProvider>
            </body>
        </html>
    )
}