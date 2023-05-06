import { base_uri } from './const'
import GetProcessEnv from './process_env'
import AWS from './aws'

async function JQuantsClient<T>(
  path: string,
  params: { [key: string]: string } | null = null,
): Promise<T> {
  // S3からIDトークンを取得
  const s3 = new AWS.S3()
  const data = await s3
    .getObject({
      Bucket: GetProcessEnv('S3_BUCKET_NAME'),
      Key: 'id_token.txt',
    })
    .promise()
  const idToken = data.Body?.toString('utf-8')
  if (!idToken) {
    return Promise.reject('id_token.txt is empty')
  }
  const query_string = params
    ? '?' +
      Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')
    : ''
  const response = await fetch(`${base_uri}${path}${query_string}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })
  const json = (await response.json()) as T
  return json
}

export default JQuantsClient
