const STORAGE_KEY = 'threatlens_mock_checks_v1';

const INITIAL_MOCK_CHECKS = [
  {
    id: 6,
    ip: '185.220.101.4',
    checked_at: new Date().toISOString(),
    sources: [
      {
        source: 'VirusTotal',
        status: 'ok',
        is_mock: true,
        summary: {
          malicious: 12,
          suspicious: 2,
          harmless: 66,
          undetected: 11,
          country: 'DE',
          as_owner: 'Zwiebelfreunde e.V.',
        },
        error_message: null,
      },
      {
        source: 'AbuseIPDB',
        status: 'ok',
        is_mock: true,
        summary: {
          abuse_confidence_score: 100,
          total_reports: 482,
          country_code: 'DE',
          isp: 'Zwiebelfreunde e.V.',
          last_reported_at: new Date().toISOString(),
        },
        error_message: null,
      },
    ],
  },
  {
    id: 5,
    ip: '8.8.8.8',
    checked_at: new Date().toISOString(),
    sources: [
      {
        source: 'VirusTotal',
        status: 'no_report',
        is_mock: true,
        summary: {
          malicious: 0,
          suspicious: 0,
          harmless: 74,
          undetected: 17,
          country: 'US',
          as_owner: 'GOOGLE',
        },
        error_message: null,
      },
      {
        source: 'AbuseIPDB',
        status: 'no_report',
        is_mock: true,
        summary: {
          abuse_confidence_score: 0,
          total_reports: 0,
          country_code: 'US',
          isp: 'Google LLC',
          last_reported_at: null,
        },
        error_message: null,
      },
    ],
  },
  {
    id: 4,
    ip: '45.155.205.233',
    checked_at: '2026-11-23T18:20:00Z',
    sources: [
      {
        source: 'VirusTotal',
        status: 'ok',
        is_mock: true,
        summary: {
          malicious: 9,
          suspicious: 1,
          harmless: 62,
          undetected: 19,
          country: 'RU',
          as_owner: 'Example Hosting Ltd',
        },
        error_message: null,
      },
      {
        source: 'AbuseIPDB',
        status: 'error',
        is_mock: true,
        summary: null,
        error_message: 'زمان انتظار پاسخ این منبع به پایان رسید (بیش از ۵ ثانیه).',
      },
    ],
  },
  {
    id: 3,
    ip: '1.1.1.1',
    checked_at: '2026-11-22T14:10:00Z',
    sources: [
      {
        source: 'VirusTotal',
        status: 'no_report',
        is_mock: true,
        summary: {
          malicious: 0,
          suspicious: 0,
          harmless: 76,
          undetected: 15,
          country: 'AU',
          as_owner: 'CLOUDFLARENET',
        },
        error_message: null,
      },
      {
        source: 'AbuseIPDB',
        status: 'no_report',
        is_mock: true,
        summary: {
          abuse_confidence_score: 0,
          total_reports: 0,
          country_code: 'AU',
          isp: 'Cloudflare, Inc.',
          last_reported_at: null,
        },
        error_message: null,
      },
    ],
  },
  {
    id: 2,
    ip: '193.142.146.35',
    checked_at: '2026-11-21T09:45:00Z',
    sources: [
      {
        source: 'VirusTotal',
        status: 'error',
        is_mock: true,
        summary: null,
        error_message: 'کلید API برای VirusTotal تنظیم نشده یا معتبر نیست.',
      },
      {
        source: 'AbuseIPDB',
        status: 'ok',
        is_mock: true,
        summary: {
          abuse_confidence_score: 87,
          total_reports: 134,
          country_code: 'NL',
          isp: 'Stark Industries Solutions',
          last_reported_at: '2026-11-21T08:30:00Z',
        },
        error_message: null,
      },
    ],
  },
  {
    id: 1,
    ip: '94.102.61.47',
    checked_at: '2026-11-20T11:00:00Z',
    sources: [
      {
        source: 'VirusTotal',
        status: 'no_report',
        is_mock: true,
        summary: {
          malicious: 0,
          suspicious: 0,
          harmless: 69,
          undetected: 22,
          country: 'NL',
          as_owner: 'Quasi Networks LTD',
        },
        error_message: null,
      },
      {
        source: 'AbuseIPDB',
        status: 'ok',
        is_mock: true,
        summary: {
          abuse_confidence_score: 42,
          total_reports: 18,
          country_code: 'NL',
          isp: 'Quasi Networks LTD',
          last_reported_at: '2026-11-19T22:10:00Z',
        },
        error_message: null,
      },
    ],
  },
];

