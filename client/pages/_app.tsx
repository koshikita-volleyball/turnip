import React from 'react'
import { AppProps } from 'next/app'
import { useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import '../styles/styles.scss'
import '../styles/common.scss'
import '../styles/menu.scss'

import '../styles/index.scss'

import Head from 'next/head'

import setting from '../setting'
import { DataContext } from '../src/DataContext'
import SharedData from '../src/SharedData'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [sharedData, setSharedData] = useState<SharedData>({
    username: '',
    email: 'osawa-koki@example.com',
  })

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{setting.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="icon"
          type="image/png"
          href={`${setting.basePath}/favicon.ico`}
        />
      </Head>
      <DataContext.Provider value={{ sharedData, setSharedData }}>
        <Component {...pageProps} />
      </DataContext.Provider>
    </>
  )
}
