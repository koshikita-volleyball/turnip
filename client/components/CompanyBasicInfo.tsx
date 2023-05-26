import React from 'react'
import type ListedInfoStruct from '../interface/listed_info'
import { Alert, Table } from 'react-bootstrap'

const title = <h2 className="mt-5">🏠 基本情報</h2>

export default function CompanyBasicInfo (props: { info: ListedInfoStruct }): React.JSX.Element {
  if (props.info === null) {
    return (
      <>
        {title}
        <Alert variant="danger">基本情報の取得に失敗しました。</Alert>
      </>
    )
  }

  const company = props.info

  return (
    <>
      {title}
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
      <hr />
    </>
  )
}
