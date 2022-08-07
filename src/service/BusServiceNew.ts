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
import { BusStationGps, BUS_STATION_190_GPS } from '../constants/busStationGps';

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

function getNearestStation(latitude: number, longitude: number) {
    let station: BusStationGps | null = null;
    let distance = 100;

    BUS_STATION_190_GPS.forEach((item: BusStationGps) => {
        const dist = (item.gpsx - latitude) ** 2 + (item.gpsy - longitude) ** 2;
        if (distance > dist) {
            station = item;
            distance = dist;
        }
    });
    return station;
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
        lineno: string;
        min1: number | null;
        min2: number | null;
    }> {
        const lineId = BUS_STOP_ID[busNumber]?.lineId || null;
        const bstopId = BUS_STOP_ID[busNumber]?.bstopId[busStopName] || null;

        if (lineId && bstopId) {
            const { body } = await got.get(
                `${this.baseUrl}/busStopArrByBstopidLineid?servicekey=${this.serviceKey}&bstopid=${bstopId}&lineid=${lineId}`,
            );
            const { min1, min2 } = parseBodyItem(body)?.item ?? { lineno: null, min1: null, min2: null };
            return { busStopName, lineno: busNumber, min1, min2 };
        } else {
            throw new Error('busStopName or busNumber is invalid');
        }
    }

    public async getNearest190(latitude: number, longitude: number) {
        const station = getNearestStation(latitude, longitude);
        console.log(station);
        if (station) {
            const { bstopnm, nodeid } = station as BusStationGps;

            const { body } = await got.get(
                `${this.baseUrl}/busStopArrByBstopidLineid?servicekey=${this.serviceKey}&bstopid=${nodeid}&lineid=5200190000`,
            );

            const { min1, min2 } = parseBodyItem(body)?.item ?? { lineno: null, min1: null, min2: null };

            return { busStopName: bstopnm, lineno: 190, min1, min2 };
        } else {
            throw new Error('Get nearest station is failed');
        }
    }

    public async getBusStationByRouteId(busNumber: string) {
        const lineId = BUS_STOP_ID[busNumber]?.lineId || '';

        if (lineId) {
            const { body } = await got.get(`${this.baseUrl}/busInfoByRouteId?servicekey=${this.serviceKey}&lineid=${lineId}`);
            const rPointIndex = parseBodyItem(body)?.item?.findIndex((item: BusInfo) => item.rpoint);
            const busInfo = parseBodyItem(body)
                ?.item?.slice(rPointIndex)
                .map(async (item: BusInfo) => {
                    if (item.arsno) {
                        const response = await got.get(
                            `${this.baseUrl}/busStopList?servicekey=${this.serviceKey}&arsno=${item.arsno}`,
                        );

                        if (parseBodyItem(response.body)?.item[0]) {
                            const { gpsx, gpsy } = parseBodyItem(response.body)?.item[0];
                            return {
                                ...item,
                                gpsx,
                                gpsy,
                            };
                        } else {
                            const { gpsx, gpsy } = parseBodyItem(response.body)?.item;
                            return {
                                ...item,
                                gpsx,
                                gpsy,
                            };
                        }
                    }
                    return { ...item, gpsx: null, gpsy: null };
                });

            return Promise.all(await busInfo);
        }
        return {};
    }

    public async getBusInfoByRouteId(busNumber: string): Promise<{
        busNumber: string;
        busStopInfo: any;
    }> {
        const lineId = BUS_STOP_ID[busNumber]?.lineId || '';

        if (lineId) {
            const { body } = await got.get(`${this.baseUrl}/busInfoByRouteId?servicekey=${this.serviceKey}&lineid=${lineId}`);
            const busInfo = parseBodyItem(body)?.item?.map((item: BusInfo) => {
                const { bstopnm, rpoint, carno, lowplate, arsno } = item;
                if (carno) {
                    return {
                        bstopnm,
                        rpoint,
                        carno: carno,
                        lowplate,
                        arsno,
                    };
                } else {
                    return {
                        bstopnm,
                        rpoint,
                        arsno,
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
        const isHoliday = holidays.holiday.map((item) => item.date).includes(today.format('YYYY-MM-DD'));
        if (today.day() === 6) {
            departBusList = saturday;
        } else if (today.day() === 0 || isHoliday) {
            departBusList = holiday;
        } else {
            departBusList = weekday;
        }

        const afterBus = departBusList.filter((item) => DayJS(`${item}`, 'HH:mm').tz('Asia/Seoul').isAfter(today));
        const response = afterBus.slice(0, 2).map((bus) => ({
            bus,
            remainMinutes: DayJS(bus, 'HH:mm').tz('Asia/Seoul').diff(today, 'minute'),
        }));

        return { nextDepartBus: response };
    }

    public async getNextShuttle(): Promise<{
        nextShuttle: {
            destination: string;
            time: string;
            remainMinutes: number;
        }[];
    }> {
        const today = DayJS();
        let shuttleList;

        if ([0, 1, 6, 7].includes(today.month())) {
            shuttleList = VACATION_SHUTTLE_TIME;
        } else if (this.checkExamPeriod(today.format('YYYYMMDD'))) {
            shuttleList = EXAM_SHUTTLE_TIME;
        } else {
            shuttleList = NORMAL_SHUTTLE_TIME;
        }

        const afterShuttle = shuttleList.filter((item) => DayJS(`${item.time}`, 'HH:mm').tz('Asia/Seoul').isAfter(today));
        const response = afterShuttle.map((shuttle) => ({
            ...shuttle,
            remainMinutes: DayJS(`${shuttle.time}`, 'HH:mm').tz('Asia/Seoul').diff(today, 'minute'),
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
