export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>React App with Next.js</title>
            </head>
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    )
}