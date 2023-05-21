import { unmarshall } from '@aws-sdk/util-dynamodb'
import type FinsStatementsStruct from '../interface/jquants/fins_statements'
import GetProcessEnv from '../common/process_env'
import AWS from 'aws-sdk'
import { type ExpressionAttributeValueMap } from 'aws-sdk/clients/dynamodb'
import { getDefaultPeriod } from '../common/dayjs'

interface GetFinsStatementsProps {
  code?: string
  date?: string
  from?: string
  to?: string
}

export const getFinsStatements = async ({
  code,
  from,
  to
}: GetFinsStatementsProps): Promise<FinsStatementsStruct[]> => {
  if (code) {
    return await _getFinsStatementsByStock(code, from, to)
  }
  // TODO: セカンダリインデックスを使用すれば実現できるかも
  // if (date) {
  //   return await _getFinsStatementsByDate(date)
  // }
  throw new Error('Missing required parameter: code or date')
}

const _getFinsStatementsByStock = async (
  code: string,
  from?: string,
  to?: string
): Promise<FinsStatementsStruct[]> => {
  const key_condition_expressions = ['LocalCode = :Code']
  const expression_attribute_values: ExpressionAttributeValueMap = {
    ':Code': {
      S: code
    }
  }

  const { from: defaultFrom, to: defaultTo } = getDefaultPeriod()
  key_condition_expressions.push('DisclosedDate BETWEEN :From AND :To')
  expression_attribute_values[':From'] = {
    S: from ?? defaultFrom
  }
  expression_attribute_values[':To'] = {
    S: to ?? defaultTo
  }
  const ddb = new AWS.DynamoDB()
  const params = {
    TableName: GetProcessEnv('FINS_STATEMENTS_DYNAMODB_TABLE_NAME'),
    KeyConditionExpression: key_condition_expressions.join(' AND '),
    ExpressionAttributeValues: expression_attribute_values
  }
  const result = await ddb.query(params).promise()
  if (result.Items == null) {
    return []
  }
  return result.Items.map(item => unmarshall(item) as FinsStatementsStruct)
}
