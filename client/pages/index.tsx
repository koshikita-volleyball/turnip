import React from 'react'
import Layout from '../components/Layout'
import setting from '../setting'

export default function Home() {
  return (
    <Layout>
      <div id="Index">
        <img id="Logo" src={`${setting.basePath}/logo.svg`} alt="Logo" />
      </div>
    </Layout>
  )
}
