import dotenv from 'dotenv';
import JQuantsClient from './common/jquants_client';
import ListedInfoStruct from './interface/listed_info';
import { GetMailAddressAndPassword, GetRefreshToken } from './common/get_id_token';

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
    const data = await JQuantsClient<{info: ListedInfoStruct[]}>("/v1/listed/info")
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify(
        data.info,
      ),
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

export const prices_daily_quotes_handler = async (event: any, context: any) => {
  try {
    const code = event.queryStringParameters?.code
    const date = event.queryStringParameters?.date
    const from = event.queryStringParameters?.from
    const to = event.queryStringParameters?.to
    const params: {[key: string]: string} = {}
    if (code) params['code'] = code
    if (date) params['date'] = date
    if (from) params['from'] = from
    if (to) params['to'] = to
    const data = await JQuantsClient<{daily_quotes: ListedInfoStruct[]}>("/v1/prices/daily_quotes", params)
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify(
        data.daily_quotes,
      ),
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

export const refresh_token_handler = async (event: any, context: any) => {
  try {
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify({
        mailaddress: GetMailAddressAndPassword().mailaddress,
        password: GetMailAddressAndPassword().password,
        refresh_token: GetRefreshToken(),
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

export const weather_handler = async (event: any, context: any) => {
  try {
    const latitude = event.queryStringParameters?.latitude
    const longitude = event.queryStringParameters?.longitude
    const response = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`)).json()
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify(
        response
      ),
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
