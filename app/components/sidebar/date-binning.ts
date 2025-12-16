import { format, isAfter, isThisWeek, isThisYear, isToday, isYesterday, subDays } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import type { ChatHistoryItem } from '~/lib/persistence';
import { getTranslation, type Language } from '~/utils/i18n';

type Bin = { category: string; items: ChatHistoryItem[] };

export function binDates(_list: ChatHistoryItem[], language: Language = 'en') {
  const list = _list.toSorted((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  const binLookup: Record<string, Bin> = {};
  const bins: Array<Bin> = [];

  list.forEach((item) => {
    const category = dateCategory(new Date(item.timestamp), language);

    if (!(category in binLookup)) {
      const bin = {
        category,
        items: [item],
      };

      binLookup[category] = bin;

      bins.push(bin);
    } else {
      binLookup[category].items.push(item);
    }
  });

  return bins;
}

function dateCategory(date: Date, language: Language) {
  if (isToday(date)) {
    return getTranslation('today', language);
  }

  if (isYesterday(date)) {
    return getTranslation('yesterday', language);
  }

  const locale = language === 'zh' ? zhCN : enUS;

  if (isThisWeek(date)) {
    // e.g., "Mon" instead of "Monday"
    return format(date, 'EEE', { locale });
  }

  const thirtyDaysAgo = subDays(new Date(), 30);

  if (isAfter(date, thirtyDaysAgo)) {
    return getTranslation('past30Days', language);
  }

  if (isThisYear(date)) {
    // e.g., "Jan" instead of "January"
    return format(date, 'LLL', { locale });
  }

  // e.g., "Jan 2023" instead of "January 2023"
  return format(date, 'LLL yyyy', { locale });
}
