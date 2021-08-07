import got from 'got';

interface ArriveInfo {
  carNo1: Number;
  carNo2: Number;
  min1 : Number;
  min2 : Number;
  lowplate1 : boolean;
  lowplate2 : boolean;
  station1 : Number;
  station2 : Number;
}

export class BusService {
  async getSpecificNode(bstopid : number): Promise<ArriveInfo> {
    var busUrl = `http://61.43.246.153/openapi-data/service/busanBIMS2/busStopArr?serviceKey=R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D&bstopid=${bstopid}&lineid=5200179000`;

    const result = await got.get(busUrl);
    const responseBody = result.body;
    console.log(responseBody);
    const data : ArriveInfo = {
      carNo1: 1,
      carNo2: 2,
      min1 : 1,
      min2 : 2,
      lowplate1 : false,
      lowplate2 : true,
      station1 : 1,
      station2 : 2,
    }
    return data;
  }

  toKSTString = function (): string {
    const now = new Date();
    function pad(number : any) {
      if (number < 10) {
          return "0" + number;
      }
      return number;
    }
    return now.getFullYear() +
      "-" + pad(now.getMonth() + 1) +
      "-" + pad(now.getDate()) +
      " " + pad(now.getHours()) +
      ":" + pad(now.getMinutes()) +
      ":" + pad(now.getSeconds()) +
      "." + (now.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
  }
}
