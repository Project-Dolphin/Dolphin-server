import got from 'got';
import parser = require('fast-xml-parser');
import { options } from '../constants/option/xml_parser_option';
import { depart190 } from '../constants/depart190';
import { checkHoliday, toKSTString } from '../constants/function/commonfunction';

interface BusArriveInfo {
  carNo1: number;
  carNo2: number;
  min1: number;
  min2: number;
  station1: number;
  station2: number;
  lowplate1: boolean;
  lowplate2: boolean;
}

interface BusInfo {
  carNo: string;
  gpsTm: string;
  lat: number;
  lon: number;
  nodeId: number;
  bstopnm: string;
}

interface DepartmentInfo {
  type: string;
  time: string;
}

export class BusService {
  private readonly serviceKey =
    'R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D';

  public getDepart190(): DepartmentInfo[] {
    const date = new Date();
    const now = toKSTString().substr(8, 4);

    const flag: boolean = checkHoliday();

    const type = flag ? 'holiday' : date.getDay() == 6 ? 'saturday' : 'normal';

    const tmp = depart190.filter((schedule) => Number(schedule.time) > Number(now) && schedule.type == type);

    const result = [];

    for (let i = 0; i < 3; i++) {
      if (tmp[i]) result.push(tmp[i]);
      else result.push({ type: 'none', time: '2359' });
    }

    return result;
  }

  public async getSpecificNode(bstopid: string): Promise<BusArriveInfo> {
    const url = 'http://61.43.246.153/openapi-data/service/busanBIMS2/busStopArr';
    let queryParams = '?' + 'ServiceKey' + '=' + this.serviceKey; /* Service Key*/
    queryParams += '&' + 'lineid' + '=' + encodeURIComponent('5200190000'); /* */
    queryParams += '&' + 'bstopid' + '=' + bstopid;

    const response = await got.get(url + queryParams);
    const tObj = parser.getTraversalObj(response.body, options);
    const jsonObj = parser.convertToJson(tObj, options);
    if (response.headers['resultCode'] == '99') return Promise.reject('세션 종료');

    const item =
      JSON.stringify(jsonObj.response.body.items).length > 0
        ? jsonObj.response.body.items.item
        : {
            carNo1: '차량 없음',
            carNo2: '차량 없음',
            min1: 999,
            min2: 999,
            station1: 999,
            station2: 999,
            lowplate1: false,
            lowplate2: false,
          };

    const arriveInfo: BusArriveInfo = {
      carNo1: item.carNo1,
      carNo2: item.carNo2,
      min1: item.min1,
      min2: item.min2,
      station1: item.station1,
      station2: item.station2,
      lowplate1: item.lowplate1,
      lowplate2: item.lowplate2,
    };

    return arriveInfo; // 정상 리턴 확인
  }

  public async getAllNode(): Promise<BusInfo[]> {
    const url =
      'http://61.43.246.153/openapi-data/service/busanBIMS2/busInfoRoute?ServiceKey=R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D&lineid=5200190000';
    /*var queryParams = '?' + 'ServiceKey' + '=' + this.serviceKey;
    queryParams += '&' + 'lineid' + '=' + encodeURIComponent('5200190000');  */

    const arriveInfo: BusInfo[] = [];

    //const response = await got.get(url + queryParams);
    const response = await got.get(url);

    const tObj = parser.getTraversalObj(response.body, options);
    const jsonObj = parser.convertToJson(tObj, options);

    const tmp = jsonObj.response.body.items.item;

    tmp.forEach(function (value: any) {
      if (value.lat && value.lon) {
        if (String(value.gpsTm).length != 6) value.gpsTm = '0' + value.gpsTm;
        arriveInfo.push({
          carNo: value.carNo,
          nodeId: value.nodeId,
          lat: value.lat,
          lon: value.lon,
          gpsTm: value.gpsTm,
          bstopnm: value.bstopnm,
        });
      }
    });

    console.log(arriveInfo);

    return arriveInfo;
  }
}
