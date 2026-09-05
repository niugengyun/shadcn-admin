export type ApiError = { message: string; status?: number }

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 30000)

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
      signal: controller.signal,
    })
    if (!response.ok) throw { message: await response.text(), status: response.status } satisfies ApiError
    return response.json() as Promise<T>
  } finally {
    window.clearTimeout(timer)
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
}
