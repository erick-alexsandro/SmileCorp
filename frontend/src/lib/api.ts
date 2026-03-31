'use client';

import { authClient } from '@/lib/auth/client';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Authenticated fetch wrapper that automatically includes auth headers
 * from the Neon Auth session
 */
export async function apiFetch(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { skipAuth = false, headers = {}, ...otherOptions } = options;

  const headersWithAuth = { ...headers };

  // Get auth token from session if not skipping auth
  if (!skipAuth) {
    try {
      const { data: session } = await authClient.getSession();
      if (session?.user) {
        // Add auth token from the session
        const cookieToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('neonauth_session='))
          ?.split('=')[1];

        if (cookieToken) {
          headersWithAuth['Authorization'] = `Bearer ${cookieToken}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth session:', error);
    }
  }

  return fetch(url, {
    ...otherOptions,
    headers: headersWithAuth,
  });
}

/**
 * Helper to make GET requests with auth
 */
export async function apiGet<T = any>(
  url: string,
  options?: Omit<FetchOptions, 'method'>,
): Promise<T> {
  const response = await apiFetch(url, { ...options, method: 'GET' });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Helper to make POST requests with auth
 */
export async function apiPost<T = any>(
  url: string,
  body?: any,
  options?: Omit<FetchOptions, 'method' | 'body'>,
): Promise<T> {
  const response = await apiFetch(url, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Helper to make PUT requests with auth
 */
export async function apiPut<T = any>(
  url: string,
  body?: any,
  options?: Omit<FetchOptions, 'method' | 'body'>,
): Promise<T> {
  const response = await apiFetch(url, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Helper to make DELETE requests with auth
 */
export async function apiDelete<T = any>(
  url: string,
  options?: Omit<FetchOptions, 'method'>,
): Promise<T> {
  const response = await apiFetch(url, { ...options, method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
}
