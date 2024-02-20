import axios from 'axios';
import cheerio from 'cheerio';

enum BusType {
    UNIV = 'UNIV',
    CITY = 'CITY'
}

interface ArriavalInfo {
    remain: string;
    arriavalTime: string;
}

interface BusInfoV3 {
    busName: string;
    arrivalInfos: ArriavalInfo[];
}

export class BusServiceV3 {
    async findAllBus(type: BusType, from: string, at: Date = new Date()): Promise<BusInfoV3[]> { // type: UNIV, CITY
        return [{
            busName: '순환버스',
            arrivalInfos: []
        }];
    }
    public async getDepartBusTime(): Promise<any[]> {
        const result = await axios.get('https://www.kmou.ac.kr/kmou/cm/cntnts/cntntsView.do?mi=1418&cntntsId=327', {
            headers: {
                Referer: 'https://www.kmou.ac.kr/kmou/cm/cntnts/cntntsView.do?mi=1418&cntntsId=327',
            },
        });

        console.log(result);

        const rawBody = cheerio.load(result.data);
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
        console.log(response);

        return [];
    }


    public async getNextDepartBus(): Promise<{
        nextDepartBus: {
            bus: string;
            remainMinutes: number;
        }[];
    }> {

        return { nextDepartBus: [{ bus: '', remainMinutes: 10 }] };
    }
}