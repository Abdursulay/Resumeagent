"use client";

import { useState } from 'react';
import { AnalyzeForm } from '@/components/analyze-form';
import { AnalysisResult } from '@/components/analysis-result';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-emerald-100">
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 lg:py-24">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 mb-4 animate-in fade-in zoom-in duration-700">
            Powered by FastAPI & AI
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight">
            Perfect Your Profile
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-500">
            Get instant feedback on your CV and a custom curriculum to bridge the skills gap for your dream job.
          </p>
        </div>

        {/* Content */}
        <div className="mt-8 transition-all duration-500 ease-in-out">
          {!analysisResult ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
              <AnalyzeForm onAnalysisComplete={(res) => setAnalysisResult(res)} />
            </div>
          ) : (
            <AnalysisResult 
              result={analysisResult} 
              onBack={() => setAnalysisResult(null)} 
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-neutral-400 mt-auto">
        <p>&copy; 2024 Resume Agent. Built with Next.js and FastAPI.</p>
      </footer>
    </div>
  );
}
