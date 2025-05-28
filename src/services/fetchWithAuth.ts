// src/services/fetchWithAuth.ts
const BASE_URL = 'http://localhost:8080';

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem('jwt');
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string,string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const resp = await fetch(
    `${BASE_URL}${path}`,
    {
      ...options,
      headers,
    }
  );
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Error ${resp.status}: ${errText}`);
  }
  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
