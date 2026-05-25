import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Elyra | AI Technology News Intelligence",
  description:
    "Elyra is a premium AI-powered technology news platform that curates, ranks, and summarizes the most important signals in real time.",
  metadataBase: new URL("https://elyra.news"),
  openGraph: {
    title: "Elyra | AI Technology News Intelligence",
    description:
      "A futuristic technology news intelligence layer designed for speed, clarity, and premium editorial quality.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const theme = localStorage.getItem('elyra-theme'); if (theme === 'light' || theme === 'dark') { document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; } } catch (e) {} })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
