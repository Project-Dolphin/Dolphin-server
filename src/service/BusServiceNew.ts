import got from "got";
import parser from "fast-xml-parser";
import { BUS_STOP_ID } from "../constants/busService";
import cheerio from 'cheerio';

// type busNumberTypes = keyof typeof BUS_STOP_ID;

// type busStopNames = 'busan_station' | 'yeongdo_bridge' | 'kmou_entrance'

interface BusInfo {
    "bstopidx": number,
    "bstopnm": string,
    "nodeid": number,
    "lineno": number,
    "direction": number,
    "gpsym": number,
    "carno": string,
    "lat": number,
    "lin": number,
    "nodekn": number,
    "arsno": number,
    "avgym": number,
    "rpoint": number,
    "lowplate": number,
}

function parseBodyItem(body: string) {
    return parser?.parse(body)?.response?.body?.items;
}

export class BusServiceNew {

    private readonly serviceKey = 'R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D';
    private readonly baseUrl = `http://apis.data.go.kr/6260000/BusanBIMS`;

    public async getSpecificNode(busStopName: string, busNumber: string): Promise<{
        busStopName: string;
        lineno: any;
        min1: any;
        min2: any;
    }> {

        const lineId = BUS_STOP_ID[busNumber]?.lineId;
        const bstopId = BUS_STOP_ID[busNumber]?.bstopId[busStopName];

        try {
            if (lineId && bstopId) {
                const { body } = await got.get(`${this.baseUrl}/busStopArrByBstopidLineid?servicekey=${this.serviceKey}&bstopid=${bstopId}&lineid=${lineId}`);
                const { lineno, min1, min2 } = parseBodyItem(body)?.item
                return { busStopName, lineno, min1, min2 }
            } else {
                throw new Error('busStopName or busNumber is invalid')
            }
        } catch (e) {
            console.log(e)
            throw new Error(e)
        }
    }

    public async getBusInfoByRouteId(busNumber: string): Promise<{
        busNumber: string;
        busStopInfo: any;
    }> {

        const lineId = BUS_STOP_ID[busNumber]?.lineId;

        try {
            if (lineId) {
                const { body } = await got.get(`${this.baseUrl}/busInfoByRouteId?servicekey=${this.serviceKey}&lineid=${lineId}`);
                const busInfo = parseBodyItem(body)?.item?.map((item: BusInfo) => {
                    const { bstopnm, rpoint, carno, lowplate } = item;
                    if (carno) {
                        return {
                            bstopnm, rpoint, carno, lowplate
                        }
                    } else {
                        return {
                            bstopnm, rpoint
                        }
                    }
                })
                return {
                    busNumber,
                    busStopInfo: busInfo
                }
            } else {
                throw new Error('busNumber is invalid')
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    public async getDepartBusTime(): Promise<{
        weekday: string[];
        saturday: string[];
        holiday: string[];
    }> {
        try {

            const body = await got.get('https://www.kmou.ac.kr/kmou/cm/cntnts/cntntsView.do?mi=1418&cntntsId=327', {
                headers: {
                    Referer: 'https://www.kmou.ac.kr/kmou/cm/cntnts/cntntsView.do?mi=1418&cntntsId=327',
                },
                resolveBodyOnly: true
            });

            const rawBody = cheerio.load(body);
            const response: {
                weekday: string[]
                saturday: string[]
                holiday: string[]
            } = {
                weekday: [],
                saturday: [],
                holiday: []
            }
            rawBody('.table_st_box').find('tr').each((index, element) => {
                rawBody(element).find('td').each((li, el) => {
                    const departTime = rawBody(el).html()?.toString()?.trim() ?? ''
                    if (departTime !== '') {
                        if (li < 4) {
                            response.weekday.push(departTime)
                        }
                        else if (li < 8) {
                            response.saturday.push(departTime)
                        } else {
                            response.holiday.push(departTime)
                        }
                    }
                })
            });
            response.weekday.sort()
            response.saturday.sort()
            response.holiday.sort()
            return response;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }
}

export const busServiceNew = new BusServiceNew();