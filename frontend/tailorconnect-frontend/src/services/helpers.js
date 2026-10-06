// Wraps an axios call, falling back to mock data if the backend is unreachable.
// This lets the UI work fully offline for demo/college-project purposes.
export async function withFallback(apiCall, mockData, delay = 300) {
  try {
    const res = await apiCall()
    return res.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, delay))
    return mockData
  }
}
