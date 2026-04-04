'use client';

import { useState } from 'react';
import AnalyzeForm from '@/components/AnalyzeForm';
import AnalysisResult from '@/components/AnalysisResult';

interface AnalysisResponse {
  match_score: number;
  reason: string;
  learning_plan: Array<{
    title: string;
    video: string;
    thumbnail: string;
  }>;
}

export default function AnalyzePage() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

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
      setAnalysis(data);
    } catch (err) {
      let message = 'An error occurred while analyzing. Check backend availability.';
      if (err instanceof Error) {
        message = err.message;
      }
      if (message.includes('404')) {
        message = 'API endpoint not found. Please ensure backend is running and endpoint is /api/analyze.';
      }
      setError(message);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Resume Analysis</h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Upload your resume PDF alongside a job description to receive a detailed AI-driven matching report and skill-building recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8">
            <AnalyzeForm onSubmit={handleAnalyze} isLoading={loading} />
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-semibold">❌ Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4" />
                <p className="text-slate-600">Analyzing your resume...</p>
              </div>
            )}

            {analysis && !loading && <AnalysisResult data={analysis} />}

            {!analysis && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-slate-500">Results will appear here once you submit your resume and JD.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
