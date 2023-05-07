import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useSWR from 'swr'
import setting from '../setting'
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap'
import ListedInfoStruct from '../interface/listed_info'
import { useRouter } from 'next/router'
import MarketInfo from '../data/MarketInfo'
import Sector17Info from '../data/Sector17Info'
import Sector33Info from '../data/Sector33Info'
import Link from 'next/link'

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : null))

const make_params = ({
  page,
  company_name,
  market_code,
  sector_17_code,
  sector_33_code,
}: {
  page: number
  company_name: string
  market_code: string
  sector_17_code: string
  sector_33_code: string
}) =>
  `?page=${page}` +
  `${company_name !== '' ? `&company_name=${company_name}` : ''}` +
  `${market_code !== '' ? `&market_codes=${market_code}` : ''}` +
  `${sector_17_code !== '' ? `&sector_17_codes=${sector_17_code}` : ''}` +
  `${sector_33_code !== '' ? `&sector_33_codes=${sector_33_code}` : ''}`

export default function AboutPage() {
  const [page, setPage] = useState(1)
  const [useCondition, setUseCondition] = useState(true)
  const [company_name, setCompanyName] = useState('')
  const [market_code, setMarketCode] = useState<string>('')
  const [sector_17_code, setSector17Code] = useState<string>('')
  const [sector_33_code, setSector33Code] = useState<string>('')

  const router = useRouter()

  const {
    data: data,
    error,
  }: {
    data: { data: ListedInfoStruct[] }
    error: any
  } = useSWR(
    `${setting.apiPath}/api/listed_info` +
      make_params({
        page,
        company_name,
        market_code,
        sector_17_code,
        sector_33_code,
      }),
    fetcher,
  )

  useSWR(
    `${setting.apiPath}/api/listed_info` +
      make_params({
        page: page + 1,
        company_name,
        market_code,
        sector_17_code,
        sector_33_code,
      }),
    fetcher,
  )

  useEffect(() => {
    const page = router.query.page
    if (page) setPage(parseInt(page as string))
    const company_name = router.query.company_name
    if (company_name) setCompanyName(company_name as string)
    const market_code = router.query.market_codes
    if (market_code) setMarketCode(market_code as string)
    const sector_17_code = router.query.sector_17_codes
    if (sector_17_code) setSector17Code(sector_17_code as string)
    const sector_33_code = router.query.sector_33_codes
    if (sector_33_code) setSector33Code(sector_33_code as string)
  }, [
    router.query.company_name,
    router.query.market_codes,
    router.query.page,
    router.query.sector_17_codes,
    router.query.sector_33_codes,
  ])

  useEffect(() => {
    const query = {}
    if (page !== 1) query['page'] = page
    if (company_name !== '') query['company_name'] = company_name
    if (market_code !== '') query['market_codes'] = market_code
    if (sector_17_code !== '') query['sector_17_codes'] = sector_17_code
    if (sector_33_code !== '') query['sector_33_codes'] = sector_33_code
    router.push({
      pathname: '/listed-info',
      query,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, company_name, market_code, sector_17_code, sector_33_code])

  return (
    <Layout>
      <div id="ListedInfo">
        {error ? (
          <Alert variant="danger">Failed to load</Alert>
        ) : !data ? (
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
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button
                variant="primary"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                前へ
              </Button>
              <Alert variant="info" className="text-center mx-1 my-0 px-3 py-1">
                Page {page}
              </Alert>
              <Button
                variant="primary"
                onClick={() => setPage(page + 1)}
                disabled={data.data.length === 0}
              >
                次へ
              </Button>
            </div>
            <Table className="table table-striped table-hover mt-3">
              <thead>
                <tr>
                  <th>銘柄コード</th>
                  <th>銘柄名</th>
                  <th>17業種</th>
                  <th>33業種</th>
                  <th>市場</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item) => (
                  <tr key={item.Code}>
                    <td>
                      <Link href={`/company?code=${item.Code}`}>
                        {item.Code}
                      </Link>
                    </td>
                    <td>{item.CompanyName}</td>
                    <td>{item.Sector17CodeName}</td>
                    <td>{item.Sector33CodeName}</td>
                    <td>{item.MarketCodeName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
        <div className="mt-3">
          {useCondition ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setUseCondition(false)
                setPage(1)
              }}
            >
              条件を指定しない
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setUseCondition(true)
                setPage(1)
              }}
            >
              条件を指定して検索
            </Button>
          )}
        </div>
        {useCondition && (
          <div className="mt-3 p-3 bg-light border">
            <Form>
              <Form.Group className="mt-3">
                <Form.Label>銘柄名</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="銘柄名"
                  value={company_name}
                  onChange={(e) => {
                    setCompanyName(e.target.value)
                    setPage(1)
                  }}
                />
              </Form.Group>
            </Form>
            <Form.Group className="mt-3">
              <Form.Label>市場</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => {
                  const value = e.target.value
                  setMarketCode(value)
                  setPage(1)
                }}
                value={market_code}
              >
                <option value="">指定しない</option>
                {MarketInfo.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>17業種</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => {
                  const value = e.target.value
                  setSector17Code(value)
                  setPage(1)
                }}
                value={sector_17_code}
              >
                <option value="">指定しない</option>
                {Sector17Info.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>33業種</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => {
                  const value = e.target.value
                  setSector33Code(value)
                  setPage(1)
                }}
                value={sector_33_code}
              >
                <option value="">指定しない</option>
                {Sector33Info.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
        )}
      </div>
    </Layout>
  )
}
