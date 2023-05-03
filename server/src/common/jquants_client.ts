import GetIdToken from "./get_id_token"
import { base_uri } from "./const"

async function JQuantsClient<T>(path: string, params: {[key: string]: string} | null = null): Promise<T> {
  const id_token = await GetIdToken();
  const query_string = params
    ? '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join("&")
    : ''
  const response = await fetch(`${base_uri}${path}${query_string}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${id_token}`,
    }
  })
  const json = (await response.json()) as T
  return json
}

export default JQuantsClient
