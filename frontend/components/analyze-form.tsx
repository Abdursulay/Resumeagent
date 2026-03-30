"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { analyzeResume } from "@/lib/api";

interface AnalyzeFormProps {
  onAnalysisComplete: (result: any) => void;
}

export function AnalyzeForm({ onAnalysisComplete }: AnalyzeFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeResume(file, jobDescription);
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-neutral-200/60 bg-white/80 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500" />
      <CardHeader className="pt-8 text-center">
        <CardTitle className="text-3xl font-bold text-neutral-900 tracking-tight">Resume Intelligence</CardTitle>
        <p className="text-neutral-500 mt-2">Upload your CV and the job description. Our AI will do the rest.</p>
      </CardHeader>
      <form onSubmit={handleSubmit} className="px-1 pb-2">
        <CardContent className="space-y-8 pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">Professional CV</label>
              {file && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Ready</span>
              )}
            </div>
            <div className="group relative">
              <label 
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                  file 
                    ? 'border-emerald-400 bg-emerald-50/30' 
                    : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-400 hover:bg-neutral-50 group-hover:scale-[1.005]'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className={`p-3 rounded-full transition-colors duration-300 ${file ? 'bg-emerald-100' : 'bg-neutral-100 group-hover:bg-neutral-200'}`}>
                    <Upload className={`w-6 h-6 ${file ? 'text-emerald-600' : 'text-neutral-500'}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-neutral-700">
                      {file ? file.name : "Select your PDF resume"}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {file ? `${(file.size / 1024).toFixed(1)} KB` : "Drop file here or browse"}
                    </p>
                  </div>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  required
                />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">Job Description</label>
            <Textarea 
              placeholder="Paste the target role details here..."
              className="min-h-[180px] rounded-2xl border-neutral-200 bg-neutral-50/30 focus:bg-white transition-all duration-300 resize-none focus:ring-emerald-500/20"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50/50 rounded-xl border border-red-100 animate-in shake duration-500">
              <p className="font-semibold mb-1">Analysis Error</p>
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="pb-8">
          <Button 
            type="submit" 
            className={`w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-500 ${
              loading 
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                : 'bg-neutral-900 text-white hover:bg-emerald-600 hover:scale-[1.01] active:scale-95'
            }`}
            disabled={loading || !file || !jobDescription}
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Evaluate Match"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
