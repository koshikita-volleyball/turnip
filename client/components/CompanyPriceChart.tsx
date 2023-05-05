import React from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'
ChartJS.register(...registerables)
import PricesDailyQuotesStruct from '../interface/prices_daily_quotes'

const dataset_setting = {
  borderWidth: 1,
  radius: 1,
}

export default function CompanyPriceChart(props: {
  prices: PricesDailyQuotesStruct[]
}) {
  if (!props.prices) {
    return <></>
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
      <Line height={100} width={300} data={graphData} />
    </>
  )
}
