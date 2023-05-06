import { getBusinessDaysFromS3 } from '../model/jpx_business_day'

export const getBusinessDays = getBusinessDaysFromS3

export const isBusinessDay = async (date: string): Promise<boolean> => {
  const dates = await getBusinessDays()
  return dates.some(d => d === date)
}
