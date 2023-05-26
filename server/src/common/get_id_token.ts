import { baseUri } from './const'
import GetProcessEnv from './process_env'

interface RefreshTokenResponseStruct {
  refreshToken: string
}
interface IdTokenResponseStruct {
  idToken: string
}

function GetMailAddressAndPassword (): {
  mailaddress: string
  password: string
} {
  const mailaddress = GetProcessEnv('JQUANTS_MAILADDRESS')
  const password = GetProcessEnv('JQUANTS_PASSWORD')
  return { mailaddress, password }
}

async function GetRefreshToken (): Promise<string> {
  const { mailaddress, password } = GetMailAddressAndPassword()
  const responseRefreshToken = await fetch(`${baseUri}/v1/token/auth_user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mailaddress,
      password
    })
  })
  const refreshToken = ((await responseRefreshToken.json()) as RefreshTokenResponseStruct)
    .refreshToken
  return refreshToken
}

async function GetIdToken (refreshToken: string): Promise<string> {
  const responseIdToken = await fetch(
    `${baseUri}/v1/token/auth_refresh?refreshtoken=${refreshToken}`,
    {
      method: 'POST'
    }
  )
  const idToken = ((await responseIdToken.json()) as IdTokenResponseStruct).idToken
  return idToken
}

export default GetIdToken
export { GetRefreshToken, GetMailAddressAndPassword }
