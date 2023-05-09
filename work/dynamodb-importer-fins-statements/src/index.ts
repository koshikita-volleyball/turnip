import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

type ListedInfoStruct = {
  Date: Date
  Code: string
  CompanyName: string
  CompanyNameEnglish: string
  Sector17Code: string
  Sector17CodeName: string
  Sector33Code: string
  Sector33CodeName: string
  ScaleCategory: string
  MarketCode: string
  MarketCodeName: string
}
type FinsStatementsStruct = {
  DisclosedDate: string
  DisclosedTime: string
  LocalCode: string
  DisclosureNumber: string
  TypeOfDocument: string
  TypeOfCurrentPeriod: string
  CurrentPeriodStartDate: string
  CurrentPeriodEndDate: string
  CurrentFiscalYearStartDate: string
  CurrentFiscalYearEndDate: string
  NextFiscalYearStartDate: string
  NextFiscalYearEndDate: string
  NetSales: string
  OperatingProfit: string
  OrdinaryProfit: string
  Profit: string
  EarningsPerShare: string
  DilutedEarningsPerShare: string
  TotalAssets: string
  Equity: string
  EquityToAssetRatio: string
  BookValuePerShare: string
  CashFlowsFromOperatingActivities: string
  CashFlowsFromInvestingActivities: string
  CashFlowsFromFinancingActivities: string
  CashAndEquivalents: string
  ResultDividendPerShare1stQuarter: string
  ResultDividendPerShare2ndQuarter: string
  ResultDividendPerShare3rdQuarter: string
  ResultDividendPerShareFiscalYearEnd: string
  ResultDividendPerShareAnnual: string
  'DistributionsPerUnit(REIT)': string
  ResultTotalDividendPaidAnnual: string
  ResultPayoutRatioAnnual: string
  ForecastDividendPerShare1stQuarter: string
  ForecastDividendPerShare2ndQuarter: string
  ForecastDividendPerShare3rdQuarter: string
  ForecastDividendPerShareFiscalYearEnd: string
  ForecastDividendPerShareAnnual: string
  'ForecastDistributionsPerUnit(REIT)': string
  ForecastTotalDividendPaidAnnual: string
  ForecastPayoutRatioAnnual: string
  NextYearForecastDividendPerShare1stQuarter: string
  NextYearForecastDividendPerShare2ndQuarter: string
  NextYearForecastDividendPerShare3rdQuarter: string
  NextYearForecastDividendPerShareFiscalYearEnd: string
  NextYearForecastDividendPerShareAnnual: string
  'NextYearForecastDistributionsPerUnit(REIT)': string
  NextYearForecastPayoutRatioAnnual: string
  ForecastNetSales2ndQuarter: string
  ForecastOperatingProfit2ndQuarter: string
  ForecastOrdinaryProfit2ndQuarter: string
  ForecastProfit2ndQuarter: string
  ForecastEarningsPerShare2ndQuarter: string
  NextYearForecastNetSales2ndQuarter: string
  NextYearForecastOperatingProfit2ndQuarter: string
  NextYearForecastOrdinaryProfit2ndQuarter: string
  NextYearForecastProfit2ndQuarter: string
  NextYearForecastEarningsPerShare2ndQuarter: string
  ForecastNetSales: string
  ForecastOperatingProfit: string
  ForecastOrdinaryProfit: string
  ForecastProfit: string
  ForecastEarningsPerShare: string
  NextYearForecastNetSales: string
  NextYearForecastOperatingProfit: string
  NextYearForecastOrdinaryProfit: string
  NextYearForecastProfit: string
  NextYearForecastEarningsPerShare: string
  MaterialChangesInSubsidiaries: string
  ChangesBasedOnRevisionsOfAccountingStandard: string
  ChangesOtherThanOnesBasedOnRevisionsOfAccountingStandard: string
  ChangesInAccountingEstimates: string
  RetrospectiveRestatement: string
  NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock: string
  NumberOfTreasuryStockAtTheEndOfFiscalYear: string
  AverageNumberOfShares: string
  NonConsolidatedNetSales: string
  NonConsolidatedOperatingProfit: string
  NonConsolidatedOrdinaryProfit: string
  NonConsolidatedProfit: string
  NonConsolidatedEarningsPerShare: string
  NonConsolidatedTotalAssets: string
  NonConsolidatedEquity: string
  NonConsolidatedEquityToAssetRatio: string
  NonConsolidatedBookValuePerShare: string
  ForecastNonConsolidatedNetSales2ndQuarter: string
  ForecastNonConsolidatedOperatingProfit2ndQuarter: string
  ForecastNonConsolidatedOrdinaryProfit2ndQuarter: string
  ForecastNonConsolidatedProfit2ndQuarter: string
  ForecastNonConsolidatedEarningsPerShare2ndQuarter: string
  NextYearForecastNonConsolidatedNetSales2ndQuarter: string
  NextYearForecastNonConsolidatedOperatingProfit2ndQuarter: string
  NextYearForecastNonConsolidatedOrdinaryProfit2ndQuarter: string
  NextYearForecastNonConsolidatedProfit2ndQuarter: string
  NextYearForecastNonConsolidatedEarningsPerShare2ndQuarter: string
  ForecastNonConsolidatedNetSales: string
  ForecastNonConsolidatedOperatingProfit: string
  ForecastNonConsolidatedOrdinaryProfit: string
  ForecastNonConsolidatedProfit: string
  ForecastNonConsolidatedEarningsPerShare: string
  NextYearForecastNonConsolidatedNetSales: string
  NextYearForecastNonConsolidatedOperatingProfit: string
  NextYearForecastNonConsolidatedOrdinaryProfit: string
  NextYearForecastNonConsolidatedProfit: string
  NextYearForecastNonConsolidatedEarningsPerShare: string
}

