import AWS from 'aws-sdk'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { type Stock } from '../interface/turnip/stock'
import getProcessEnv from '../common/process_env'

interface GetStocksProps {
  codes?: string[]
  sector_17_codes?: string[]
  sector_33_codes?: string[]
  market_codes?: string[]
  company_name?: string
}

export const getStocks = async (props?: GetStocksProps): Promise<Stock[]> => {
  const ddb = new AWS.DynamoDB()

  // TODO スキャンではなくセカンダリインデックスを使用する。#267
  const params = {
    TableName: getProcessEnv('LISTED_INFO_DYNAMODB_TABLE_NAME')
  }
  const stocks = (((await ddb.scan(params).promise()).Items) ?? [])
    .map(item => unmarshall(item) as Stock)
    .sort((a, b) => a.Code.localeCompare(b.Code))

  if (props == null) {
    return stocks
  }
  const { codes, sector_17_codes: sector17Codes, sector_33_codes: sector33Codes, market_codes: marketCodes, company_name: companyName } = props
  return stocks.filter(
    stock =>
      ((codes == null) || codes.includes(stock.Code)) &&
      ((sector17Codes == null) || sector17Codes.includes(stock.Sector17Code)) &&
      ((sector33Codes == null) || sector33Codes.includes(stock.Sector33Code)) &&
      ((marketCodes == null) || marketCodes.includes(stock.MarketCode)) &&
      ((companyName == null) || stock.CompanyName.includes(companyName))
  )
}

export const getStockByCode = async (code: string): Promise<Stock | null> => {
  const ddb = new AWS.DynamoDB()
  const params = {
    TableName: getProcessEnv('LISTED_INFO_DYNAMODB_TABLE_NAME'),
    Key: {
      Code: {
        S: code
      }
    }
  }
  const result = await ddb.getItem(params).promise()
  if (result.Item == null) {
    return null
  }
  return unmarshall(result.Item) as Stock
}
