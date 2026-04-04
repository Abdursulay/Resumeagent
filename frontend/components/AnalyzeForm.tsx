'use client';

import { useState, useRef } from 'react';

interface AnalyzeFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
}

export default function AnalyzeForm({ onSubmit, isLoading = false }: AnalyzeFormProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const cvInputRef = useRef<HTMLInputElement>(null);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      alert('Please select a PDF file');
      setCvFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cvFile) {
      alert('Please select a CV file');
      return;
    }

    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('job_description', jobDescription);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-indigo-100 p-5 shadow-lg bg-gradient-to-br from-white via-indigo-50 to-indigo-100">
        <p className="text-xs font-semibold text-indigo-700 tracking-wide mb-3">Step 1 of 3</p>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Upload CV (PDF)</label>
        <div
          className="group border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50"
          onClick={() => cvInputRef.current?.click()}
        >
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf"
            onChange={handleCvChange}
            disabled={isLoading}
            className="hidden"
          />
          {cvFile ? (
            <div className="text-slate-700">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  ✓
                </div>
                <p className="text-sm font-semibold">Resume attached</p>
              </div>
              <p className="font-medium text-slate-900 truncate" title={cvFile.name}>{cvFile.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {(cvFile.size / 1024).toFixed(2)} KB • {new Date(cvFile.lastModified).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="text-indigo-700 transition-opacity duration-200 group-hover:opacity-100 opacity-90">
              <p className="text-lg font-semibold">Drop your resume here</p>
              <p className="text-sm mt-2">PDF only • Less than 5MB recommended</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 p-5 shadow-lg bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
        <p className="text-xs font-semibold text-emerald-700 tracking-wide mb-3">Step 2 of 3</p>
        <div className="flex items-start justify-between">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Job Description</label>
          <span className="text-xxs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">500+ words for best results</span>
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isLoading}
          placeholder="Paste the job description here...\nExample: Senior Backend Developer (Python/FastAPI), 5+ years, AWS, Docker..."
          className="w-full min-h-[190px] max-h-[260px] px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none disabled:bg-slate-100 disabled:cursor-not-allowed text-sm leading-relaxed"
        />
        <p className="mt-2 text-xs text-slate-500">Tip: include responsibilities, required skills, and technologies so the model matches more accurately.</p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !cvFile || !jobDescription.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      <p className="text-xs text-slate-500 mt-2 text-center">
        Step 3: Upload, submit, and receive a detailed AI skills report.
      </p>
    </form>
  );
}
