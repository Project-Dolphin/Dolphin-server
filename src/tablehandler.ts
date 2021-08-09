import { Handler, APIGatewayEvent } from 'aws-lambda';
import { BusService } from './service/BusService';
import { ShuttleService } from './service/ShuttleService';

const dolphin: Handler = async (event: APIGatewayEvent) => {
  const path = event.path;

  if (path === '/timetable/190') {
    // 특정 정류장의 도착 정보
    const busService = new BusService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: busService.getDepart190(),
        path: path,
      }),
    };
  }

  if (path === '/timetable/shuttle') {
    // 모든 셔틀
    const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getAllShuttle(),
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
