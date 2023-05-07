import React, { useState } from 'react'
import Modal from 'react-modal'

import Layout from '../components/Layout'
import { ScreeningConditionStructs } from '../interface/screening_condition'
import ScreeningConditionModal from '../components/ScreeningConditionModal'
import { Button } from 'react-bootstrap'
import ScreeningConditionList from '../components/ScreeningConditionList'

Modal.setAppElement('#ScreeningModal')

export default function ContactPage() {
  const [conditions, setConditions] = useState<ScreeningConditionStructs[]>([])

  const [modalIsOpen, setIsOpen] = React.useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <Layout>
      <div id="ScreeningModal">
        <ScreeningConditionList conditions={conditions} setConditions={setConditions} />
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
      </div>
    </Layout>
  )
}
