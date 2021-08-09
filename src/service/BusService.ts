import got from 'got';
import { parse } from 'node-html-parser';

interface BusArriveInfo {
  carNo1 : Number;
  carNo2 : Number;
  min1 : Number;
  min2 : Number;
  station1 : Number;
  station2 : Number;
  lowplate1 : Boolean;
  lowplate2 : Boolean;
}

interface BusStopInfo {
  carNo1 : Number;
  carNo2 : Number;
  min1 : Number;
  min2 : Number;
  station1 : Number;
  station2 : Number;
  lowplate1 : Boolean;
  lowplate2 : Boolean;
}

export class BusService {

  public async getSpecificNode(bstopid : Number): Promise<BusArriveInfo> {

    const url = `http://61.43.246.153/openapi-data/service/busanBIMS2/busStopArr?serviceKey=R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D&bstopid=${bstopid}&lineid=5200179000`;

    const response = await got.get(url);
    if(response.headers['resultCode'] == '99') return Promise.reject('세션 종료');

    const item = parse(response.body['items']['item']);

    var arriveInfo :BusArriveInfo = {
      carNo1: item['carNo1'],
      carNo2 : item['carNo2'],
      min1 : item['min1'],
      min2 : item['min1'],
      station1 : item['station1'],
      station2 : item['station2'],
      lowplate1 : item['lowplate'],
      lowplate2 : item['lowplate'],
    };

    return arriveInfo;
  }

  public async getAllNode(): Promise<BusStopInfo[]> {

    const url = `http://61.43.246.153/openapi-data/service/busanBIMS2/busInfoRoute?serviceKey=R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D&lineid=5200190000`;

    const response = await got.get(url);
    if(response.headers['resultCode'] == '99') return Promise.reject('세션 종료');

    const contents = parse(response.body['items']);

    const arriveInfo: BusStopInfo[] = [];

    return arriveInfo;
  }
}
