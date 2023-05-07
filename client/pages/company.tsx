import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import setting from '../setting'
import useSWR from 'swr'
import ListedInfoStruct from '../interface/listed_info'
import { Alert, Spinner } from 'react-bootstrap'
import CompanyPriceChart from '../components/CompanyPriceChart'
import PricesDailyQuotesStruct from '../interface/prices_daily_quotes'
import FinsStatementsStruct from '../interface/fins_statements'
import CompanyStatementsCard from '../components/CompanyStatementsCard'
import CompanyBasicInfo from '../components/CompanyBasicInfo'

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
  } = useSWR(`${setting.apiPath}/api/info?code=${code}`, fetcher)

  const {
    data: prices,
    error: prices_error,
  }: {
    data: PricesDailyQuotesStruct[]
    error: any
  } = useSWR(
    `${setting.apiPath}/api/prices-daily-quotes?code=${code}`,
    fetcher,
  )

  const {
    data: statements,
    error: statements_error,
  }: {
    data: FinsStatementsStruct[]
    error: any
  } = useSWR(`${setting.apiPath}/api/fins-statements?code=${code}`, fetcher)

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
        {/* 全てのブロックが表示されていなければローディングを表示する。 */}
        {!info && !prices && !statements && (
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
        )}
        <div>
          <h1>🌟 銘柄情報詳細</h1>
          {/* 銘柄基本情報 */}
          {info_error ? (
            <Alert variant="danger">Failed to load...</Alert>
          ) : info ? (
            <CompanyBasicInfo info={info} />
          ) : (
            <Alert variant="secondary" className="d-flex align-items-center">
              <Spinner animation="grow" variant="primary" className="me-3" />
              基本情報を取得中...
            </Alert>
          )
          }
          {/* 株価情報 */}
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
          {/* 財務情報 */}
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
      </div>
    </Layout>
  )
}
