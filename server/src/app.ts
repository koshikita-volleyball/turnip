import dotenv from 'dotenv';
import JQuantsClient from './common/jquants_client';
import ListedInfoStruct from './interface/listed_info';
import { GetRefreshToken } from './common/get_id_token';
import PricesDailyQuotesStruct from './interface/prices_daily_quotes';
import { base_uri } from './common/const';
import { getBusinessDays } from './analysis/utils';
import { WebClient, LogLevel } from '@slack/web-api';
import AWS from 'aws-sdk';
import GetIdToken from './common/get_id_token';

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

// テクニカル系のハンドラー

// TODO: レスポンスの型をまとめたい
type ResponseGrowthRateClose = {
  code: string,
  growth_rate: number,
  daily_quotes: {
    before: PricesDailyQuotesStruct,
    after: PricesDailyQuotesStruct,
  }
}

/**
 * 前営業日からの終値の変化率が一定以上の銘柄を返す。
 */
export const growth_rate_close_handler = async (event: any, context: any) => {
  
  // 閾値を取得
  const threshold = parseFloat(event.queryStringParameters?.threshold)

  const res : ResponseGrowthRateClose[]  = []
  
  const dates = await getBusinessDays()
  const { daily_quotes:daily_quotes_before } = await JQuantsClient<{daily_quotes: PricesDailyQuotesStruct[]}>("/v1/prices/daily_quotes", {
    date: dates[dates.length - 2].format('YYYY-MM-DD'),
  })
  
  const { daily_quotes:daily_quotes_after } = await JQuantsClient<{daily_quotes: PricesDailyQuotesStruct[]}>("/v1/prices/daily_quotes", {
    date: dates[dates.length - 1].format('YYYY-MM-DD'),
  })

  // prices_beforeをfor文で回して、prices_afterの中にある銘柄を探す
  for(const dq_before of daily_quotes_before) {
    
    const dq_after = daily_quotes_after.find(dq => dq.Code === dq_before.Code)
    if (!dq_after || !dq_before.Close || !dq_after.Close) continue
    
    const growth_rate = (dq_after.Close - dq_before.Close) / dq_before.Close
    if (!threshold || growth_rate > threshold) {
      res.push({
        code: dq_before.Code,
        growth_rate,
        daily_quotes: {
          before: dq_before,
          after: dq_after,
        }
      })
    }
  }
  res.sort((a, b) => b.growth_rate - a.growth_rate)

  return {
    'statusCode': 200,
    headers: CORS_HEADERS,
    'body': JSON.stringify(res),
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

export const id_token_updater_handler = async (event: any, context: any) => {
  try {
    // S3からリフレッシュトークンを取得
    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: "refresh_token.txt",
    };
    const data = await s3.getObject(params).promise();
    const refreshToken = data.Body?.toString('utf-8');
    if (refreshToken) {
      // リフレッシュトークンを使ってIDトークンを更新
      const id_token = GetIdToken(refreshToken);
      // S3にIDトークンを保存
      const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: "id_token.txt",
        Body: id_token,
      };
      await s3.putObject(params).promise();

      // Slackに通知
      const slackClient = new WebClient(process.env.SLACK_API_TOKEN, {
        logLevel: LogLevel.DEBUG,
      })
      const channel = process.env.SLACK_NOTICE_CHANNEL!
      const THREE_BACK_QUOTE = "```";
      const result = await slackClient.chat.postMessage({
        text: `:tori::tori::tori: IDトークンを更新しました :tori::tori::tori:\n\n${THREE_BACK_QUOTE}${id_token}${THREE_BACK_QUOTE}`,
        channel,
      });
      console.log(`Successfully send message ${result.ts} in conversation ${channel}`);
    } else {
      console.log("refresh_token.txt is empty");
    }
  } catch (err) {
    console.log(err);
  }
}
