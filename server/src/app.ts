import dotenv from 'dotenv';
import JQuantsClient from './common/jquants_client';
import ListedInfoStruct from './interface/listed_info';
import { GetRefreshToken } from './common/get_id_token';
import PricesDailyQuotesStruct from './interface/prices_daily_quotes';
import { WebClient, LogLevel } from '@slack/web-api';
import AWS from 'aws-sdk';

dotenv.config();
AWS.config.update({ region: process.env.AWS_REGION });
AWS.config.apiVersions = {
  s3: "2006-03-01",
};

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
    const data = await JQuantsClient<{daily_quotes: PricesDailyQuotesStruct[]}>("/v1/prices/daily_quotes", params)
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

export const slack_notify_handler = async (event: any, context: any) => {

  const slackClient = new WebClient(process.env.SLACK_API_TOKEN, {
    logLevel: LogLevel.DEBUG,
  })

  const channel = process.env.SLACK_NOTICE_CHANNEL!
  const result = await slackClient.chat.postMessage({
    text: '朝７時だよ :tori:',
    channel,
  });

  console.log(`Successfully send message ${result.ts} in conversation ${channel}`);
}

export const using_s3_handler = async (event: any, context: any) => {
  try {
    const s3 = new AWS.S3();
    const bucket = process.env.S3_BUCKET_NAME!;
    const key = 'test.txt';
    const params = {
      Bucket: bucket,
      Key: key,
      Body: 'Hello World!'
    };
    await s3.putObject(params).promise();
    const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    console.log(data.Body?.toString());
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify({
        message: 'hello world',
      })
    }
  } catch (err) {
    console.log(err);
    return {
      'statusCode': 500,
      headers: CORS_HEADERS,
      'body': JSON.stringify({
        message: err,
      })
    }
  }
}

export const refresh_token_updater_handler = async (event: any, context: any) => {
  try {
    const refresh_token = await GetRefreshToken()
    const s3 = new AWS.S3();
    const bucket = process.env.S3_BUCKET_NAME!;
    const key = 'refresh_token.txt';
    const params = {
      Bucket: bucket,
      Key: key,
      Body: refresh_token
    };
    await s3.putObject(params).promise();
    const slackClient = new WebClient(process.env.SLACK_API_TOKEN, {
      logLevel: LogLevel.DEBUG,
    })

    const channel = process.env.SLACK_NOTICE_CHANNEL!
    const THREE_BACK_QUOTES = '```'
    const result = await slackClient.chat.postMessage({
      text: `:tori::tori::tori: リフレッシュトークンを更新しました！ :tori::tori::tori:\n\n${THREE_BACK_QUOTES}\n${refresh_token}\n${THREE_BACK_QUOTES}`,
      channel,
    });
    console.log(`Successfully send message ${result.ts} in conversation ${channel}`);
  } catch (err) {
    console.log(err);
  }
}
