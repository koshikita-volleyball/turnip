// /* eslint-disable */
// import express from 'express'
// import { APIGatewayProxyEvent } from 'aws-lambda'
// import {
//   lambdaHandler,
//   business_day_handler,
//   info_handler,
//   listed_info_handler,
//   prices_daily_quotes_handler,
//   fins_statements_handler,
// } from './app'

// const app = express()

// app.listen(3000)

// // <パス>: <関数>
// const path_func_map = {
//   '/api/hello': lambdaHandler,
//   '/api/business_day': business_day_handler,
//   '/api/info': info_handler,
//   '/api/listed-info': listed_info_handler,
//   '/api/prices-daily_quotes': prices_daily_quotes_handler,
//   '/api/fins-statements': fins_statements_handler,
// }

// // マップをループ
// for (const [path, func] of Object.entries(path_func_map)) {
//   // パスに対して関数を設定
//   app.get(path, async (req: express.Request, res: express.Response) => {
//     // クエリストリングを取得して、queryStringParametersに設定
//     const query = req.query
//     const queryStringParameters = {} as { [key: string]: string }
//     for (const [key, value] of Object.entries(query)) {
//       queryStringParameters[key] = value as string
//     }

//     // イベントオブジェクトを作成
//     const event: APIGatewayProxyEvent = {} as APIGatewayProxyEvent
//     event.queryStringParameters = queryStringParameters

//     const response = await func(event)

//     // レスポンスヘッダにCORSを設定
//     const headers = response.headers || {}
//     headers['Content-Type'] = 'application/json'
//     const body = response.body || ''
//     // ヘッダをループ
//     for (const [key, value] of Object.entries(headers)) {
//       res.setHeader(key, value as string)
//     }
//     return res.send(body)
//   })
// }
