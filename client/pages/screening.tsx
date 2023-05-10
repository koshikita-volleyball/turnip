import React, { useState } from 'react'
import Modal from 'react-modal'

import Layout from '../components/Layout'
import { ScreeningConditionStructs } from '../interface/screening_condition'
import ScreeningConditionModal from '../components/ScreeningConditionModal'
import { Button } from 'react-bootstrap'
import ScreeningConditionList from '../components/ScreeningConditionList'
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
  conditions: ScreeningConditionStructs[],
) {
  const { company_name, market_code, sector_17_code, sector_33_code } =
    filtering

  conditions.forEach((condition) => {
    delete condition.collapsed
  })

  return (
    `${setting.apiPath}/api/screener` +
    `?` +
    `${company_name !== '' ? `&company_name=${company_name}` : ''}` +
    `${market_code !== '' ? `&market_codes=${market_code}` : ''}` +
    `${sector_17_code !== '' ? `&sector_17_codes=${sector_17_code}` : ''}` +
    `${sector_33_code !== '' ? `&sector_33_codes=${sector_33_code}` : ''}` +
    `${
      conditions.length !== 0
        ? `&conditions=${encodeURI(JSON.stringify(conditions, null, 0))}`
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

  const [conditions, setConditions] = useState<ScreeningConditionStructs[]>([])

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
      conditions,
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
        <ScreeningConditionList
          conditions={conditions}
          setConditions={setConditions}
        />
        <Button
          variant="info"
          className="d-block mx-auto mt-3"
          onClick={openModal}
        >
          スクリーニングルールを追加
        </Button>
        <ScreeningConditionModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          conditions={conditions}
          setConditions={setConditions}
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
