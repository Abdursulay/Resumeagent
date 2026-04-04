'use client';

interface VideoRecommendation {
  title: string;
  video: string;
  thumbnail: string;
}

interface AnalysisResultProps {
  data: {
    match_score: number;
    reason: string;
    learning_plan: VideoRecommendation[];
  };
}

export default function AnalysisResult({ data }: AnalysisResultProps) {
  const { match_score, reason, learning_plan } = data;

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Match Score */}
      <div className={`${getScoreBg(match_score)} rounded-2xl p-6 border border-slate-200 shadow-sm`}> 
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-900">Match Score</h2>
          <span className={`text-4xl font-bold ${getScoreColor(match_score)}`}>
            {match_score}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              match_score >= 80
                ? 'bg-green-600'
                : match_score >= 60
                ? 'bg-yellow-600'
                : 'bg-red-600'
            }`}
            style={{ width: `${match_score}%` }}
          ></div>
        </div>
      </div>

      {/* Analysis Reason */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Analysis</h3>
        <p className="text-slate-700 leading-relaxed">{reason}</p>
      </div>

      {/* Learning Plan */}
      {learning_plan && learning_plan.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Learning Plan
          </h3>
          <div className="space-y-3">
            {learning_plan.map((item, index) => (
              <a
                key={index}
                href={item.video}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group cursor-pointer"
              >
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 group-hover:text-slate-700 truncate">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-1 truncate">
                    {item.video}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-slate-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
