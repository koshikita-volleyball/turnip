import React from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'
ChartJS.register(...registerables)
import PricesDailyQuotesStruct from '../interface/prices_daily_quotes'
import { Alert } from 'react-bootstrap'

const dataset_setting = {
  borderWidth: 1,
  radius: 1,
}

export default function CompanyPriceChart(props: {
  prices: PricesDailyQuotesStruct[]
}) {
  if (!props.prices) {
    return <Alert variant="danger">Failed to load prices...</Alert>
  }

  const labels = props.prices.map((item) => item.Date)
  const graphData = {
    labels: labels,
    datasets: [
      {
        label: '高値',
        data: props.prices.map((item) => item.High),
        borderColor: 'red',
        ...dataset_setting,
      },
      {
        label: '低値',
        data: props.prices.map((item) => item.Low),
        borderColor: 'blue',
        ...dataset_setting,
      },
      {
        label: '始値',
        data: props.prices.map((item) => item.Open),
        borderColor: 'green',
        ...dataset_setting,
      },
      {
        label: '終値',
        data: props.prices.map((item) => item.Close),
        borderColor: 'orange',
        ...dataset_setting,
      },
    ],
  }

  return (
    <>
      <h2 className='mt-5'>💹 株価情報</h2>
      <Line height={100} width={300} data={graphData} />
      <hr />
    </>
  )
}
