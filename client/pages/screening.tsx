import React, { useState } from 'react'
import Modal from 'react-modal'

import Layout from '../components/Layout'
import { ScreeningRuleStructs } from '../interface/screening_rule'
import ScreeningRuleModal from '../components/ScreeningRuleModal'
import { Button } from 'react-bootstrap'
import ScreeningRuleList from '../components/ScreeningRuleList'
import FilteringBlock from '../components/FilteringBlock'

Modal.setAppElement('#Modal')

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
        >
          スクリーニングを実行
        </Button>
      </div>
    </Layout>
  )
}
