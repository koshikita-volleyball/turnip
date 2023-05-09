import React, { Dispatch, SetStateAction, useState } from 'react'
import Modal from 'react-modal'
import {
  MovingAverageType,
  OHLC,
  ScreeningRuleCrossOverStruct,
  ScreeningRuleGrowthRateStruct,
  ScreeningRuleStructs,
} from '../interface/screening_rule'
import { Alert, Button, Form } from 'react-bootstrap'
import dayjs from 'dayjs'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '1000px',
    maxWidth: '100%',
    height: '800px',
    maxHeight: '100%',
  },
}

export default function ScreeningRuleModal(props: {
  modalIsOpen: boolean
  closeModal: () => void
  rules: ScreeningRuleStructs[]
  setRules: Dispatch<SetStateAction<ScreeningRuleStructs[]>>
}) {
  const { modalIsOpen, closeModal, rules, setRules } = props

  const [selectedRule, setSelectedRule] = useState<ScreeningRuleStructs | null>(
    null,
  )

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        {
          <Form>
            <Form.Group className="mt-3">
              <Form.Label>条件</Form.Label>
              <Form.Control
                as="select"
                value={selectedRule?.type || ''}
                onChange={(e) => {
                  if (!e.target.value) {
                    setSelectedRule(null)
                    return
                  }
                  const type = e.target.value
                  if (type === 'growth_rate') {
                    setSelectedRule({
                      type: 'growth_rate',
                      positive: true,
                      collapsed: true,
                      threshold: 1.5,
                      up: true,
                      ohlc:
                        (selectedRule as ScreeningRuleGrowthRateStruct)?.ohlc ||
                        ('close' as OHLC),
                      before: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
                      after: dayjs().format('YYYY-MM-DD'),
                    } as unknown as ScreeningRuleGrowthRateStruct)
                  }
                  if (type === 'cross_over') {
                    setSelectedRule({
                      type: 'cross_over',
                      positive: true,
                      line1: 'close' as MovingAverageType,
                      line2: 'ma_25' as MovingAverageType,
                      from: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
                      to: dayjs().format('YYYY-MM-DD'),
                    } as unknown as ScreeningRuleCrossOverStruct)
                  }
                }}
              >
                <option value="">選択してください</option>
                <option value="growth_rate">成長率</option>
                <option value="cross_over">クロスオーバー</option>
              </Form.Control>
            </Form.Group>

            {/* 成長率 */}
            {selectedRule?.type === 'growth_rate' && (
              <>
                {(() => {
                  const Rule = selectedRule as ScreeningRuleGrowthRateStruct
                  return (
                    <>
                      <Alert variant="secondary" className="mt-3">
                        特定の日付の株価が、指定した日付の株価より〇〇%以上上昇(下落)しているかどうかを判定します。
                      </Alert>
                      <Form.Group className="mt-3">
                        <Form.Label>上昇 or 下落</Form.Label>
                        <Form.Check
                          type="checkbox"
                          label="上昇"
                          checked={selectedRule.positive}
                          onChange={(e) => {
                            setSelectedRule({
                              ...selectedRule,
                              positive: e.target.checked,
                            })
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label>株価上昇率の閾値</Form.Label>
                        <Form.Control
                          type="number"
                          value={Rule.threshold}
                          step={0.1}
                          onChange={(e) => {
                            setSelectedRule({
                              ...selectedRule,
                              threshold: Number(e.target.value),
                            })
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label>OHLC</Form.Label>
                        <Form.Control
                          as="select"
                          value={(Rule as ScreeningRuleGrowthRateStruct).ohlc}
                          onChange={(e) => {
                            setSelectedRule({
                              ...selectedRule,
                              ohlc: e.target.value as OHLC,
                            } as unknown as ScreeningRuleGrowthRateStruct)
                          }}
                        >
                          <option value="open">始値</option>
                          <option value="high">高値</option>
                          <option value="close">終値</option>
                          <option value="low">安値</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label>期間</Form.Label>
                        <Form.Group className="d-flex justify-content-between align-items-center">
                          <Form.Control
                            type="date"
                            value={Rule.before}
                            onChange={(e) => {
                              setSelectedRule({
                                ...selectedRule,
                                before: e.target.value,
                              })
                            }}
                          />
                          ～
                          <Form.Control
                            type="date"
                            value={Rule.after}
                            onChange={(e) => {
                              setSelectedRule({
                                ...selectedRule,
                                after: e.target.value,
                              })
                            }}
                          />
                        </Form.Group>
                      </Form.Group>
                    </>
                  )
                })()}
              </>
            )}

            {/* クロスオーバー */}
            {selectedRule?.type === 'cross_over' && (
              <>
                {(() => {
                  const Rule = selectedRule as ScreeningRuleCrossOverStruct

                  return (
                    <>
                      <Alert variant="secondary" className="mt-3">
                        移動平均線A(Line 1)が移動平均線B(Line
                        2)を特定の期間内に上回ったかどうかを判定します。
                      </Alert>
                      <Form.Group className="mt-3">
                        <Form.Label>Line 1</Form.Label>
                        <Form.Control
                          as="select"
                          value={Rule.line1}
                          onChange={(e) => {
                            setSelectedRule({
                              ...selectedRule,
                              line1: e.target.value as MovingAverageType,
                            } as unknown as ScreeningRuleCrossOverStruct)
                          }}
                        >
                          <option value="close">終値 (0日移動平均線)</option>
                          <option value="ma_25">25日移動平均線</option>
                          <option value="ma_50">50日移動平均線</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label>Line 2</Form.Label>
                        <Form.Control
                          as="select"
                          value={Rule.line2}
                          onChange={(e) => {
                            setSelectedRule({
                              ...selectedRule,
                              line2: e.target.value as MovingAverageType,
                            } as unknown as ScreeningRuleCrossOverStruct)
                          }}
                        >
                          <option value="close">終値 (0日移動平均線)</option>
                          <option value="ma_25">25日移動平均線</option>
                          <option value="ma_50">50日移動平均線</option>
                        </Form.Control>
                      </Form.Group>
                      {Rule.line1 === Rule.line2 && (
                        <Alert variant="danger" className="mt-3">
                          `Line 1`と`Line 2`が同じです。
                        </Alert>
                      )}
                      <Form.Group className="mt-3">
                        <Form.Label>期間</Form.Label>
                        <Form.Group className="d-flex justify-content-between align-items-center">
                          <Form.Control
                            type="date"
                            value={Rule.from}
                            onChange={(e) => {
                              setSelectedRule({
                                ...selectedRule,
                                from: e.target.value,
                              })
                            }}
                          />
                          ～
                          <Form.Control
                            type="date"
                            value={Rule.to}
                            onChange={(e) => {
                              setSelectedRule({
                                ...selectedRule,
                                to: e.target.value,
                              })
                            }}
                          />
                        </Form.Group>
                      </Form.Group>
                    </>
                  )
                })()}
              </>
            )}

            <Button
              variant="primary"
              className="d-block mt-5 mx-auto"
              onClick={() => {
                if (selectedRule) {
                  setRules([...rules, selectedRule])
                }
                closeModal()
              }}
              disabled={
                selectedRule === null ||
                (selectedRule.type === 'cross_over' &&
                  (selectedRule as ScreeningRuleCrossOverStruct).line1 ===
                    (selectedRule as ScreeningRuleCrossOverStruct).line2)
              }
            >
              追加
            </Button>
          </Form>
        }
      </Modal>
    </>
  )
}
