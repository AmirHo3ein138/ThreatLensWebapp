import {
  loadMockChecks,
  saveMockChecks,
  validatePublicIPv4,
  createMockCheckResult,
} from './mockData';

export const USE_MOCK = true;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export class ApiError extends Error {
  constructor(message, { status = null, isNetworkError = false } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  let response;
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new ApiError(
      'ارتباط با سرور بک‌اند برقرار نشد. از اجرا بودن سرویس بک‌اند مطمئن شوید.',
      { isNetworkError: true }
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const serverMessage =
      data?.detail ||
      data?.message ||
      data?.error ||
      `خطای سرور (کد ${response.status})`;

    throw new ApiError(
      typeof serverMessage === 'string'
        ? serverMessage
        : 'درخواست نامعتبر بود یا با خطا مواجه شد.',
      { status: response.status }
    );
  }

  return data;
}

export async function checkIp(ip) {
  const cleanedIp = (ip || '').trim();

  if (USE_MOCK) {
    await wait(700);

    if (cleanedIp === '203.0.113.99') {
      throw new ApiError(
        'ارتباط با سرور بک‌اند برقرار نشد. از اجرا بودن سرویس بک‌اند مطمئن شوید.',
        { isNetworkError: true }
      );
    }

    const validationError = validatePublicIPv4(cleanedIp);
    if (validationError) {
      throw new ApiError(validationError, { status: 400 });
    }

    const current = loadMockChecks();
    const maxId = current.reduce((max, item) => Math.max(max, item.id), 0);
    const created = createMockCheckResult(cleanedIp, maxId + 1);
    const updated = [created, ...current];
    saveMockChecks(updated);
    return created;
  }

  return request('/api/checks', {
    method: 'POST',
    body: JSON.stringify({ ip: cleanedIp }),
  });
}

export async function getHistory(searchIp = '') {
  const query = (searchIp || '').trim();

  if (USE_MOCK) {
    await wait(250);
    const all = loadMockChecks().sort(
      (a, b) => new Date(b.checked_at) - new Date(a.checked_at)
    );
    if (!query) return all;
    return all.filter((item) => item.ip.includes(query));
  }

  const params = query ? `?ip=${encodeURIComponent(query)}` : '';
  const data = await request(`/api/checks${params}`, { method: 'GET' });
  const list = Array.isArray(data) ? data : data?.items || [];
  return [...list].sort(
    (a, b) => new Date(b.checked_at) - new Date(a.checked_at)
  );
}

export async function getCheckDetail(id) {
  if (USE_MOCK) {
    await wait(200);
    const all = loadMockChecks();
    const found = all.find((item) => String(item.id) === String(id));
    if (!found) {
      throw new ApiError('بررسی مورد نظر با این شناسه پیدا نشد.', {
        status: 404,
      });
    }
    return found;
  }

  return request(`/api/checks/${encodeURIComponent(id)}`, { method: 'GET' });
}