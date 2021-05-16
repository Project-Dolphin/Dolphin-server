import { Handler } from 'aws-lambda';

const dolphin: Handler = async (event: any) => {
    return {
    statusCode: 200,
    body: JSON.stringify ({
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
    ),
  };
};

export { dolphin };