import dayjs from 'dayjs';
import got from 'got';
import cheerio from 'cheerio';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { handleCalendarDate } from '../util/parseCalendarRawText';
import { extractNumber } from '../util/parseNumber';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

interface AnnualCalendar {
  title: string;
  calendar: Calendar[];
}
interface MonthlyCalendar {
  year: number;
  month: number;
  calendar: Calendar[];
}
export interface Calendar {
  term: Term;
  content: string;
}

export interface Term {
  startedAt: string;
  endedAt: string;
}

export interface LatestPlans {
  today: string;
  calendar: ({
    dDay: number;
  } & Calendar)[];
}

export class CalendarService {
  public async getAnnualCalendar(): Promise<AnnualCalendar> {
    const body = await got.get('https://www.kmou.ac.kr/onestop/cm/cntnts/cntntsView.do?mi=74&cntntsId=1755', {
      headers: {
        Referer: 'https://www.kmou.ac.kr/onestop/cm/cntnts/cntntsView.do?mi=74&cntntsId=1755',
      },
      resolveBodyOnly: true,
    });

    const rawBody = cheerio.load(body);
    const response: AnnualCalendar = {
      title: '',
      calendar: [],
    };
    response.title = rawBody('.tit1').html()?.toString()?.trim() ?? '';
    const calendarYear = extractNumber(response.title) || dayjs().year();

    rawBody('.table_st_box').each((divIndex, element) => {
      rawBody(element)
        .find('tbody')
        .find('tr')
        .each((index, element) => {
          const calendarEvent: Calendar = { term: { startedAt: '', endedAt: '' }, content: '' };
          rawBody(element)
            .find('td')
            .each((li, el) => {
              const result = rawBody(el).html()?.toString()?.trim() ?? '';
              if (li === 0) {
                calendarEvent.term = handleCalendarDate(result, divIndex, calendarYear);
              } else if (li === 1) {
                calendarEvent.content = result;
              }
            });
          response.calendar.push(calendarEvent);
        });
    });

    return response;
  }

  public async getMonthlyCalendar(year: number, month: number): Promise<MonthlyCalendar> {
    const { calendar } = await this.getAnnualCalendar();
    const monthlyCalendar = calendar.filter(
      (item) =>
        (dayjs(item.term.startedAt, 'YYYY-M-D').month() === month - 1 ||
          dayjs(item.term.endedAt, 'YYYY-M-D').month() === month - 1) &&
        (dayjs(item.term.startedAt, 'YYYY-M-D').year() === year ||
          dayjs(item.term.endedAt, 'YYYY-M-D').year() === year),
    );
    const response = {
      year,
      month,
      calendar: monthlyCalendar,
    };

    return response;
  }

  public async getLatestPlans(): Promise<LatestPlans> {
    const { calendar } = await this.getAnnualCalendar();
    const latestCalendar = calendar
      .filter((item) => dayjs(item.term.startedAt, 'YYYY-M-D').isAfter(dayjs()))
      .splice(0, 3)
      .map((filteredItem) => ({
        ...filteredItem,
        dDay: dayjs(filteredItem.term.startedAt, 'YYYY.M.D.').diff(dayjs(), 'day') + 1,
      }));
    const response = {
      today: dayjs().format('YYYY-M-D'),
      calendar: latestCalendar,
    };

    return response;
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

    const getHolidayUrl = `https://www.googleapis.com/calendar/v3/calendars/blffot637do35g8hc1hf9a046s%40group.calendar.google.com/events?key=AIzaSyD9kai-_CPPRv5-Si-s46tMetYIVM5idOc&orderBy=startTime&singleEvents=true&timeMin=${startDateParam}T00:00:00Z&timeMax=${endDateParam}T00:00:00Z`;
    const body: any = await got
      .get(getHolidayUrl, {
        headers: {
          Accept: 'application/json',
        },
      })
      .json();
    const response = body?.items
      .map((item: { summary: string; start: { date: string }, end: { date: string } }) => {
        const holidayArray = [];
        for (let i = 0; dayjs.utc(item.start.date, 'YYYY-MM-DD').add(i, 'day').isBefore(dayjs.utc(item.end.date, 'YYYY-MM-DD')); i++) {
          holidayArray.push({ summary: item.summary, date: dayjs.utc(item.start.date, 'YYYY-MM-DD').add(i, 'day').format('YYYY-MM-DD') })
        }
        return holidayArray
      });
    return { holiday: response };
  }
}

export const calendarService = new CalendarService();