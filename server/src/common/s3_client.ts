import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import GetProcessEnv from './process_env'

// S3 クライアントを作成。
let s3Client: S3Client

const environment = GetProcessEnv('ENVIRONMENT')
switch (environment) {
  // 本番環境とステージング環境では、AWSのS3を利用。
  case 'production':
  case 'development':
    s3Client = new S3Client({
      region: GetProcessEnv('AWS_REGION')
    })
    break
  // ローカル環境では、MinIOを利用。
  default:
    s3Client = new S3Client({
      region: GetProcessEnv('AWS_REGION'),
      endpoint: 'http://localhost:9000',
      credentials: {
        accessKeyId: 'minio',
        secretAccessKey: 'minio-password'
      },
      forcePathStyle: true // MinIOでは必須。
    })
}

export {
  s3Client,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand
}
