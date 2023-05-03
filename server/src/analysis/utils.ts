import JQuantsClient from '../common/jquants_client';
import PricesDailyQuotesStruct from '../interface/prices_daily_quotes';

export const getBusinessDays = async () => {
  const code_toyota = '72030'
  const prices = await JQuantsClient<{daily_quotes: PricesDailyQuotesStruct[]}>("/v1/prices/daily_quotes", {code: code_toyota})

  console.log('<< toyota prices', prices)

  return prices

}
