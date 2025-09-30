import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Footer } from "components/Footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Apply Wizz - Your Career Partner | Daily Job Applications & ATS Resume Builder",
  description:
    "Transform your job search with Apply Wizz! We apply to 20-25 jobs daily on your behalf while you focus on interviews. Get ATS-optimized resumes, personalized applications, and career guidance. Join 500+ successful professionals who accelerated their careers with Apply Wizz.",
  keywords: "Apply Wizz, career partner, job applications, resume builder, ATS scanner, interview preparation, job search automation, Indian students USA, career success, professional resume",
  author: "Apply Wizz Team",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  canonical: "https://apply-wizz.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopNavBar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
