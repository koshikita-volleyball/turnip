import dotenv from 'dotenv'
import fs from 'fs'

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

if (JQUANTS_API_TOKEN === '')
  throw new Error('JQUANTS_API_TOKEN is not defined.')

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

const file_name = `stocks.csv`
const headers = [
  'Code',
  'Date',
  'Open',
  'High',
  'Low',
  'Close',
  'Volume',
  'TurnoverValue',
  'AdjustmentFactor',
  'AdjustmentOpen',
  'AdjustmentHigh',
  'AdjustmentLow',
  'AdjustmentClose',
  'AdjustmentVolume',
]
const csv_header = headers.join(',')
fs.writeFile(file_name, csv_header, (err) => {
  if (err) console.error(err)
})

const sorted_stocks = stocks.sort((a, b) => {
  if (a.Code < b.Code) return -1
  if (a.Code > b.Code) return 1
  return 0
})

for (const stock of sorted_stocks) {
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
  const csv_data = []
  for (const price of prices) {
    csv_data.push(
      [
        price.Code,
        price.Date,
        price.Open,
        price.High,
        price.Low,
        price.Close,
        price.Volume,
        price.TurnoverValue,
        price.AdjustmentFactor,
        price.AdjustmentOpen,
        price.AdjustmentHigh,
        price.AdjustmentLow,
        price.AdjustmentClose,
        price.AdjustmentVolume,
      ].join(','),
    )
  }
  fs.appendFile(file_name, `${csv_data.join('\n')}\n`, (err) => {
    if (err) console.error(err)
  })
}
