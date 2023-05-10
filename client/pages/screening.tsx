import React, { useState } from 'react'
import Modal from 'react-modal'

import Layout from '../components/Layout'
import { ScreeningRuleStructs } from '../interface/screening_rule'
import ScreeningRuleModal from '../components/ScreeningRuleModal'
import { Button } from 'react-bootstrap'
import ScreeningRuleList from '../components/ScreeningRuleList'
import FilteringBlock from '../components/FilteringBlock'
import setting from '../setting'

Modal.setAppElement('#Modal')

function make_uri(
  filtering: {
    company_name: string
    market_code: string
    sector_17_code: string
    sector_33_code: string
  },
  rules: ScreeningRuleStructs[],
) {
  const { company_name, market_code, sector_17_code, sector_33_code } =
    filtering

  rules.forEach((rule) => {
    delete rule.collapsed
  })

  return (
    `${setting.apiPath}/api/screener` +
    `?` +
    `${company_name !== '' ? `&company_name=${company_name}` : ''}` +
    `${market_code !== '' ? `&market_codes=${market_code}` : ''}` +
    `${sector_17_code !== '' ? `&sector_17_codes=${sector_17_code}` : ''}` +
    `${sector_33_code !== '' ? `&sector_33_codes=${sector_33_code}` : ''}` +
    `${
      rules.length !== 0
        ? `&rules=${encodeURI(JSON.stringify(rules, null, 0))}`
        : ''
    }`
  )
}

export default function ContactPage() {
  const [useFiltering, setUseFiltering] = useState(true)
  const [company_name, setCompanyName] = useState('')
  const [market_code, setMarketCode] = useState<string>('')
  const [sector_17_code, setSector17Code] = useState<string>('')
  const [sector_33_code, setSector33Code] = useState<string>('')

  const [rules, setRules] = useState<ScreeningRuleStructs[]>([])

  const [modalIsOpen, setIsOpen] = React.useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const StartScreening = () => {
    const uri = make_uri(
      {
        company_name,
        market_code,
        sector_17_code,
        sector_33_code,
      },
      rules,
    )
    console.log(uri)
  }

  return (
    <Layout>
      <div id="Screening">
        <FilteringBlock
          useFiltering={useFiltering}
          setUseFiltering={setUseFiltering}
          company_name={company_name}
          setCompanyName={setCompanyName}
          market_code={market_code}
          setMarketCode={setMarketCode}
          sector_17_code={sector_17_code}
          setSector17Code={setSector17Code}
          sector_33_code={sector_33_code}
          setSector33Code={setSector33Code}
          afterChange={() => {}}
        />
        <ScreeningRuleList rules={rules} setRules={setRules} />
        <Button
          variant="info"
          className="d-block mx-auto mt-3"
          onClick={openModal}
        >
          スクリーニングルールを追加
        </Button>
        <ScreeningRuleModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          rules={rules}
          setRules={setRules}
        />
        <hr />
        <Button
          variant="primary"
          className="d-block mx-auto w-100 mt-3"
          onClick={StartScreening}
        >
          スクリーニングを実行
        </Button>
      </div>
    </Layout>
  )
}
