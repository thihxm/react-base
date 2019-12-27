import { format as formatTZ } from 'date-fns-tz';
import * as locales from 'date-fns/locale';

export default function formatTime(...args) {
  const time = args[0];
  const timeZone = args[1];
  const locale = args.length > 2 && args[2] !== undefined ? args[2] : 'enUS';
  const mask = args.length > 3 ? args[3] : undefined;
  let text = formatTZ(time, 'HH:mm', {
    locale: locales[locale],
    timeZone
  });

  if (mask && text.length < mask.length) {
    text = ['enUS'].includes(locale) ? '0'.concat(text) : text;
  }

  return text;
}
