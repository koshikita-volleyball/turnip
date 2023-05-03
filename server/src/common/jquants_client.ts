import GetIdToken from "./get_id_token"
import { base_uri } from "./const"

async function JQuantsClient<T>(path: string): Promise<T> {
  const id_token = await GetIdToken();
  const response = await fetch(`${base_uri}${path}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${id_token}`,
    }
  })
  const json = (await response.json()) as T
  return json
}

export default JQuantsClient
