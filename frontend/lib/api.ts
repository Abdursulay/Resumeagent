export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AnalysisResponse {
  match_score: number;
  reason: string;
  learning_plan: Array<{
    title: string;
    video: string;
    thumbnail: string;
  }>;
}

export interface ApiError {
  detail: string;
  status?: number;
}

/**
 * Upload CV and job description to backend for analysis
 */
export async function analyzeResume(formData: FormData): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}
