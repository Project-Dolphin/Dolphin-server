import { Handler, APIGatewayEvent } from 'aws-lambda';
import { BusService } from './service/BusService';

const dolphin: Handler = async (event: APIGatewayEvent) => {

  const path = event.path;
  const querystring = event.pathParameters ? event.pathParameters.bstopid : null

  if (querystring == null) {
    // 운행중인 모든 버스
    const busService = new BusService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: busService.getAllNode(),
        path: path,
      }),
    };
  }

  if (querystring != null) {
    // 특정 정류장의 도착 정보
    const busService = new BusService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: busService.getSpecificNode(querystring),
        path: path,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: 'success',
      path: path,
    }),
  };
};

export { dolphin };
