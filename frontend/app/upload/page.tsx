'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnalyzeForm from '@/components/AnalyzeForm';
import TipBadge from '@/components/TipBadge';
import UserMenu from '@/components/UserMenu';
import { AnalysisResponse } from '@/lib/api';

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const session = localStorage.getItem('user-session');
    if (!session) {
      router.push('/login');
    }
  }, [router]);

  const handleAnalyzeAndNavigate = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/g, '');
      const endpoint = `${apiBase}/api/analyze`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const data: AnalysisResponse = await response.json();
      sessionStorage.setItem('resumeAnalysisResult', JSON.stringify(data));
      router.push('/analysis');
    } catch (err) {
      let message = 'An error occurred during analysis. Please try again.';
      if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      console.error('Upload analyse error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Resume Agent</h2>
        <UserMenu />
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Professional Resume Assessment</h1>
              <p className="text-slate-500">Upload your resume and job description on this step. You will land on a dedicated analysis page with an executive summary and improvement plan.</p>
            </div>

            <TipBadge
              title="Pro Tip"
              description="Use clear, detailed job descriptions (including skills, years of experience, and tools) for faster, more accurate match scoring. Make your resume text-rich and quantifiable."
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <AnalyzeForm onSubmit={handleAnalyzeAndNavigate} isLoading={loading} />
          </section>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-100 shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Your Analysis Preview</h2>
              <p className="text-slate-600 mb-5">After submission, get a rich professional report in the next page with:</p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-2 items-start"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />Match score vs JD</li>
                <li className="flex gap-2 items-start"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />Skill gap analysis and core strengths</li>
                <li className="flex gap-2 items-start"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />Actionable improvement steps and learning videos</li>
                <li className="flex gap-2 items-start"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />Professional formatting score + tips</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
