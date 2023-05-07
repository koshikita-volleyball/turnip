import React, { useState } from 'react'
import Modal from 'react-modal'

import Layout from '../components/Layout'
import { ScreeningConditionStructs } from '../interface/screening_condition'
import ScreeningConditionModal from '../components/ScreeningConditionModal'
import { Button } from 'react-bootstrap'

Modal.setAppElement('#ScreeningModal')

export default function ContactPage() {
  const [conditions, setConditions] = useState<ScreeningConditionStructs[]>([])

  const [modalIsOpen, setIsOpen] = React.useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <Layout>
      <div id="ScreeningModal">
        {conditions.map((condition, index) => {
          return <div key={index}>aaa</div>
        })}
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
