import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={inter.className}>
        <main>{children}</main>  {/* Wrap the children in a main tag */}
      </body>
    </html>
  );
}