import { base_uri } from './const'
import { JQUANTS_MAILADDRESS, JQUANTS_PASSWORD } from './process_env'

type RefreshTokenResponseStruct = {
  refreshToken: string
}
type IdTokenResponseStruct = {
  idToken: string
}

function GetMailAddressAndPassword(): {
  mailaddress: string
  password: string
} {
  const mailaddress = JQUANTS_MAILADDRESS
  const password = JQUANTS_PASSWORD
  return { mailaddress, password }
}

async function GetRefreshToken(): Promise<string> {
  const { mailaddress, password } = GetMailAddressAndPassword()
  const response_refresh_token = await fetch(`${base_uri}/v1/token/auth_user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mailaddress,
      password,
    }),
  })
  const refresh_token = ((await response_refresh_token.json()) as RefreshTokenResponseStruct)
    .refreshToken
  return refresh_token
}

async function GetIdToken(refresh_token: string): Promise<string> {
  const response_id_token = await fetch(
    `${base_uri}/v1/token/auth_refresh?refreshtoken=${refresh_token}`,
    {
      method: 'POST',
    },
  )
  const id_token = ((await response_id_token.json()) as IdTokenResponseStruct).idToken
  return id_token
}

export default GetIdToken
export { GetRefreshToken, GetMailAddressAndPassword }