const JQUANTS_API_TOKEN = process.env.JQUANTS_API_TOKEN || ''

if (JQUANTS_API_TOKEN === '')
  throw new Error('JQUANTS_API_TOKEN is not defined.')

// 銘柄コード一覧を取得
await fetch('http://example.com')
const { info: stocks }: { info: ListedInfoStruct[] } = await (
  await fetch('https://api.jquants.com/v1/listed/info', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JQUANTS_API_TOKEN}`,
    },
  })
).json()

let n = 0

const file_name = `statements.csv`
const headers = [
  'DisclosedDate',
  'DisclosedTime',
  'LocalCode',
  'DisclosureNumber',
  'TypeOfDocument',
  'TypeOfCurrentPeriod',
  'CurrentPeriodStartDate',
  'CurrentPeriodEndDate',
  'CurrentFiscalYearStartDate',
  'CurrentFiscalYearEndDate',
  'NextFiscalYearStartDate',
  'NextFiscalYearEndDate',
  'NetSales',
  'OperatingProfit',
  'OrdinaryProfit',
  'Profit',
  'EarningsPerShare',
  'DilutedEarningsPerShare',
  'TotalAssets',
  'Equity',
  'EquityToAssetRatio',
  'BookValuePerShare',
  'CashFlowsFromOperatingActivities',
  'CashFlowsFromInvestingActivities',
  'CashFlowsFromFinancingActivities',
  'CashAndEquivalents',
  'ResultDividendPerShare1stQuarter',
  'ResultDividendPerShare2ndQuarter',
  'ResultDividendPerShare3rdQuarter',
  'ResultDividendPerShareFiscalYearEnd',
  'ResultDividendPerShareAnnual',
  'DistributionsPerUnit(REIT)',
  'ResultTotalDividendPaidAnnual',
  'ResultPayoutRatioAnnual',
  'ForecastDividendPerShare1stQuarter',
  'ForecastDividendPerShare2ndQuarter',
  'ForecastDividendPerShare3rdQuarter',
  'ForecastDividendPerShareFiscalYearEnd',
  'ForecastDividendPerShareAnnual',
  'ForecastDistributionsPerUnit(REIT)',
  'ForecastTotalDividendPaidAnnual',
  'ForecastPayoutRatioAnnual',
  'NextYearForecastDividendPerShare1stQuarter',
  'NextYearForecastDividendPerShare2ndQuarter',
  'NextYearForecastDividendPerShare3rdQuarter',
  'NextYearForecastDividendPerShareFiscalYearEnd',
  'NextYearForecastDividendPerShareAnnual',
  'NextYearForecastDistributionsPerUnit(REIT)',
  'NextYearForecastPayoutRatioAnnual',
  'ForecastNetSales2ndQuarter',
  'ForecastOperatingProfit2ndQuarter',
  'ForecastOrdinaryProfit2ndQuarter',
  'ForecastProfit2ndQuarter',
  'ForecastEarningsPerShare2ndQuarter',
  'NextYearForecastNetSales2ndQuarter',
  'NextYearForecastOperatingProfit2ndQuarter',
  'NextYearForecastOrdinaryProfit2ndQuarter',
  'NextYearForecastProfit2ndQuarter',
  'NextYearForecastEarningsPerShare2ndQuarter',
  'ForecastNetSales',
  'ForecastOperatingProfit',
  'ForecastOrdinaryProfit',
  'ForecastProfit',
  'ForecastEarningsPerShare',
  'NextYearForecastNetSales',
  'NextYearForecastOperatingProfit',
  'NextYearForecastOrdinaryProfit',
  'NextYearForecastProfit',
  'NextYearForecastEarningsPerShare',
  'MaterialChangesInSubsidiaries',
  'ChangesBasedOnRevisionsOfAccountingStandard',
  'ChangesOtherThanOnesBasedOnRevisionsOfAccountingStandard',
  'ChangesInAccountingEstimates',
  'RetrospectiveRestatement',
  'NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock',
  'NumberOfTreasuryStockAtTheEndOfFiscalYear',
  'AverageNumberOfShares',
  'NonConsolidatedNetSales',
  'NonConsolidatedOperatingProfit',
  'NonConsolidatedOrdinaryProfit',
  'NonConsolidatedProfit',
  'NonConsolidatedEarningsPerShare',
  'NonConsolidatedTotalAssets',
  'NonConsolidatedEquity',
  'NonConsolidatedEquityToAssetRatio',
  'NonConsolidatedBookValuePerShare',
  'ForecastNonConsolidatedNetSales2ndQuarter',
  'ForecastNonConsolidatedOperatingProfit2ndQuarter',
  'ForecastNonConsolidatedOrdinaryProfit2ndQuarter',
  'ForecastNonConsolidatedProfit2ndQuarter',
  'ForecastNonConsolidatedEarningsPerShare2ndQuarter',
  'NextYearForecastNonConsolidatedNetSales2ndQuarter',
  'NextYearForecastNonConsolidatedOperatingProfit2ndQuarter',
  'NextYearForecastNonConsolidatedOrdinaryProfit2ndQuarter',
  'NextYearForecastNonConsolidatedProfit2ndQuarter',
  'NextYearForecastNonConsolidatedEarningsPerShare2ndQuarter',
  'ForecastNonConsolidatedNetSales',
  'ForecastNonConsolidatedOperatingProfit',
  'ForecastNonConsolidatedOrdinaryProfit',
  'ForecastNonConsolidatedProfit',
  'ForecastNonConsolidatedEarningsPerShare',
  'NextYearForecastNonConsolidatedNetSales',
  'NextYearForecastNonConsolidatedOperatingProfit',
  'NextYearForecastNonConsolidatedOrdinaryProfit',
  'NextYearForecastNonConsolidatedProfit',
  'NextYearForecastNonConsolidatedEarningsPerShare',
]
const csv_header = headers.join(',')
fs.writeFile(file_name, `${csv_header}\n`, (err) => {
  if (err) console.error(err)
})

const sorted_stocks = stocks.sort((a, b) => {
  if (a.Code < b.Code) return -1
  if (a.Code > b.Code) return 1
  return 0
})

for (const stock of sorted_stocks) {
  n++
  console.log(
    `★★★ [${n}/${stocks.length}] ${stock.Code} - ${stock.CompanyName}`,
  )

  // 銘柄コードを指定して株価を取得
  const { statements: statements }: { statements: FinsStatementsStruct[] } =
    await (
      await fetch(
        `https://api.jquants.com/v1/fins/statements?code=${stock.Code}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${JQUANTS_API_TOKEN}`,
          },
        },
      )
    ).json()
  const csv_data = []
  for (const statement of statements) {
    csv_data.push(
      [
        statement.DisclosedDate,
        statement.DisclosedTime,
        statement.LocalCode,
        statement.DisclosureNumber,
        statement.TypeOfDocument,
        statement.TypeOfCurrentPeriod,
        statement.CurrentPeriodStartDate,
        statement.CurrentPeriodEndDate,
        statement.CurrentFiscalYearStartDate,
        statement.CurrentFiscalYearEndDate,
        statement.NextFiscalYearStartDate,
        statement.NextFiscalYearEndDate,
        statement.NetSales,
        statement.OperatingProfit,
        statement.OrdinaryProfit,
        statement.Profit,
        statement.EarningsPerShare,
        statement.DilutedEarningsPerShare,
        statement.TotalAssets,
        statement.Equity,
        statement.EquityToAssetRatio,
        statement.BookValuePerShare,
        statement.CashFlowsFromOperatingActivities,
        statement.CashFlowsFromInvestingActivities,
        statement.CashFlowsFromFinancingActivities,
        statement.CashAndEquivalents,
        statement.ResultDividendPerShare1stQuarter,
        statement.ResultDividendPerShare2ndQuarter,
        statement.ResultDividendPerShare3rdQuarter,
        statement.ResultDividendPerShareFiscalYearEnd,
        statement.ResultDividendPerShareAnnual,
        statement['DistributionsPerUnit(REIT)'],
        statement.ResultTotalDividendPaidAnnual,
        statement.ResultPayoutRatioAnnual,
        statement.ForecastDividendPerShare1stQuarter,
        statement.ForecastDividendPerShare2ndQuarter,
        statement.ForecastDividendPerShare3rdQuarter,
        statement.ForecastDividendPerShareFiscalYearEnd,
        statement.ForecastDividendPerShareAnnual,
        statement['ForecastDistributionsPerUnit(REIT)'],
        statement.ForecastTotalDividendPaidAnnual,
        statement.ForecastPayoutRatioAnnual,
        statement.NextYearForecastDividendPerShare1stQuarter,
        statement.NextYearForecastDividendPerShare2ndQuarter,
        statement.NextYearForecastDividendPerShare3rdQuarter,
        statement.NextYearForecastDividendPerShareFiscalYearEnd,
        statement.NextYearForecastDividendPerShareAnnual,
        statement['NextYearForecastDistributionsPerUnit(REIT)'],
        statement.NextYearForecastPayoutRatioAnnual,
        statement.ForecastNetSales2ndQuarter,
        statement.ForecastOperatingProfit2ndQuarter,
        statement.ForecastOrdinaryProfit2ndQuarter,
        statement.ForecastProfit2ndQuarter,
        statement.ForecastEarningsPerShare2ndQuarter,
        statement.NextYearForecastNetSales2ndQuarter,
        statement.NextYearForecastOperatingProfit2ndQuarter,
        statement.NextYearForecastOrdinaryProfit2ndQuarter,
        statement.NextYearForecastProfit2ndQuarter,
        statement.NextYearForecastEarningsPerShare2ndQuarter,
        statement.ForecastNetSales,
        statement.ForecastOperatingProfit,
        statement.ForecastOrdinaryProfit,
        statement.ForecastProfit,
        statement.ForecastEarningsPerShare,
        statement.NextYearForecastNetSales,
        statement.NextYearForecastOperatingProfit,
        statement.NextYearForecastOrdinaryProfit,
        statement.NextYearForecastProfit,
        statement.NextYearForecastEarningsPerShare,
        statement.MaterialChangesInSubsidiaries,
        statement.ChangesBasedOnRevisionsOfAccountingStandard,
        statement.ChangesOtherThanOnesBasedOnRevisionsOfAccountingStandard,
        statement.ChangesInAccountingEstimates,
        statement.RetrospectiveRestatement,
        statement.NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock,
        statement.NumberOfTreasuryStockAtTheEndOfFiscalYear,
        statement.AverageNumberOfShares,
        statement.NonConsolidatedNetSales,
        statement.NonConsolidatedOperatingProfit,
        statement.NonConsolidatedOrdinaryProfit,
        statement.NonConsolidatedProfit,
        statement.NonConsolidatedEarningsPerShare,
        statement.NonConsolidatedTotalAssets,
        statement.NonConsolidatedEquity,
        statement.NonConsolidatedEquityToAssetRatio,
        statement.NonConsolidatedBookValuePerShare,
        statement.ForecastNonConsolidatedNetSales2ndQuarter,
        statement.ForecastNonConsolidatedOperatingProfit2ndQuarter,
        statement.ForecastNonConsolidatedOrdinaryProfit2ndQuarter,
        statement.ForecastNonConsolidatedProfit2ndQuarter,
        statement.ForecastNonConsolidatedEarningsPerShare2ndQuarter,
        statement.NextYearForecastNonConsolidatedNetSales2ndQuarter,
        statement.NextYearForecastNonConsolidatedOperatingProfit2ndQuarter,
        statement.NextYearForecastNonConsolidatedOrdinaryProfit2ndQuarter,
        statement.NextYearForecastNonConsolidatedProfit2ndQuarter,
        statement.NextYearForecastNonConsolidatedEarningsPerShare2ndQuarter,
        statement.ForecastNonConsolidatedNetSales,
        statement.ForecastNonConsolidatedOperatingProfit,
        statement.ForecastNonConsolidatedOrdinaryProfit,
        statement.ForecastNonConsolidatedProfit,
        statement.ForecastNonConsolidatedEarningsPerShare,
        statement.NextYearForecastNonConsolidatedNetSales,
        statement.NextYearForecastNonConsolidatedOperatingProfit,
        statement.NextYearForecastNonConsolidatedOrdinaryProfit,
        statement.NextYearForecastNonConsolidatedProfit,
        statement.NextYearForecastNonConsolidatedEarningsPerShare,
      ].join(','),
    )
  }
  fs.appendFile(file_name, `${csv_data.join('\n')}\n`, (err) => {
    if (err) console.error(err)
  })
}
