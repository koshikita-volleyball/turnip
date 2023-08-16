import { baseUri } from './const'
import getProcessEnv from './process_env'
import AWS from './aws'

async function JQuantsClient<T> (
  path: string,
  params: Record<string, string> | null = null
): Promise<T> {
  // S3からIDトークンを取得
  const s3 = new AWS.S3()
  const data = await s3
    .getObject({
      Bucket: getProcessEnv('S3_BUCKET_NAME'),
      Key: 'id_token.txt'
    })
    .promise()
  const idToken = data.Body?.toString('utf-8')
  if (idToken === undefined) {
    throw new Error('id_token.txt is empty.')
  }
  const queryString = (params != null)
    ? '?' +
      Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')
    : ''
  const response = await fetch(`${baseUri}${path}${queryString}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  })
  const json = (await response.json()) as T
  return json
}

export default JQuantsClient
