import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useSWR from 'swr'
import setting from '../setting'
import { Alert, Button, Spinner, Table } from 'react-bootstrap'
import type ListedInfoStruct from '../interface/listed_info'
import { useRouter } from 'next/router'
import Link from 'next/link'
import FilteringBlock from '../components/FilteringBlock'
import type PaginationStruct from '../interface/pagination'

const fetcher = async (url: string): Promise<any> =>
  await fetch(url).then(async (r) => (r.ok ? await r.json() : null))

const makeParams = ({
  page,
  companyName,
  marketCode,
  sector17Code,
  sector33Code
}: {
  page: number
  companyName: string
  marketCode: string
  sector17Code: string
  sector33Code: string
}): string =>
  `?page=${page}` +
  `${companyName !== '' ? `&company_name=${companyName}` : ''}` +
  `${marketCode !== '' ? `&market_codes=${marketCode}` : ''}` +
  `${sector17Code !== '' ? `&sector_17_codes=${sector17Code}` : ''}` +
  `${sector33Code !== '' ? `&sector_33_codes=${sector33Code}` : ''}`

export default function AboutPage (): React.JSX.Element {
  const [firstLock, setFirstLock] = useState(false)
  const [page, setPage] = useState(1)
  const [useFiltering, setUseFiltering] = useState(true)
  const [companyName, setCompanyName] = useState('')
  const [marketCode, setMarketCode] = useState<string>('')
  const [sector17Code, setSector17Code] = useState<string>('')
  const [sector33Code, setSector33Code] = useState<string>('')

  const router = useRouter()

  const {
    data,
    error
  }: {
    data: {
      data: ListedInfoStruct[]
      pagination: PaginationStruct
    }
    error: any
  } = useSWR(
    `${setting.apiPath}/api/listed_info` +
      makeParams({
        page,
        companyName,
        marketCode,
        sector17Code,
        sector33Code
      }),
    fetcher
  )

  useSWR(
    `${setting.apiPath}/api/listed_info` +
      makeParams({
        page: page + 1,
        companyName,
        marketCode,
        sector17Code,
        sector33Code
      }),
    fetcher
  )

  useEffect(() => {
    const _page = router.query.page
    const page = (typeof _page === 'string' ? _page : _page?.join('')) ?? null
    if (page !== null) setPage(parseInt(page))
    const companyName = router.query.company_name ?? null
    if (companyName !== null) setCompanyName(companyName as string)
    const marketCode = router.query.market_codes ?? null
    if (marketCode !== null) setMarketCode(marketCode as string)
    const sector17Code = router.query.sector_17_codes ?? null
    if (sector17Code !== null) setSector17Code(sector17Code as string)
    const sector33Code = router.query.sector_33_codes ?? null
    if (sector33Code !== null) setSector33Code(sector33Code as string)
    setFirstLock(true)
  }, [
    router.query.company_name,
    router.query.market_codes,
    router.query.page,
    router.query.sector_17_codes,
    router.query.sector_33_codes
  ])

  useEffect(() => {
    if (!firstLock) return
    router.replace(
      '/listed-info' +
        makeParams({
          page,
          companyName,
          marketCode,
          sector17Code,
          sector33Code
        })
    )
      .then(() => {})
      .catch(() => {})
  }, [page, companyName, marketCode, sector17Code, sector33Code])

  return (
    <Layout>
      <div id="ListedInfo">
        {error !== undefined
          ? (
          <Alert variant="danger">Failed to load...</Alert>
            )
          : data === undefined
            ? (
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
              )
            : (
          <>
            <FilteringBlock
              useFiltering={useFiltering}
              setUseFiltering={setUseFiltering}
              companyName={companyName}
              setCompanyName={setCompanyName}
              marketCode={marketCode}
              setMarketCode={setMarketCode}
              sector17Code={sector17Code}
              setSector17Code={setSector17Code}
              sector33Code={sector33Code}
              setSector33Code={setSector33Code}
              afterChange={() => { setPage(1) }}
            />
            <hr />
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button
                variant="primary"
                onClick={() => { setPage(page - 1) }}
                disabled={!data.pagination.hasPrev}
              >
                前へ
              </Button>
              <Alert variant="info" className="text-center mx-1 my-0 px-3 py-1">
                Page {page} / {data.pagination?.totalPages ?? 'xxx'}
              </Alert>
              <Button
                variant="primary"
                onClick={() => { setPage(page + 1) }}
                disabled={!data.pagination.hasNext}
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
