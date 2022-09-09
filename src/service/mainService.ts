import dayjs from "dayjs";
import { CalendarService } from "./CalendarService";
import "dayjs/plugin/utc"
import "dayjs/plugin/timezone"

export type DateType = "시험기간" | '공휴일' | '주말' | '방학' | '평일';

const toDayJs = (date: string | null, dateFormat: string) => dayjs.tz(date, dateFormat, 'Asia/Seoul')

export class MainService {

    private today = dayjs();

    public async getTodayDateType(): Promise<DateType> {
        const calendarService = new CalendarService();
        const { holiday } = await calendarService.getHolidays();
        const { calendar } = await calendarService.getAnnualCalendar();

        const TEST_PERIOD_CONTENT = ['제1학기 중간시험', '제1학기 기말시험', '제2학기 중간시험', '제2학기 기말시험']
        const vacationDate = {
            summerStart: {
                content: '여름방학 시작',
                term: {
                    startedAt: null,
                    endedAt: null
                }
            },
            summerEnd: {
                content: '제2학기 개강',
                term: {
                    startedAt: null,
                    endedAt: null
                }
            },
            winterStart: {
                content: '겨울방학 시작',
                term: {
                    startedAt: null,
                    endedAt: null
                }
            },
            winterEnd: {
                content: '제1학기 개강',
                term: {
                    startedAt: null,
                    endedAt: null
                }
            },
        }


        const testPeriod = calendar.filter(({ content }) => TEST_PERIOD_CONTENT.includes(content));
        calendar.forEach(({ content, term }) => {
            const index = Object.values(vacationDate).map(value => value.content).findIndex(element => element === content)
            if (index !== -1) {
                vacationDate[Object.keys(vacationDate)[index]].term = term
            }
        })

        const isTestPeriod = testPeriod.some(({ term }) =>
            this.today.isAfter(toDayJs(term.startedAt, 'YYYY-M-D').startOf('day')) && this.today.isBefore(toDayJs(term.endedAt, 'YYYY-M-D').endOf('day')));
        const isWeekend = [0, 6].includes(this.today.day());
        const isHoliday = holiday.some(({ date }) => toDayJs(date, 'YYYY-MM-DD').isSame(this.today, 'day'));
        const isAfterSummerStart = this.today.isAfter(toDayJs(vacationDate.summerStart.term.startedAt, 'YYYY-M-D').startOf('day'));
        const isBeforeSummerEnd = this.today.isBefore(toDayJs(vacationDate.summerEnd.term.startedAt, 'YYYY-M-D').startOf('day'));
        const isAfterWinterStart = this.today.isAfter(toDayJs(vacationDate.winterStart.term.startedAt, 'YYYY-M-D').startOf('day'));
        const isBeforeWinterEnd = this.today.isBefore(toDayJs(vacationDate.winterEnd.term.startedAt, 'YYYY-M-D').startOf('day'));

        if (isTestPeriod) {
            return '시험기간'
        } else if (isWeekend) {
            return '주말';
        }
        else if (isHoliday) {
            return '공휴일'
        } else if (isAfterSummerStart && isBeforeSummerEnd) {
            return '방학'
        } else if (isAfterWinterStart || isBeforeWinterEnd) {
            return '방학'
        }
        return '평일'
    }



}

export const mainService = new MainService();
