import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import setting from '../setting'
import useSWR from 'swr'
import ListedInfoStruct from '../interface/listed_info'
import { Alert, Spinner, Table } from 'react-bootstrap'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Company() {

  const [code, setCode] = useState<string>('')

  const { data, error }: {
    data: ListedInfoStruct[],
    error: any
  } = useSWR(
    `${setting.apiPath}/api/listed_info?code=${code}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

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
      {error ? (
          <Alert variant="danger">Failed to load...</Alert>
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
        ) : data.length === 0 ? (
          <Alert variant="warning">No data...</Alert>
        ) : (
          <div>
            <h2>Company Detail</h2>
            {
              (() => {
                const company = data[0]
                return <>
                  <Table className='mt-3'>
                    <tbody>
                      <tr>
                        <th>銘柄コード</th>
                        <td>{company.Code}</td>
                      </tr>
                      <tr>
                        <th>銘柄名</th>
                        <td>{company.CompanyName}</td>
                      </tr>
                      <tr>
                        <th>市場・商品区分</th>
                        <td>{company.MarketCodeName}</td>
                      </tr>
                      <tr>
                        <th>17業種区分</th>
                        <td>{company.Sector17CodeName}</td>
                      </tr>
                      <tr>
                        <th>33業種コード</th>
                        <td>{company.Sector33Code}</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              })()
            }
          </div>
        )
      }
      </div>
    </Layout>
  )
}
