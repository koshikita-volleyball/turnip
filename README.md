# turnip

株価予測プログラム！！！  

![Logo](./logo.svg)  

## 開発環境の構築方法

### クライアントサイド

`.env.local.example`ファイルをリネームして、`.env.local`ファイルを作成します。  
ファイルの内容は適宜変更してください。  

次に以下のコマンドを実行します。  

```shell
yarn dev
```

これを実行するためには、Node.jsが必要です。  

### サーバサイド

準備として、`.env.example`ファイルをリネームして、`.env`ファイルを作成します。  
ファイルの内容は適宜変更してください。  

最初にAWS CLIをインストールします。  
<https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2.html>  

以下のコマンドを実行して、AWS CLIのバージョンが表示されればOKです。  

```shell
aws --version
```

認証情報を設定します。  

```shell
aws configure
```

以下のように聞かれるので、適宜入力してください。

```shell
AWS Access Key ID [None]: アクセスキーID
AWS Secret Access Key [None]: シークレットアクセスキー
Default region name [None]: リージョン名
Default output format [None]: json
```

これらの情報は、AWSのコンソール画面から確認できます。  
IAMのページから指定のユーザを選択肢、アクセスキーを発行してください。  

続いて、AWS SAMをインストールします。  
こちらはサーバレスアプリケーションを構築するためのツールです。  
<https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html>  

以下のコマンドを実行して、AWS SAMのバージョンが表示されればOKです。  

```shell
sam --version
```

サーバサイドアプリケーションを開発用に実行するためには、以下のコマンドを実行します。  
ビルドにはDockerが必要です。  

```shell
sam build --use-container
sam local start-api
```

<http://localhost:3000/api/hello>にリクエストを投げて、`hello world`が返ってくればOKです。  

## 本番環境の準備

### GitHub Secretsの設定

| キー | バリュー |
| --- | --- |
| PROJECT_NAME | プロジェクト名(CloudFormationのスタック名) |
| AWS_ACCESS_KEY_ID | AWSのアクセスキーID |
| AWS_SECRET_ACCESS_KEY | AWSのシークレットアクセスキー |
| AWS_REGION | リージョン名 |
| LAMBDA_DOTENV | Lambda関数で使用する`.env`ファイルの内容 |
| NEXTJS_ENV_LOCAL | Next.jsで使用する`.env.local`ファイルの内容 |

## ステージング環境の構築と削除

`staging/***`という名前のブランチを作成してプッシュすると、自動的にステージング環境が構築されます。  
クラウドフォーメーションのスタック名は`<プロジェクト名>-staging-***`となります。  

この環境を削除するためには、以下のコマンドを実行します。  

```shell
sam delete --stack-name <プロジェクト名>-staging-***
```

AWSコンソールでひとつひとつリソースを削除すると消し忘れが発生する危険性があるため、原則としてこのコマンドを使用してください。  

## 環境情報

| 環境 | バージョン |
| --- | --- |
| Node.js | v18.12.1 |
| AWS CLI | 2.11.16 |
| SAM CLI | 1.82.0 |

## 使用している技術

- GitHub
  - GitHub Repository
  - GitHub Actions
  - GitHub Pages
- Next.js
  - TypeScript
  - ESLint
  - Bootstrap
  - React
- Lambda
  - TypeScript
  - Serverless Application Model
  - CloudFormation
- AWS
  - Lambda
  - S3
  - DynamoDB
  - API Gateway
  - CloudWatch
- Docker
- Slack API

## IAMの権限

以下の権限を付しています。  
かなり強力な権限を与えています、、、  

- AmazonAPIGatewayAdministrator
- AmazonAPIGatewayInvokeFullAccess
- AmazonAPIGatewayPushToCloudWatchLogs
- AmazonDynamoDBFullAccess
- AmazonS3FullAccess
- AWSLambda_FullAccess
- CloudWatchEventsFullAccess
- CloudWatchFullAccess
- IAMFullAccess
- IAMUserChangePassword
