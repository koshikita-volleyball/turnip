import { CrossOverIndicator } from '../interface/jquants/indicator'
import { Stock } from '../interface/turnip/stock'

const crossOver = async (stock: Stock, params: CrossOverIndicator): Promise<boolean> => {
  return new Promise<boolean>(() => true)
}

export default crossOver
