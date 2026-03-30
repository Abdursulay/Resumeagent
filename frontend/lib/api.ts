export async function analyzeResume(cvFile: File, jobDescription: string) {
  console.log(`[API] Starting analysis for file: ${cvFile.name}, size: ${cvFile.size} bytes`);
  const formData = new FormData();
  formData.append("cv", cvFile);
  formData.append("job_description", jobDescription);

  // Fallback to localhost if not specified in environment
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  console.log(`[API] Backend URL: ${backendUrl}`);

  try {
    const response = await fetch(`${backendUrl}/api/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response (${response.status}):`, errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { detail: errorText || response.statusText };
      }
      throw new Error(errorData?.detail || `API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[API] Analysis successful:", data);
    return data;
  } catch (error) {
    console.error("[API] Error analyzing resume:", error);
    throw error;
  }
}
