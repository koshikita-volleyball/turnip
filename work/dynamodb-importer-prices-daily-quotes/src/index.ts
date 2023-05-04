import dotenv from 'dotenv'
import pkg from 'aws-sdk'
const { DynamoDB } = pkg

dotenv.config()

type ListedInfoStruct = {
  Date: Date
  Code: string
  CompanyName: string
  CompanyNameEnglish: string
  Sector17Code: string
  Sector17CodeName: string
  Sector33Code: string
  Sector33CodeName: string
  ScaleCategory: string
  MarketCode: string
  MarketCodeName: string
}
type PricesDailyQuotesStruct = {
  Date: Date
  Code: string
  Open: number
  High: number
  Low: number
  Close: number
  Volume: number
  TurnoverValue: number
  AdjustmentFactor: number
  AdjustmentOpen: number
  AdjustmentHigh: number
  AdjustmentLow: number
  AdjustmentClose: number
  AdjustmentVolume: number
}

const JQUANTS_API_TOKEN = process.env.JQUANTS_API_TOKEN || ''
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || ''

if (JQUANTS_API_TOKEN === '')
  throw new Error('JQUANTS_API_TOKEN is not defined.')
if (DYNAMODB_TABLE_NAME === '')
  throw new Error('DYNAMODB_TABLE_NAME is not defined.')

// 銘柄コード一覧を取得
await fetch('http://example.com')
const { info: stocks }: { info: ListedInfoStruct[] } = await (
  await fetch('https://api.jquants.com/v1/listed/info', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JQUANTS_API_TOKEN}`,
    },
  })
).json()

let n = 0

for (const stock of stocks) {
  n++
  console.log(
    `★★★ [${n}/${stocks.length}] ${stock.Code} - ${stock.CompanyName}`,
  )

  // 銘柄コードを指定して株価を取得
  const { daily_quotes: prices }: { daily_quotes: PricesDailyQuotesStruct[] } =
    await (
      await fetch(
        `https://api.jquants.com/v1/prices/daily_quotes?code=${stock.Code}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${JQUANTS_API_TOKEN}`,
          },
        },
      )
    ).json()

  // DynamoDBのインスタンスを生成
  const dynamodb = new DynamoDB.DocumentClient({
    region: 'ap-northeast-1',
  })
  let i = 0
  for (const price of prices) {
    i++
    console.log(
      `☆☆☆ [${i}/${prices.length}] ${price.Date} | ${price.Open} | ${price.Close}`,
    )
    try {
      // 株価をDynamoDBに保存
      await dynamodb
        .put({
          TableName: DYNAMODB_TABLE_NAME,
          Item: {
            Code: stock.Code,
            Date: price.Date,
            Open: price.Open,
            High: price.High,
            Low: price.Low,
            Close: price.Close,
            Volume: price.Volume,
            TurnoverValue: price.TurnoverValue,
            AdjustmentFactor: price.AdjustmentFactor,
            AdjustmentOpen: price.AdjustmentOpen,
            AdjustmentHigh: price.AdjustmentHigh,
            AdjustmentLow: price.AdjustmentLow,
            AdjustmentClose: price.AdjustmentClose,
            AdjustmentVolume: price.AdjustmentVolume,
          },
        })
        .promise()
    } catch (error) {
      console.error(
        `[ERROR] Code: ${stock.Code}, Date: ${price.Date} | ${error}`,
      )
    }
  }
}
