"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LearningResource {
  title: string;
  video: string;
  thumbnail: string;
}

interface AnalysisResultData {
  match_score: number;
  reason: string;
  learning_plan: LearningResource[];
}

interface AnalysisResultProps {
  result: AnalysisResultData;
  onBack: () => void;
}

export function AnalysisResult({ result, onBack }: AnalysisResultProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Navigation & Status */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-neutral-500 hover:text-neutral-900 transition-colors -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          New Analysis
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant="success" className="px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-100 font-medium">
            Complete
          </Badge>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">v2.0 AI Engine</span>
        </div>
      </div>

      {/* Hero: Score & Summary */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 flex flex-col md:flex-row items-center gap-10">
        <div className="relative h-40 w-40 flex items-center justify-center shrink-0">
          <svg className="h-full w-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-neutral-50"
            />
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={452.4}
              strokeDashoffset={452.4 - (452.4 * result.match_score) / 100}
              className="text-emerald-500 transition-all duration-1500 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-neutral-900">{result.match_score}%</span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Match</span>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Analysis Summary</h2>
          <div className="prose prose-neutral text-neutral-600 leading-relaxed max-w-none">
            {result.reason}
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-lg">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Success Roadmap</h3>
            <p className="text-sm text-neutral-500 italic">Curated resources to bridge your current skills gap.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {result.learning_plan.map((resource, index) => (
            <a 
              key={index} 
              href={resource.video} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-neutral-50/50 rounded-3xl p-4 border border-neutral-100 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={resource.thumbnail} 
                    alt={resource.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    <div className="bg-white p-3 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Youtube className="text-red-600 w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="px-1">
                  <h4 className="text-[14px] font-bold text-neutral-800 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {resource.title}
                  </h4>
                  <div className="mt-2 flex items-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Expert Recommended
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
