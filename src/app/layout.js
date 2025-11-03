// app/layout.jsx (Server Component)
export default async function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head><title>Trustwards</title></head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
