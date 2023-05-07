import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import setting from '../setting'
import useSWR from 'swr'
import ListedInfoStruct from '../interface/listed_info'
import { Alert, Spinner, Table } from 'react-bootstrap'
import CompanyPriceChart from '../components/CompanyPriceChart'
import PricesDailyQuotesStruct from '../interface/prices_daily_quotes'
import FinsStatementsStruct from '../interface/fins_statements'
import CompanyStatementsCard from '../components/CompanyStatementsCard'

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (r.ok) {
      return r.json()
    } else {
      throw null
    }
  })

export default function Company() {
  const [code, setCode] = useState<string>('')

  const {
    data: info,
    error: info_error,
  }: {
    data: ListedInfoStruct
    error: any
  } = useSWR(`${setting.apiPath}/api/info?code=${code}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const {
    data: prices,
    error: prices_error,
  }: {
    data: PricesDailyQuotesStruct[]
    error: any
  } = useSWR(
    `${setting.apiPath}/api/prices-daily-quotes?code=${code}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  )

  const {
    data: statements,
    error: statements_error,
  }: {
    data: FinsStatementsStruct[]
    error: any
  } = useSWR(`${setting.apiPath}/api/fins-statements?code=${code}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    if (code) {
      setCode(code)
    }
  }, [])

  return (
    <Layout>
      <div id="Company">
        {info_error ? (
          <Alert variant="danger">Failed to load...</Alert>
        ) : !info ? (
          <div className="mt-3 d-flex justify-content-between">
            <Spinner animation="grow" variant="primary" />
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="success" />
            <Spinner animation="grow" variant="danger" />
            <Spinner animation="grow" variant="warning" />
            <Spinner animation="grow" variant="info" />
            <Spinner animation="grow" variant="light" />
            <Spinner animation="grow" variant="dark" />
          </div>
        ) : !info ? (
          <Alert variant="warning">No data...</Alert>
        ) : (
          <div>
            <h2>Company Detail</h2>
            {(() => {
              const company = info
              return (
                <>
                  <Table className="mt-3">
                    <tbody>
                      <tr>
                        <th>銘柄コード</th>
                        <td>{company?.Code}</td>
                      </tr>
                      <tr>
                        <th>銘柄名</th>
                        <td>{company?.CompanyName}</td>
                      </tr>
                      <tr>
                        <th>市場・商品区分</th>
                        <td>{company?.MarketCodeName}</td>
                      </tr>
                      <tr>
                        <th>17業種区分</th>
                        <td>{company?.Sector17CodeName}</td>
                      </tr>
                      <tr>
                        <th>33業種区分</th>
                        <td>{company?.Sector33CodeName}</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              )
            })()}
            {prices_error ? (
              <Alert variant="danger">Failed to load...</Alert>
            ) : prices ? (
              <CompanyPriceChart prices={prices} />
            ) : (
              <Alert variant="secondary" className="d-flex align-items-center">
                <Spinner animation="grow" variant="primary" className="me-3" />
                株価データを取得中...
              </Alert>
            )}
            {statements_error ? (
              <Alert variant="danger">Failed to load...</Alert>
            ) : statements ? (
              <CompanyStatementsCard statements={statements} />
            ) : (
              <Alert variant="secondary" className="d-flex align-items-center">
                <Spinner animation="grow" variant="primary" className="me-3" />
                財務データを取得中...
              </Alert>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
