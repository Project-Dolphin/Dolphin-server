import dayjs from 'dayjs';
import got from 'got';
import cheerio from 'cheerio';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { handleCalendarDate } from '../util/parseCalendarRawText';
import { extractNumber } from '../util/parseNumber';

dayjs.extend(customParseFormat);

export interface Calendar {
  title: string;
  calendar: {
    first: { date: Term; event: string }[];
    second: { date: Term; event: string }[];
  };
}

export interface Term {
  startedAt: string;
  endedAt: string;
}

export class CalendarService {
  public async getAnnualCalendar(): Promise<Calendar> {
    const body = await got.get('https://www.kmou.ac.kr/onestop/cm/cntnts/cntntsView.do?mi=74&cntntsId=1755', {
      headers: {
        Referer: 'https://www.kmou.ac.kr/onestop/cm/cntnts/cntntsView.do?mi=74&cntntsId=1755',
      },
      resolveBodyOnly: true,
    });

    const rawBody = cheerio.load(body);
    const response: Calendar = {
      title: '',
      calendar: {
        first: [],
        second: [],
      },
    };
    response.title = rawBody('.tit1').html()?.toString()?.trim() ?? '';
    const calendarYear = extractNumber(response.title) || dayjs().year();

    rawBody('.table_st_box').each((divIndex, element) => {
      rawBody(element)
        .find('tbody')
        .find('tr')
        .each((index, element) => {
          const calendarEvent: { date: Term; event: string } = { date: { startedAt: '', endedAt: '' }, event: '' };
          rawBody(element)
            .find('td')
            .each((li, el) => {
              const result = rawBody(el).html()?.toString()?.trim() ?? '';
              if (li === 0) {
                calendarEvent.date = handleCalendarDate(result, divIndex, calendarYear);
              } else if (li === 1) {
                calendarEvent.event = result;
              }
            });
          if (divIndex === 0) {
            response.calendar.first.push(calendarEvent);
          } else if (divIndex === 1) {
            response.calendar.second.push(calendarEvent);
          }
        });
    });

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


}

export const calendarService = new CalendarService();
