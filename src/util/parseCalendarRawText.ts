import { Term } from "../service/CalendarService";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function handleCalendarDate(date: string, divIndex: number, year: number): Term {
  const trimDate = date.replace(/[(()())(월)(화)(수)(목)(금)(토)(일)(\s)]/g, '');
  const splitDate = trimDate.split('~').map((item) =>
    item
      .split('.')
      .filter((item) => !item.includes('’'))
      .join('.'),
  );
  const response = { startedAt: '', endedAt: '' };
  const stringToDate = (date: string) => {
    let fullDate = dayjs(`${year}.${date}`, 'YYYY.M.D.');
    if (divIndex === 1 && fullDate.month() < 6) {
      fullDate = fullDate.add(1, 'year');
    }
    return fullDate.format('YYYY.M.D.');
  };
  if (splitDate.length === 1) {
    response.startedAt = stringToDate(splitDate[0]);
    response.endedAt = stringToDate(splitDate[0]);
  } else if (splitDate.length > 1) {
    response.startedAt = stringToDate(splitDate[0]);
    response.endedAt = stringToDate(splitDate[1]);
  }

  return response;
}