import dayjs from 'dayjs';
import { BusTimeTableRepositoryImpl } from '../infrastructure/BusTimeTableRepositoryImpl';
import { BusTime, BusTimeTableRepository } from '../repository/BusRepository';

export enum BusType {
    UNIV = 'UNIV',
    CITY = 'CITY'
}

interface ArriavalInfo {
    remain: number;
}

interface BusInfoV3 {
    name: string;
    arrivalInfos: ArriavalInfo[];
}

export class BusServiceV3 {
    private readonly repository: BusTimeTableRepository;

    constructor(repository: BusTimeTableRepository) {
        this.repository = repository;
    }


    async findAllBus(type: BusType, busStop: string, at: Date = new Date()): Promise<BusInfoV3[]> { // type: UNIV, CITY

        switch (type) {
            case BusType.CITY:
                // 190이고 from이 해양대구본관인 경우
                // 그 외
                return await this.getCityBusTime();
            case BusType.UNIV:
                return await this.getShuttleBusTime();
            default:
                return [];
        }
    }
    private async getShuttleBusTime(): Promise<BusInfoV3[]> {
        const shuttleBusTimeTable = await this.repository.findAll<BusTime>('/shuttle');
        // console.log(shuttleBusTimeTable);
        const now = dayjs();
        const arrivalInfos: ArriavalInfo[] = shuttleBusTimeTable.slice(0, 3).map((busTime) => {
            return {
                remain: 10,
            }
        })

        console.log(now);
        return [{ name: '순환버스', arrivalInfos: arrivalInfos }];
    }
    private async getCityBusTime(): Promise<BusInfoV3[]> {
        return [{
            name: '190',
            arrivalInfos: [{ remain: 120 }, { remain: 210 }, { remain: 240 }]
        }, {
            name: '101',
            arrivalInfos: [{ remain: 120 }, { remain: 210 }, { remain: 240 }]
        }, {
            name: '66',
            arrivalInfos: [{ remain: 120 }, { remain: 210 }, { remain: 240 }]
        }];
    }
}

export const busService = new BusServiceV3(new BusTimeTableRepositoryImpl());