import React, { useState } from 'react'
import Layout from '../components/Layout'
import useSWR from 'swr'
import setting from '../setting'
import { Alert, Button, Spinner, Table } from 'react-bootstrap'
import ListedInfoStruct from '../interface/listed_info'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function AboutPage() {
  const [page, setPage] = useState(1)

  const {
    data,
    error,
  }: {
    data: ListedInfoStruct[]
    error: any
  } = useSWR(`${setting.apiPath}/api/listed_info?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  useSWR(`${setting.apiPath}/api/listed_info?page=${page + 1}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

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
          </>
        )}
      </div>
    </Layout>
  )
}
