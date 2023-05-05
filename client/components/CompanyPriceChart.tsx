import React from "react"
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2'
ChartJS.register(...registerables);
import PricesDailyQuotesStruct from "../interface/prices_daily_quotes"

export default function CompanyPriceChart(props: {prices: PricesDailyQuotesStruct[]}) {

  if (!props.prices) {
    return <></>
  }

  const labels = props.prices.map((item) => item.Date);
  const graphData = {
    labels: labels,
    datasets: [
      {
        label: "高値",
        data: props.prices.map((item) => item.High),
        borderColor: "red",
      },
      {
        label: "低値",
        data: props.prices.map((item) => item.Low),
        borderColor: "blue",
      },
      {
        label: "始値",
        data: props.prices.map((item) => item.Open),
        borderColor: "green",
      },
      {
        label: "終値",
        data: props.prices.map((item) => item.Close),
        borderColor: "orange",
      },
    ],
  };

  return (
    <>
      <Line
        height={100}
        width={300}
        data={graphData}
      />
    </>
  )
}
