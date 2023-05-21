import React, { useState } from 'react'
import Modal from 'react-modal'

import Layout from '../components/Layout'
import { type ScreeningRuleStructs } from '../interface/screening_rule'
import ScreeningRuleModal from '../components/ScreeningRuleModal'
import { Button } from 'react-bootstrap'
import ScreeningRuleList from '../components/ScreeningRuleList'
import FilteringBlock from '../components/FilteringBlock'
import setting from '../setting'

Modal.setAppElement('#Modal')

function makeUri (
  filtering: {
    companyName: string
    marketCode: string
    sector17Code: string
    sector33Code: string
  },
  rules: ScreeningRuleStructs[]
): string {
  const { companyName, marketCode, sector17Code, sector33Code } =
    filtering

  return (
    `${setting.apiPath}/api/screener` +
    '?' +
    `${companyName !== '' ? `&company_name=${companyName}` : ''}` +
    `${marketCode !== '' ? `&market_codes=${marketCode}` : ''}` +
    `${sector17Code !== '' ? `&sector_17_codes=${sector17Code}` : ''}` +
    `${sector33Code !== '' ? `&sector_33_codes=${sector33Code}` : ''}` +
    `${rules.length !== 0 ? `&rules=${encodeURI(JSON.stringify(rules))}` : ''}`
  )
}

export default function ContactPage (): React.JSX.Element {
  const [useFiltering, setUseFiltering] = useState(true)
  const [companyName, setCompanyName] = useState('')
  const [marketCode, setMarketCode] = useState<string>('')
  const [sector17Code, setSector17Code] = useState<string>('')
  const [sector33Code, setSector33Code] = useState<string>('')

  const [rules, setRules] = useState<ScreeningRuleStructs[]>([])

  const [modalIsOpen, setIsOpen] = React.useState(false)

  const openModal: () => void = () => { setIsOpen(true) }
  const closeModal: () => void = () => { setIsOpen(false) }

  const StartScreening = (): void => {
    const uri = makeUri(
      {
        companyName,
        marketCode,
        sector17Code,
        sector33Code
      },
      rules
    )
    console.log(uri)
  }

  return (
    <Layout>
      <div id="Screening">
        <FilteringBlock
          useFiltering={useFiltering}
          setUseFiltering={setUseFiltering}
          companyName={companyName}
          setCompanyName={setCompanyName}
          marketCode={marketCode}
          setMarketCode={setMarketCode}
          sector17Code={sector17Code}
          setSector17Code={setSector17Code}
          sector33Code={sector33Code}
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
