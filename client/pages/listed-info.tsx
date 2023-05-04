import React, { useState } from 'react'
import Layout from '../components/Layout'
import useSWR from 'swr'
import setting from '../setting'
import { Button, Table } from 'react-bootstrap'
import ListedInfoStruct from '../interface/listed_info'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function AboutPage() {
  const [page, setPage] = useState(1)

  const { data, error }: {
    data: ListedInfoStruct[],
    error: any,
  } = useSWR(`${setting.apiPath}/api/listed_info?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  return (
    <Layout>
      <div id="ListedInfo">
        {
          error ? <p>failed to load</p> :
          !data ? <p>loading...</p> :
          <>
            <div className='d-flex justify-content-between mt-3'>
              <Button variant="primary" onClick={() => setPage(page - 1)} disabled={page === 1}>前へ</Button>
              <Button variant="primary" onClick={() => setPage(page + 1)} disabled={data.length === 0}>次へ</Button>
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
        }
      </div>
    </Layout>
  )
}
