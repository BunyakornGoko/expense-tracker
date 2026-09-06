type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }

export async function apiRequest<T>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  let res: Response
  try {
    res = await fetch(url, options)
  } catch {
    return { ok: false, error: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง' }
  }

  const body = await res.json().catch(() => null)
  if (!res.ok) return { ok: false, error: body?.error ?? 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง' }
  return { ok: true, data: body as T }
}

export function apiPost<T>(url: string, payload: unknown) {
  return apiRequest<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function apiPatch<T>(url: string, payload: unknown) {
  return apiRequest<T>(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function apiDelete<T>(url: string) {
  return apiRequest<T>(url, { method: 'DELETE' })
}
