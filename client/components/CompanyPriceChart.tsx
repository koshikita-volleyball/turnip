import React from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'
import type PricesDailyQuotesStruct from '../interface/prices_daily_quotes'
import { Alert } from 'react-bootstrap'
ChartJS.register(...registerables)

const datasetSetting = {
  borderWidth: 1,
  radius: 1
}

const options = {
  maintainAspectRatio: false,
  responsive: true
}

const title = <h2 className="mt-5">💹 株価情報</h2>

export default function CompanyPriceChart (props: {
  prices: PricesDailyQuotesStruct[]
}): React.JSX.Element {
  if (props.prices === null) {
    return (
      <>
        {title}
        <Alert variant="danger">株価情報の取得に失敗しました。</Alert>
      </>
    )
  }

  if (props.prices.length === 0) {
    return (
      <>
        {title}
        <Alert variant="warning">株価情報がありません。</Alert>
      </>
    )
  }

  const labels = props.prices.map((item) => item.Date)
  const graphData = {
    labels,
    datasets: [
      {
        label: '高値',
        data: props.prices.map((item) => item.High),
        borderColor: 'red',
        ...datasetSetting
      },
      {
        label: '低値',
        data: props.prices.map((item) => item.Low),
        borderColor: 'blue',
        ...datasetSetting
      },
      {
        label: '始値',
        data: props.prices.map((item) => item.Open),
        borderColor: 'green',
        ...datasetSetting
      },
      {
        label: '終値',
        data: props.prices.map((item) => item.Close),
        borderColor: 'orange',
        ...datasetSetting
      }
    ]
  }

  return (
    <>
      {title}
      <Line
        data={graphData}
        options={options}
        style={{ width: '100%', minHeight: '300px', maxHeight: '350px' }}
      />
      <hr />
    </>
  )
}
