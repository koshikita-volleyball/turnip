import AWS from 'aws-sdk'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { Stock } from '../interface/turnip/stock'
import GetProcessEnv from '../common/process_env'

type GetStocksProps = {
  codes?: string[]
  sector_17_codes?: string[]
  sector_33_codes?: string[]
  market_codes?: string[]
}

export const getStocks = async (props?: GetStocksProps): Promise<Stock[]> => {
  const ddb = new AWS.DynamoDB()

  // TODO スキャンではなくセカンダリインデックスを使用する。#267
  const params = {
    TableName: GetProcessEnv('LISTED_INFO_DYNAMODB_TABLE_NAME'),
  }
  const stocks = ((await ddb.scan(params).promise()).Items || [])
    .map(item => unmarshall(item) as Stock)
    .sort((a, b) => a.Code.localeCompare(b.Code))

  if (!props) {
    return stocks
  }
  const { codes, sector_17_codes, sector_33_codes, market_codes } = props
  return stocks.filter(
    stock =>
      (!codes || codes.includes(stock.Code)) &&
      (!sector_17_codes || sector_17_codes.includes(stock.Sector17Code)) &&
      (!sector_33_codes || sector_33_codes.includes(stock.Sector33Code)) &&
      (!market_codes || market_codes.includes(stock.MarketCode)),
  )
}

export const getStockByCode = async (code: string): Promise<Stock | null> => {
  const ddb = new AWS.DynamoDB()
  const params = {
    TableName: GetProcessEnv('LISTED_INFO_DYNAMODB_TABLE_NAME'),
    Key: {
      Code: {
        S: code,
      },
    },
  }
  const result = await ddb.getItem(params).promise()
  if (!result.Item) {
    return null
  }
  return unmarshall(result.Item) as Stock
}

export const getStockByCompanyName = async (company_name: string): Promise<Stock | null> => {
  const stocks = await getStocks()
  const stock = stocks.find(stock => stock.CompanyName === company_name)
  return stock || null
}
