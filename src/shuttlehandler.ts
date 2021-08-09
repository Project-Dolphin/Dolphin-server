import { Handler, APIGatewayEvent } from 'aws-lambda';
import { ShuttleService } from './service/ShuttleService';

const dolphin: Handler = async (event: APIGatewayEvent) => {
  const path = event.path;

  if (path === '/shuttle/next') {
    // 다음 셔틀
    const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getNextShuttle(),
        path: path,
      }),
    };
  }

  if (path === '/shuttle/today') {
    // 그 날의 모든 셔틀
    const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getDayShuttle(),
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
