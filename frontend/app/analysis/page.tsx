'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnalysisResult from '@/components/AnalysisResult';
import UserMenu from '@/components/UserMenu';
import { AnalysisResponse } from '@/lib/api';

export default function AnalysisPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('user-session');
    if (!session) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const stored = sessionStorage.getItem('resumeAnalysisResult');
    if (stored) {
      setAnalysis(JSON.parse(stored));
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Resume Agent</h2>
        <UserMenu />
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Professional Analysis Report</h1>
            <p className="text-slate-500">Your resume is now evaluated against the job description with precise scoring, candid strengths and opportunity analysis, and actionable learning recommendations.</p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Upload
          </Link>
        </div>

        {analysis ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
              <AnalysisResult data={analysis} />
            </section>

            <aside className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-lg p-6 sticky top-24 h-fit">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Executive Summary</h2>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />Resume-job fit score: <strong>{analysis.match_score}%</strong></li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />Immediate action: prioritize top 3 missing skills</li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />Career edge: highlight quantified achievements and AWS/DevOps experience</li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />Learning playlist: tailored videos ready to watch</li>
              </ul>
            </aside>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10 text-center">
            <p className="text-slate-500">No result found yet.</p>
            <Link href="/upload" className="inline-flex mt-4 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg">
              Upload Resume to Analyze
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
