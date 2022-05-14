import got from "got";
import parser from "fast-xml-parser";
import { BUS_STOP_ID } from "../constants/busService";

type busNumberTypes = keyof typeof BUS_STOP_ID;

type busStopNames = 'busan_station' | 'yeongdo_bridge' | 'kmou_entrance'

function parseBodyItem(body: string) {
    return parser?.parse(body)?.response?.body?.items;
}

export class BusServiceNew {

    private readonly serviceKey = 'R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D';
    private readonly baseUrl = `http://apis.data.go.kr/6260000/BusanBIMS`;

    public async getSpecificNode(busStopName: string, busNumber: string) {

        const lineId = BUS_STOP_ID[busNumber]?.lineId;
        const bstopId = BUS_STOP_ID[busNumber]?.bstopId[busStopName];

        try {
            if (lineId && bstopId) {
                const { body } = await got.get(`${this.baseUrl}/busStopArrByBstopidLineid?servicekey=${this.serviceKey}&bstopid=${bstopId}&lineid=${lineId}`);
                return parseBodyItem(body)
            }
        } catch (e) {
            console.log(e)
        }
    }

    public async getBusInfoByRouteId(busNumber: string) {

        const lineId = BUS_STOP_ID[busNumber]?.lineId;

        try {
            if (lineId) {
                const { body } = await got.get(`${this.baseUrl}/busInfoByRouteId?servicekey=${this.serviceKey}&lineid=${lineId}`);
                return parseBodyItem(body)
            }
        } catch (e) {
            console.log(e)
        }
    }
}