import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../lib/contexts/AuthContext';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peripatos - Education Network",
  description: 
    "Peripatos is a peer-to-peer education network and marketplace. Peripatos hopes to be the place where truth can be pursued unabashedly, free from the bureaucratic death trap.",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mdgaziur/EditorJS-LaTeX@latest/dist/editorjs-latex.bundle.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.12.0/katex.min.css" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.19.0/dist/editor.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/gh/mdgaziur/EditorJS-LaTeX@latest/dist/editorjs-latex.bundle-min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}