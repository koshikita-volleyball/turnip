import React from 'react'

import Layout from '../components/Layout'
import useSWR from 'swr'
import setting from '../setting'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ContactPage() {

  const conditions = [
    {
      type: "growth_rate",
      positive: true,
      threshold: 0.1,
    },
    {
      type: "cross_over",
      line1: 'close',
      line2: 'ma_25',
      from: '2023-01-01'
    }
  ]

  const { data }  = useSWR(`${setting.apiPath}/api/screener?codes=1,2,3&conditions=${encodeURI(JSON.stringify(conditions))}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  return (
    <Layout>
      <p>
        conditions: {JSON.stringify(conditions)}
      </p>
      <p>
        response: {JSON.stringify(data)}
      </p>
      <div id="Technical"></div>
    </Layout>
  )
}
