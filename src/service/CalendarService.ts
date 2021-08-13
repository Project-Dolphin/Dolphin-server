import { academicCalendar, calendar } from '../constants/calendar';
import { holiDay } from '../constants/holiday';

interface Calendar {
  term: Term;
  mainPlan?: boolean;
  content: string;
}

interface Term {
  startedAt: string;
  endedAt: string;
}

export class CalendarService {
  public parseRawText(): Calendar[] {
    let isNextYear = false;
    const schedules = calendar
      .split('\n')
      .map((schedule) => {
        const detail = schedule.split('\t');
        const date = detail[0]
          .replace(/.\(\W\)|\s/g, '')
          .replace(/\./g, '-')
          .split('~');
        const year =
          isNextYear && (date[0].split('-')[0] === '1' || date[0].split('-')[0] === '2')
            ? '2022'
            : '2021';
        let startedAt = date[0];
        let endedAt = date[1] ? date[1] : date[0];
        if (startedAt && startedAt.includes('’22')) {
          startedAt = startedAt.replace(/’22./g, '2022-');
          isNextYear = true;
        } else {
          startedAt = year.concat('-', startedAt);
        }
        if (endedAt && endedAt.includes('’22')) {
          endedAt = endedAt.replace(/’22./g, '2022-');
          isNextYear = true;
        } else {
          endedAt = year.concat('-', endedAt);
        }
        return {
          term: {
            startedAt: startedAt,
            endedAt: endedAt,
          },
          mainPlan: true,
          content: detail[1],
        };
      })
      .filter((schedule) => {
        return schedule.content;
      });

    return schedules;
  }
  public getAcademicCalendar(): Calendar[] {
    return academicCalendar;
  }
  public getHoliday(): Calendar[] {
    return holiDay;
  }
}
