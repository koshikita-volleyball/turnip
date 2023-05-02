import dotenv from 'dotenv';

dotenv.config();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export const lambdaHandler = async (event: any, context: any) => {
  try {
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify({
        message: 'hello world',
        env1: process.env.ENV1,
        env2: process.env.ENV2,
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const goodbyeHandler = async (event: any, context: any) => {
  try {
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify({
        message: 'good bye',
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};
