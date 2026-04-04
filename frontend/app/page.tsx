'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('user-session');
    if (session) {
      router.push('/upload');
    }
  }, [router]);

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Resume Agent</h1>
          <p className="text-lg text-slate-600 mb-8">
            AI-driven CV analysis and job match scoring in seconds.
            Start your intelligent hiring journey with a clean, professional workflow.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/login"
              className="inline-flex justify-center items-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-4 shadow-lg hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Get Started
            </Link>
            <button
              onClick={scrollToFeatures}
              className="inline-flex justify-center items-center rounded-xl border border-slate-300 text-slate-700 bg-white px-6 py-4 hover:bg-slate-50 transition"
            >
              Learn About AI Matching
            </button>
          </div>
        </div>

        <section id="features" className="mt-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">How AI Matching Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Upload & Analyze</h3>
              <p className="text-sm text-slate-600">Upload your resume in PDF format and paste the job description. Our AI extracts key skills, experience, and qualifications.</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Match Scoring</h3>
              <p className="text-sm text-slate-600">Get an instant match score (0-100%) based on skill alignment, experience level, and job requirements.</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Learning Plan</h3>
              <p className="text-sm text-slate-600">Receive personalized video recommendations to bridge skill gaps and maximize your match score.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-slate-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Choose Resume Agent?</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>AI-Powered Analysis:</strong> Uses advanced language models to understand context, not just keyword matching</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Skill Gap Detection:</strong> Identifies exactly what skills you need to become a strong candidate</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Personalized Learning:</strong> Get curated video recommendations tailored to your gaps</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Professional Insights:</strong> Understand exactly how your resume aligns with the job description</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
