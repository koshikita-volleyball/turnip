import dotenv from 'dotenv';
import JQuantsClient from './common/jquants_client';
import ListedInfoStruct from './interface/listed_info';

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


export const listed_info_handler = async (event: any, context: any) => {
  try {
    const items: any = await JQuantsClient("/v1/listed/info");
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify({
        "A": items,
      }),
    }
  } catch (err) {
    console.log(err);
    return {
      'statusCode': 500,
      headers: CORS_HEADERS,
      'body': JSON.stringify({
        message: err,
      })
    };
  }
}
