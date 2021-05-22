import { Handler, APIGatewayEvent } from 'aws-lambda';

const dolphin: Handler = async (event: APIGatewayEvent) => {
  const path = event.path;
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      path: path,
    }),
  };
};

export { dolphin };
