import got from 'got';
import parser = require('fast-xml-parser');
import request = require('request');
import { options } from '../constants/option/xml_parser_option';

interface BusArriveInfo {
  carNo1: Number;
  carNo2: Number;
  min1: Number;
  min2: Number;
  station1: Number;
  station2: Number;
  lowplate1: Boolean;
  lowplate2: Boolean;
}

interface BusInfo {
  carNo: String;
  gpsTm: String;
  lat: Number;
  lon: Number;
  nodeId: Number;
}

export class BusService {

  public async getSpecificNode(bstopid: Number): Promise<BusArriveInfo> {

    var url = 'http://61.43.246.153/openapi-data/service/busanBIMS2/busStopArr';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('lineid') + '=' + encodeURIComponent('5200190000'); /* */
    queryParams += '&' + encodeURIComponent('bstopid') + '=' + bstopid

    const response = await got.get(url + queryParams);
    var tObj = parser.getTraversalObj(response.body, options);
    var jsonObj = parser.convertToJson(tObj, options);
    if (response.headers['resultCode'] == '99') return Promise.reject('세션 종료');
    console.log("jsonObj : ", jsonObj)

    const item = jsonObj.response.body.items == null
      ? { carNo1: "차량 없음", carNo2: "차량 없음", min1: 999, min2: 999, station1: 999, station2: 999, lowplate1: false, lowplate2: false } : jsonObj.response.body.items;

    console.log(item);

    var arriveInfo: BusArriveInfo = {
      carNo1: item['carNo1'],
      carNo2: item['carNo2'],
      min1: item['min1'],
      min2: item['min1'],
      station1: item['station1'],
      station2: item['station2'],
      lowplate1: item['lowplate'],
      lowplate2: item['lowplate'],
    };

    console.log(arriveInfo);

    return arriveInfo;
  }

  public async getAllNode(): Promise<BusInfo[]> {

    var url = 'http://61.43.246.153/openapi-data/service/busanBIMS2/busInfoRoute';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=R3BdsX99pQj7YTLiUWzWoPMqBWqfOMg9alf9pGA88lx3tknpA5uE04cl0nMrXiCt3X%2BlUzTJ1Mwa8qZAxO6eZA%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('lineid') + '=' + encodeURIComponent('5200190000'); /* */

    var arriveInfo: BusInfo[] = [];

    request({
      url: url + queryParams,
      method: 'GET',
    }, function (error, response, body) {
      //console.log('Status', response.statusCode);
      //console.log('Headers', JSON.stringify(response.headers));

      if (!error && response.statusCode === 200) {
        if (parser.validate(body) === true) {
          var jsonObj = parser.parse(body, options);
        }

        var tObj = parser.getTraversalObj(body, options);
        var jsonObj = parser.convertToJson(tObj, options);

        var tmp = jsonObj.response.body.items.item;
        tmp.forEach(function (value: any) {
          if (value.lat && value.lon) {
            if (String(value.gpsTm).length != 6) value.gpsTm = "0" + value.gpsTm;
            arriveInfo.push({ carNo: value.carNo, nodeId: value.nodeId, lat: value.lat, lon: value.lon, gpsTm: value.gpsTm })
          }
        })

        //console.log(arriveInfo);
      }
    });


    return arriveInfo;
  }
}