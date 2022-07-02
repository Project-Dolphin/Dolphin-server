import got from 'got';
import parser from 'fast-xml-parser';
import { BUS_STOP_ID } from '../constants/busService';
import cheerio from 'cheerio';
import DayJS from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { EXAM_SHUTTLE_TIME, NORMAL_SHUTTLE_TIME, VACATION_SHUTTLE_TIME } from '../constants/shuttleNew';
import { examPeriodList } from '../constants/testperiod';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import { calendarService } from './CalendarService';

DayJS.extend(customParseFormat);
DayJS.extend(utc);
DayJS.extend(timezone);

interface BusInfo {
    bstopidx: number;
    bstopnm: string;
    nodeid: number;
    lineno: number;
    direction: number;
    gpsym: number;
    carno: string;
    lat: number;
    lin: number;
    nodekn: number;
    arsno: number;
    avgym: number;
    rpoint: number;
    lowplate: number;
}

function parseBodyItem(body: string) {
    return parser?.parse(body)?.response?.body?.items;
}

export class BusServiceNew {
    private readonly serviceKey =
        'R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D';
    private readonly baseUrl = `http://apis.data.go.kr/6260000/BusanBIMS`;

    public async getSpecificNode(
        busStopName: string,
        busNumber: string,
    ): Promise<{
        busStopName: string;
        lineno: any;
        min1: any;
        min2: any;
    }> {
        const lineId = BUS_STOP_ID[busNumber]?.lineId || '';
        const bstopId = BUS_STOP_ID[busNumber]?.bstopId[busStopName] || '';

        if (lineId && bstopId) {
            const { body } = await got.get(
                `${this.baseUrl}/busStopArrByBstopidLineid?servicekey=${this.serviceKey}&bstopid=${bstopId}&lineid=${lineId}`,
            );
            const { lineno, min1, min2 } = parseBodyItem(body)?.item ?? { lineno: '', min1: '', min2: '' };
            return { busStopName, lineno, min1, min2 };
        } else {
            throw new Error('busStopName or busNumber is invalid');
        }

    }

    public async getBusInfoByRouteId(busNumber: string): Promise<{
        busNumber: string;
        busStopInfo: any;
    }> {
        const lineId = BUS_STOP_ID[busNumber]?.lineId || '';

        if (lineId) {
            const { body } = await got.get(
                `${this.baseUrl}/busInfoByRouteId?servicekey=${this.serviceKey}&lineid=${lineId}`,
            );
            const busInfo = parseBodyItem(body)?.item?.map((item: BusInfo) => {
                const { bstopnm, rpoint, carno, lowplate } = item;
                if (carno) {
                    return {
                        bstopnm,
                        rpoint,
                        carno: carno.toString(),
                        lowplate,
                    };
                } else {
                    return {
                        bstopnm,
                        rpoint,
                    };
                }
            });
            return {
                busNumber,
                busStopInfo: busInfo,
            };
        } else {
            throw new Error('busNumber is invalid');
        }

    }

    public async getDepartBusTime(): Promise<{
        weekday: string[];
        saturday: string[];
        holiday: string[];
    }> {
        const body = await got.get('https://www.kmou.ac.kr/kmou/cm/cntnts/cntntsView.do?mi=1418&cntntsId=327', {
            headers: {
                Referer: 'https://www.kmou.ac.kr/kmou/cm/cntnts/cntntsView.do?mi=1418&cntntsId=327',
            },
            resolveBodyOnly: true,
        });

        const rawBody = cheerio.load(body);
        const response: {
            weekday: string[];
            saturday: string[];
            holiday: string[];
        } = {
            weekday: [],
            saturday: [],
            holiday: [],
        };
        rawBody('.table_st_box')
            .find('tr')
            .each((index, element) => {
                rawBody(element)
                    .find('td')
                    .each((li, el) => {
                        const departTime = rawBody(el).html()?.toString()?.trim() ?? '';
                        if (departTime !== '') {
                            if (li < 4) {
                                response.weekday.push(departTime);
                            } else if (li < 8) {
                                response.saturday.push(departTime);
                            } else {
                                response.holiday.push(departTime);
                            }
                        }
                    });
            });
        response.weekday.sort();
        response.saturday.sort();
        response.holiday.sort();
        return response;

    }

    public async getNextDepartBus(): Promise<{
        nextDepartBus: {
            bus: string;
            remainMinutes: number;
        }[];
    }> {

        const today = DayJS().tz('Asia/Seoul');

        const { weekday, saturday, holiday } = await this.getDepartBusTime();
        let departBusList;
        const holidays = await calendarService.getHolidays();
        const isHoliday = holidays.holiday.map(item => item.date).includes(today.format('YYYY-MM-DD'))
        if (today.day() === 6) {
            departBusList = saturday;
        } else if (today.day() === 0 || isHoliday) {
            departBusList = holiday;
        } else {
            departBusList = weekday;
        }

        const afterBus = departBusList.filter((item) => DayJS(`${item}`, 'HH:mm').isAfter(today));
        const response = afterBus.map((bus) => ({
            bus,
            remainMinutes: DayJS(bus, 'HH:mm').diff(today, 'minute'),
        }));

        return { nextDepartBus: response }


    }

    public async getNextShuttle(): Promise<
        {
            nextShuttle: {
                destination: string;
                time: string;
                remainMinutes: number;
            }[]
        }
    > {


        const today = DayJS().tz('Asia/Seoul');
        let shuttleList;

        if ([0, 1, 6, 7].includes(today.month())) {
            shuttleList = VACATION_SHUTTLE_TIME;
        } else if (this.checkExamPeriod(today.format('YYYYMMDD'))) {
            shuttleList = EXAM_SHUTTLE_TIME;
        } else {
            shuttleList = NORMAL_SHUTTLE_TIME;
        }

        const afterShuttle = shuttleList.filter((item) => DayJS(`${item.time}`, 'HH:mm').isAfter(today));
        const response = afterShuttle.map((shuttle) => ({
            ...shuttle,
            remainMinutes: DayJS(`${shuttle.time}`, 'HH:mm').diff(today, 'minute'),
        }));

        return { nextShuttle: response };
    }

    private checkExamPeriod(today: string): boolean {
        // TODO : 홈페이지 크롤링 한 최신 일정 참조하도록 수정 필요
        let isExamPeriod = false;
        examPeriodList.forEach((period) => {
            if (today >= period.term.startedAt && today <= period.term.endedAt) {
                isExamPeriod = true;
                return false;
            }

            return true;
        });

        return isExamPeriod;
    }
}

export const busServiceNew = new BusServiceNew();