export function loadMockChecks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CHECKS));
      return [...INITIAL_MOCK_CHECKS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...INITIAL_MOCK_CHECKS];
  } catch {
    return [...INITIAL_MOCK_CHECKS];
  }
}

export function saveMockChecks(checks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
  } catch {
    // اگر مرورگر اجازه ذخیره نداد، بدون خطا ادامه می‌دهیم
  }
}

// اعتبارسنجی مشابه بک‌اند برای تست کامل در حالت آزمایشی
export function validatePublicIPv4(rawIp) {
  const ip = (rawIp || '').trim();
  if (!ip) {
    return 'لطفاً یک آدرس IPv4 وارد کنید.';
  }

  const parts = ip.split('.');
  if (parts.length !== 4) {
    return 'فرمت آدرس IPv4 معتبر نیست (مثال صحیح: 8.8.8.8).';
  }

  const nums = [];
  for (const part of parts) {
    if (!/^\d+$/.test(part) || (part.length > 1 && part.startsWith('0'))) {
      return 'فرمت آدرس IPv4 معتبر نیست.';
    }
    const n = Number(part);
    if (n < 0 || n > 255) {
      return 'اعداد آدرس IPv4 باید بین 0 تا 255 باشند.';
    }
    nums.push(n);
  }

  const [a, b] = nums;
  const isPrivateOrSpecial =
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224;

  if (isPrivateOrSpecial) {
    return 'آدرس واردشده خصوصی یا رزروشده است و قابل استعلام عمومی نیست.';
  }

  return null;
}

export function createMockCheckResult(ip, nextId) {
  const now = new Date().toISOString();

  // برای تست راحت نتیجه ناقص: آی‌پی 198.51.100.1 خطای یک منبع را شبیه‌سازی می‌کند
  if (ip === '198.51.100.1') {
    return {
      id: nextId,
      ip,
      checked_at: now,
      sources: [
        {
          source: 'VirusTotal',
          status: 'ok',
          is_mock: true,
          summary: {
            malicious: 5,
            suspicious: 1,
            harmless: 68,
            undetected: 16,
            country: 'US',
            as_owner: 'TEST-NET-2',
          },
          error_message: null,
        },
        {
          source: 'AbuseIPDB',
          status: 'error',
          is_mock: true,
          summary: null,
          error_message: 'پاسخی از AbuseIPDB در مهلت ۵ ثانیه دریافت نشد.',
        },
      ],
    };
  }

  // شبیه‌سازی حالت بدون گزارش برای برخی آی‌پی‌های شناخته‌شده یا عددی زوج
  const lastOctet = Number(ip.split('.')[3]);
  if (ip === '8.8.8.8' || ip === '1.1.1.1' || lastOctet % 2 === 0) {
    return {
      id: nextId,
      ip,
      checked_at: now,
      sources: [
        {
          source: 'VirusTotal',
          status: 'no_report',
          is_mock: true,
          summary: {
            malicious: 0,
            suspicious: 0,
            harmless: 72,
            undetected: 18,
            country: 'US',
            as_owner: 'Public Network',
          },
          error_message: null,
        },
        {
          source: 'AbuseIPDB',
          status: 'no_report',
          is_mock: true,
          summary: {
            abuse_confidence_score: 0,
            total_reports: 0,
            country_code: 'US',
            isp: 'Public Network ISP',
            last_reported_at: null,
          },
          error_message: null,
        },
      ],
    };
  }

  return {
    id: nextId,
    ip,
    checked_at: now,
    sources: [
      {
        source: 'VirusTotal',
        status: 'ok',
        is_mock: true,
        summary: {
          malicious: 7,
          suspicious: 2,
          harmless: 64,
          undetected: 17,
          country: 'NL',
          as_owner: 'Sample VPS Provider',
        },
        error_message: null,
      },
      {
        source: 'AbuseIPDB',
        status: 'ok',
        is_mock: true,
        summary: {
          abuse_confidence_score: 76,
          total_reports: 59,
          country_code: 'NL',
          isp: 'Sample VPS Provider',
          last_reported_at: now,
        },
        error_message: null,
      },
    ],
  };
}