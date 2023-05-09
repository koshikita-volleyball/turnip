import React, { useState } from 'react'
import Modal from 'react-modal'

import Layout from '../components/Layout'
import { ScreeningRuleStructs } from '../interface/screening_rule'
import ScreeningRuleModal from '../components/ScreeningRuleModal'
import { Button } from 'react-bootstrap'
import ScreeningRuleList from '../components/ScreeningRuleList'

Modal.setAppElement('#Modal')

export default function ContactPage() {
  const [rules, setRules] = useState<ScreeningRuleStructs[]>([])

  const [modalIsOpen, setIsOpen] = React.useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <Layout>
      <div id="Screening">
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
      </div>
    </Layout>
  )
}
