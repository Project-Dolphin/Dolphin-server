import { Handler, APIGatewayEvent } from 'aws-lambda';
import { BusService } from './service/BusService';

const dolphin: Handler = async (event: APIGatewayEvent) => {

  const path = event.path;


  return {
    statusCode: 200,
    body: JSON.stringify({
      data: 'success',
      path: path,
    }),
  };
};

export { dolphin };
