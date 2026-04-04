import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Agent - AI-Powered Job Matching",
  description: "Upload your resume and job description to get AI-powered analysis and learning recommendations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
