import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useSWR from 'swr'
import setting from '../setting'
import { Alert, Button, Spinner, Table } from 'react-bootstrap'
import ListedInfoStruct from '../interface/listed_info'
import { useRouter } from 'next/router'
import Link from 'next/link'
import FilteringBlock from '../components/FilteringBlock'
import PaginationStruct from '../interface/pagination'

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
  const [firstLock, setFirstLock] = useState(false)
  const [page, setPage] = useState(1)
  const [useFiltering, setUseFiltering] = useState(true)
  const [company_name, setCompanyName] = useState('')
  const [market_code, setMarketCode] = useState<string>('')
  const [sector_17_code, setSector17Code] = useState<string>('')
  const [sector_33_code, setSector33Code] = useState<string>('')

  const router = useRouter()

  const {
    data: data,
    error,
  }: {
    data: {
      data: ListedInfoStruct[]
      pagination: PaginationStruct
    }
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
    setFirstLock(true)
  }, [
    router.query.company_name,
    router.query.market_codes,
    router.query.page,
    router.query.sector_17_codes,
    router.query.sector_33_codes,
  ])

  useEffect(() => {
    if (!firstLock) return
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
            <FilteringBlock
              useFiltering={useFiltering}
              setUseFiltering={setUseFiltering}
              company_name={company_name}
              setCompanyName={setCompanyName}
              market_code={market_code}
              setMarketCode={setMarketCode}
              sector_17_code={sector_17_code}
              setSector17Code={setSector17Code}
              sector_33_code={sector_33_code}
              setSector33Code={setSector33Code}
              afterChange={() => setPage(1)}
            />
            <hr />
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button
                variant="primary"
                onClick={() => setPage(page - 1)}
                disabled={data.pagination.hasPrev === false}
              >
                前へ
              </Button>
              <Alert variant="info" className="text-center mx-1 my-0 px-3 py-1">
                Page {page} / {data.pagination?.totalPages || 'xxx'}
              </Alert>
              <Button
                variant="primary"
                onClick={() => setPage(page + 1)}
                disabled={data.pagination.hasNext === false}
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
      </div>
    </Layout>
  )
}
