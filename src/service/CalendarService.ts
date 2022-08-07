import dayjs from 'dayjs';
import got from 'got';
import cheerio from 'cheerio';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { handleCalendarDate } from '../util/parseCalendarRawText';
import { extractNumber } from '../util/parseNumber';
import { cacheClient } from './CachingService';

dayjs.extend(customParseFormat);

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
  private readonly baseKey = 'calendar';
  private readonly cacheTTL = 60 * 60 * 24 * 7; // 일주일

  public async getAnnualCalendar(): Promise<AnnualCalendar> {

    const result = cacheClient.getCache(this.baseKey + '/annual');

    if (result) {
      return result as AnnualCalendar;
    }


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
    cacheClient.setCache(this.baseKey + '/annual', response, this.cacheTTL);

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

    const cacheKey = this.baseKey + '/holiday';
    const cachedResult = cacheClient.getCache(cacheKey);
    if (cachedResult) return cachedResult as any; // TODO: 수정 필요  

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

    cacheClient.setCache(cacheKey, { holiday: response }, this.cacheTTL);
    return { holiday: response };
  }
}

export const calendarService = new CalendarService();
