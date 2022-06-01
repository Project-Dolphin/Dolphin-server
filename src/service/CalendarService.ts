import dayjs from 'dayjs';
import got from 'got';
import { academicCalendar, calendar } from '../constants/calendar';
import { holiDay } from '../constants/holiday';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export interface Calendar {
  term: Term;
  mainPlan?: boolean;
  content: string;
  dDay?: number;
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

        const year = isNextYear && (date[0].split('-')[0] === '1' || date[0].split('-')[0] === '2') ? '2022' : '2021';
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
  public getAcademicCalendar(year?: number | null, month?: number | null): Calendar[] {
    if (year && month) {
      return this.getAcademicCalendarByYearMonth(year, month);
    } else {
      return academicCalendar;
    }
  }
  private getAcademicCalendarByYearMonth(year: number, month: number): Calendar[] {
    return academicCalendar.filter((calendar) => this.getYearMonth(calendar.term.startedAt) === `${year}-${month}`);
  }
  private getYearMonth(at: string): string {
    return at.substring(0, 7);
  }
  public getHoliday(): Calendar[] {
    return holiDay;
  }

  public getLatestPlans(): Calendar[] {
    const calendar = academicCalendar;
    const now = new Date();
    const plans = calendar.filter((plan) => {
      const startedAt = new Date(plan.term.startedAt);
      return startedAt.getTime() - now.getTime() > 0;
    });
    const latestPlans = plans.slice(0, 2).map((plan: Calendar) => {
      return {
        ...plan,
        dDay: this.getDay(new Date(plan.term.startedAt).getTime() - now.getTime()),
      };
    });
    return latestPlans;
  }

  public async getHolidays(
    startDate?: string,
    endDate?: string,
  ): Promise<{ holiday: { summary: string; date: string }[] }> {
    if (startDate && !dayjs(startDate, 'YYYY-MM-DD', true).isValid()) {
      throw new Error('startDate is invalid.');
    }
    if (endDate && !dayjs(endDate, 'YYYY-MM-DD', true).isValid()) {
      throw new Error('endDate is invalid.');
    }

    const startDateParam = startDate || `${dayjs().format('YYYY')}-01-01`;
    const endDateParam = endDate || `${dayjs().add(1, 'year').format('YYYY')}-01-01`;

    const getHolidayUrl = `https://www.googleapis.com/calendar/v3/calendars/ko.south_korea%23holiday%40group.v.calendar.google.com/events?key=AIzaSyD9kai-_CPPRv5-Si-s46tMetYIVM5idOc&orderBy=startTime&singleEvents=true&timeMin=${startDateParam}T00:00:00Z&timeMax=${endDateParam}T00:00:00Z`;
    const body: any = await got
      .get(getHolidayUrl, {
        headers: {
          Accept: 'application/json',
        },
      })
      .json();
    const response = body?.items
      ?.filter((item: { description: string }) => item.description === '공휴일')
      .map((item: { summary: string; start: { date: string } }) => ({ summary: item.summary, date: item.start.date }));
    return { holiday: response };
  }

  private getDay(duration: number) {
    return Math.ceil(duration / (60 * 60 * 24 * 1000));
  }
}

export const calendarService = new CalendarService();
