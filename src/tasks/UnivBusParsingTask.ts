import axios from 'axios';
import { BusTimeTableRepository } from '../repository/BusRepository';
import cheerio from 'cheerio';

export class UnivBusParsingTask {
    private readonly repository: BusTimeTableRepository;

    constructor(repository: BusTimeTableRepository) {
        this.repository = repository;
    }

    async run() {
        const rawData = await this.getRawData();
        const parsedData = await this.parseRawData(rawData);

        // TODO: 타입별로 저장

        const busTimeTableAtHoliday = parsedData.holiday.map((time) => {
            return {
                busType: 'UNIV',
                operationType: 'HOLIDAY',
                from: 'UNIV',
                to: '',
                time: time
            }
        });
        const busTimeTableAtSaturday = parsedData.saturday.map((time) => {
            return {
                busType: 'UNIV',
                operationType: 'SATURDAY',
                from: 'UNIV',
                to: '',
                time: time
            }
        });
        const busTimeTableAtWeekday = parsedData.weekday.map((time) => {
            return {
                busType: 'UNIV',
                operationType: 'WEEKDAY',
                from: 'UNIV',
                to: '',
                time: time
            }
        });

        const busInfos = [...busTimeTableAtHoliday, ...busTimeTableAtSaturday, ...busTimeTableAtWeekday];

        for (const busTime of busInfos) {
            await this.repository.save(busTime);
        }
    }

    private async getRawData() {
        const result = await axios.get('https://www.kmou.ac.kr/kmou/cm/cntnts/cntntsView.do?mi=1418&cntntsId=327', {
            headers: {
                Referer: 'https://www.kmou.ac.kr/kmou/cm/cntnts/cntntsView.do?mi=1418&cntntsId=327',
            },
        });
        return result.data;
    }

    private async parseRawData(rawData: string) {
        const rawBody = cheerio.load(rawData);
        const busData: {
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
                                busData.weekday.push(departTime);
                            } else if (li < 8) {
                                busData.saturday.push(departTime);
                            } else {
                                busData.holiday.push(departTime);
                            }
                        }
                    });
            });
        busData.weekday.sort();
        busData.saturday.sort();
        busData.holiday.sort();
        return busData;
    }


}