import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useSWR from 'swr'
import setting from '../setting'
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap'
import ListedInfoStruct from '../interface/listed_info'

import MarketInfo from '../data/MarketInfo'
import Sector17Info from '../data/Sector17Info'
import Sector33Info from '../data/Sector33Info'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AboutPage() {
  const [page, setPage] = useState(1)
  const [useCondition, setUseCondition] = useState(true)
  const [company_name, setCompanyName] = useState('')
  const [market_code, setMarketCode] = useState<string>('')
  const [sector_17_code, setSector17Code] = useState<string>('')

  const {
    data,
    error,
  }: {
    data: ListedInfoStruct[]
    error: any
    mutate: any
  } = useSWR(
    `${setting.apiPath}/api/listed_info`
    + `?page=${page}`
    + `${useCondition === false ? '' : company_name !== '' ? `&company_name=${company_name}` : ''}`
    + `${useCondition === false ? '' : market_code !== '' ? `&market_code=${market_code}` : ''}`
    + `${useCondition === false ? '' : sector_17_code !== '' ? `&sector_17_code=${sector_17_code}` : ''}`
  , fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  useSWR(
    `${setting.apiPath}/api/listed_info`
    + `?page=${page + 1}`
    + `${useCondition === false ? '' : company_name !== '' ? `&company_name=${company_name}` : ''}`
    + `${useCondition === false ? '' : market_code !== '' ? `&market_code=${market_code}` : ''}`
    + `${useCondition === false ? '' : sector_17_code !== '' ? `&sector_17_code=${sector_17_code}` : ''}`
  , fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  useEffect(() => {
    const url = new URL(window.location.href)
    const page = url.searchParams.get('page')
    if (page) setPage(parseInt(page))
    const company_name = url.searchParams.get('company_name')
    if (company_name) setCompanyName(company_name)
    const market_code = url.searchParams.get('market_code')
    if (market_code) setMarketCode(market_code)
    const sector_17_code = url.searchParams.get('sector_17_code')
    if (sector_17_code) setSector17Code(sector_17_code)
  }, [])

  useEffect(() => {
    window.history.pushState(null, '',
      `${window.location.pathname}`
      + `?page=${page === 0 ? 1 : page}`
      + `${useCondition === false ? '' : company_name !== '' ? `&company_name=${company_name}` : ''}`
      + `${useCondition === false ? '' : market_code !== '' ? `&market_code=${market_code}` : ''}`
      + `${useCondition === false ? '' : sector_17_code !== '' ? `&sector_17_code=${sector_17_code}` : ''}`
    )
  }, [company_name, market_code, page, sector_17_code, useCondition])

  return (
    <Layout>
      <div id="ListedInfo">
        {error ? (
          <p>failed to load</p>
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
                disabled={data.length === 0}
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
                {data.map((item) => (
                  <tr key={item.Code}>
                    <td>{item.Code}</td>
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
        <div className='mt-3'>
        {
          useCondition
          ? <Button variant="secondary" size='sm' onClick={() => {
            setUseCondition(false)
            setPage(1)
          }}>条件を指定しない</Button>
          : <Button variant="secondary" size='sm' onClick={() => {
            setUseCondition(true)
            setPage(1)
          }}>条件を指定して検索</Button>
        }
        </div>
        {
          useCondition && <div className='mt-3 p-3 bg-light border'>
            <Form>
              <Form.Group className='mt-3'>
                <Form.Label>銘柄名</Form.Label>
                <Form.Control type="text" placeholder="銘柄名" value={company_name} onChange={(e) => {
                  setCompanyName(e.target.value)
                  setPage(1)
                }} />
              </Form.Group>
            </Form>
            <Form.Group className='mt-3'>
              <Form.Label>市場</Form.Label>
              <Form.Control as="select" onChange={(e) => {
                const value = e.target.value
                setMarketCode(value)
                setPage(1)
              }} value={market_code}>
                <option value=''>指定しない</option>
                {
                  MarketInfo.map((item) => (
                    <option key={item.code} value={item.code}>{item.name}</option>
                  ))
                }
              </Form.Control>
            </Form.Group>
            <Form.Group className='mt-3'>
              <Form.Label>17業種</Form.Label>
              <Form.Control as="select" onChange={(e) => {
                const value = e.target.value
                setSector17Code(value)
                setPage(1)
              }} value={sector_17_code}>
                <option value=''>指定しない</option>
                {
                  Sector17Info.map((item) => (
                    <option key={item.code} value={item.code}>{item.name}</option>
                  ))
                }
              </Form.Control>
            </Form.Group>
          </div>
        }
      </div>
    </Layout>
  )
}
