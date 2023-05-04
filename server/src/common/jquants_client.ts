import GetIdToken from './get_id_token'
import { base_uri } from './const'
import AWS from './aws'

async function JQuantsClient<T>(
  path: string,
  params: { [key: string]: string } | null = null,
): Promise<T> {
  // S3からIDトークンを取得
  const s3 = new AWS.S3()
  const data = await s3
    .getObject({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: 'refresh_token.txt',
    })
    .promise()
  const refreshToken = data.Body?.toString('utf-8')
  if (!refreshToken) {
    return Promise.reject('refresh_token.txt is empty')
  }
  const id_token = await GetIdToken(refreshToken)
  const query_string = params
    ? '?' +
      Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')
    : ''
  const response = await fetch(`${base_uri}${path}${query_string}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  })
  const json = (await response.json()) as T
  return json
}

export default JQuantsClient
