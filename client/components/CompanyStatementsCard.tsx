import React from 'react'
import { Alert, Table } from 'react-bootstrap'
import FinsStatementsStruct from '../interface/fins_statements'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/css'
import dayjs from '../src/dayjs'

export default function CompanyStatementsCard(props: {
  statements: FinsStatementsStruct[]
}) {
  if (!props.statements) {
    return <Alert variant="danger">財務情報の取得に失敗しました。</Alert>
  }

  return (
    <>
      <h2 className="mt-5">💰 財務情報</h2>
      <Splide
        options={{
          autoplay: false,
        }}
      >
        {props.statements
          .sort((a, b) => dayjs(b.DisclosedDate).diff(dayjs(a.DisclosedDate)))
          .map((statement, index) => {
            return (
              <SplideSlide key={index}>
                <Table className="m-5">
                  <tbody>
                    <tr>
                      <th>開示日</th>
                      <td>
                        {statement.DisclosedDate} ({statement.DisclosedTime})
                      </td>
                    </tr>
                    <tr>
                      <th>会計期間の種類</th>
                      <td>{statement.TypeOfCurrentPeriod}</td>
                    </tr>
                    <tr>
                      <th>会計期間</th>
                      <td>
                        {statement.CurrentPeriodStartDate} 〜{' '}
                        {statement.CurrentPeriodEndDate}
                      </td>
                    </tr>
                    <tr>
                      <th>事業年度</th>
                      <td>
                        {statement.CurrentFiscalYearStartDate} 〜{' '}
                        {statement.CurrentFiscalYearEndDate}
                      </td>
                    </tr>
                    <tr>
                      <th>売上高</th>
                      <td>{statement.NetSales}</td>
                    </tr>
                    <tr>
                      <th>営業利益</th>
                      <td>{statement.OperatingProfit}</td>
                    </tr>
                    <tr>
                      <th>経常利益</th>
                      <td>{statement.OrdinaryProfit}</td>
                    </tr>
                    <tr>
                      <th>当期純利益</th>
                      <td>{statement.Profit}</td>
                    </tr>
                    <tr>
                      <th>一株あたり当期純利益</th>
                      <td>{statement.EarningsPerShare}</td>
                    </tr>
                    <tr>
                      <th>潜在株式調整後一株あたり当期純利益</th>
                      <td>{statement.DilutedEarningsPerShare}</td>
                    </tr>
                    <tr>
                      <th>総資産</th>
                      <td>{statement.TotalAssets}</td>
                    </tr>
                    <tr>
                      <th>純資産</th>
                      <td>{statement.Equity}</td>
                    </tr>
                    <tr>
                      <th>自己資本比率</th>
                      <td>{statement.EquityToAssetRatio}</td>
                    </tr>
                    <tr>
                      <th>一株あたり純資産</th>
                      <td>{statement.BookValuePerShare}</td>
                    </tr>
                    <tr>
                      <th>営業CF</th>
                      <td>{statement.CashFlowsFromOperatingActivities}</td>
                    </tr>
                    <tr>
                      <th>投資CF</th>
                      <td>{statement.CashFlowsFromInvestingActivities}</td>
                    </tr>
                    <tr>
                      <th>財務CF</th>
                      <td>{statement.CashFlowsFromFinancingActivities}</td>
                    </tr>
                    <tr>
                      <th>配当性向</th>
                      <td>{statement.ResultPayoutRatioAnnual}</td>
                    </tr>
                  </tbody>
                </Table>
              </SplideSlide>
            )
          })}
      </Splide>
      <hr />
    </>
  )
}
