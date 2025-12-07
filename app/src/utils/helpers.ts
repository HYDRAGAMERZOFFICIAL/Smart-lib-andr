export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < attempts - 1) {
        await delay(delayMs * (i + 1));
      }
    }
  }

  throw lastError;
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      fn(...args);
    }
  };
};

export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const toTitleCase = (text: string): string => {
  return text
    .split(' ')
    .map((word) => capitalizeFirstLetter(word.toLowerCase()))
    .join(' ');
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const calculateFine = (daysOverdue: number, finePerDay: number = 10): number => {
  return Math.max(0, daysOverdue * finePerDay);
};

export const generateQRCodeData = (cardData: any): string => {
  return JSON.stringify({
    cardNumber: cardData.cardNumber,
    userId: cardData.userId,
    expiryDate: cardData.expiryDate,
    timestamp: new Date().toISOString(),
  });
};

export const parseQueryString = (queryString: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const parts = queryString.split('&');

  parts.forEach((part) => {
    const [key, value] = part.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });

  return params;
};

export const createQueryString = (params: Record<string, any>): string => {
  const parts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });

  return parts.join('&');
};

export const isNetworkConnected = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://www.google.com', { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const parseJSON = <T = any>(json: string, defaultValue?: T): T | null => {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue || null;
  }
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const group = String(item[key]);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
