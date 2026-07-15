export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreaks(log: Record<string, { read: boolean }>) {
  const readDates = Object.keys(log)
    .filter((dateStr) => log[dateStr]?.read)
    .sort();

  if (readDates.length === 0) {
    return { currentStreak: 0, highestStreak: 0 };
  }

  // 1. Calculate highest streak
  let highestStreak = 0;
  let currentStreakSeq = 0;
  let prevDate: Date | null = null;

  for (const dateStr of readDates) {
    const currentDate = new Date(dateStr + 'T12:00:00'); // Midday to avoid timezone offset shifts
    if (prevDate === null) {
      currentStreakSeq = 1;
    } else {
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreakSeq += 1;
      } else if (diffDays > 1) {
        currentStreakSeq = 1;
      }
    }
    if (currentStreakSeq > highestStreak) {
      highestStreak = currentStreakSeq;
    }
    prevDate = currentDate;
  }

  // 2. Calculate current streak
  const todayStr = getLocalDateString(new Date());
  const yesterdayStr = getLocalDateString(new Date(Date.now() - 86400000));

  let currentStreak = 0;
  const checkDate = new Date();

  if (log[todayStr]?.read) {
    let dateStr = todayStr;
    while (log[dateStr]?.read) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      dateStr = getLocalDateString(checkDate);
    }
  } else if (log[yesterdayStr]?.read) {
    let dateStr = yesterdayStr;
    checkDate.setDate(checkDate.getDate() - 1);
    while (log[dateStr]?.read) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      dateStr = getLocalDateString(checkDate);
    }
  }

  return { currentStreak, highestStreak };
}

export function getHighestPagesRecord(log: Record<string, { read: boolean; pages?: number }>) {
  let maxPages = 0;
  let recordDate = '';

  Object.keys(log).forEach((dateStr) => {
    const dayPages = log[dateStr]?.pages || 0;
    if (dayPages > maxPages) {
      maxPages = dayPages;
      recordDate = dateStr;
    }
  });

  return { maxPages, recordDate };
}
