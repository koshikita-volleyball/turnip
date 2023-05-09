import React, { Dispatch, SetStateAction, useState } from 'react'
import Modal from 'react-modal'
import {
  MovingAverageType,
  OHLC,
  ScreeningConditionCrossOverStruct,
  ScreeningConditionGrowthRateStruct,
  ScreeningConditionStructs,
} from '../interface/screening_condition'
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

export default function ScreeningConditionModal(props: {
  modalIsOpen: boolean
  closeModal: () => void
  conditions: ScreeningConditionStructs[]
  setConditions: Dispatch<SetStateAction<ScreeningConditionStructs[]>>
}) {
  const { modalIsOpen, closeModal, conditions, setConditions } = props

  const [selectedCondition, setSelectedCondition] =
    useState<ScreeningConditionStructs | null>(null)

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
                value={selectedCondition?.type || ''}
                onChange={(e) => {
                  if (!e.target.value) {
                    setSelectedCondition(null)
                    return
                  }
                  const type = e.target.value
                  if (type === 'growth_rate') {
                    setSelectedCondition({
                      type: 'growth_rate',
                      positive: true,
                      collapsed: true,
                      threshold: 1.5,
                      up: true,
                      ohlc:
                        (
                          selectedCondition as ScreeningConditionGrowthRateStruct
                        )?.ohlc || ('close' as OHLC),
                      before: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
                      after: dayjs().format('YYYY-MM-DD'),
                    } as unknown as ScreeningConditionGrowthRateStruct)
                  }
                  if (type === 'cross_over') {
                    setSelectedCondition({
                      type: 'cross_over',
                      positive: true,
                      line1: 'close' as MovingAverageType,
                      line2: 'ma_25' as MovingAverageType,
                      from: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
                      to: dayjs().format('YYYY-MM-DD'),
                    } as unknown as ScreeningConditionCrossOverStruct)
                  }
                }}
              >
                <option value="">選択してください</option>
                <option value="growth_rate">成長率</option>
                <option value="cross_over">クロスオーバー</option>
              </Form.Control>
            </Form.Group>

            {/* 成長率 */}
            {selectedCondition?.type === 'growth_rate' && (
              <>
                {(() => {
                  const condition =
                    selectedCondition as ScreeningConditionGrowthRateStruct
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
                          checked={selectedCondition.positive}
                          onChange={(e) => {
                            setSelectedCondition({
                              ...selectedCondition,
                              positive: e.target.checked,
                            })
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label>株価上昇率の閾値</Form.Label>
                        <Form.Control
                          type="number"
                          value={condition.threshold}
                          step={0.1}
                          onChange={(e) => {
                            setSelectedCondition({
                              ...selectedCondition,
                              threshold: Number(e.target.value),
                            })
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label>OHLC</Form.Label>
                        <Form.Control
                          as="select"
                          value={
                            (condition as ScreeningConditionGrowthRateStruct)
                              .ohlc
                          }
                          onChange={(e) => {
                            setSelectedCondition({
                              ...selectedCondition,
                              ohlc: e.target.value as OHLC,
                            } as unknown as ScreeningConditionGrowthRateStruct)
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
                            value={condition.before}
                            onChange={(e) => {
                              setSelectedCondition({
                                ...selectedCondition,
                                before: e.target.value,
                              })
                            }}
                          />
                          ～
                          <Form.Control
                            type="date"
                            value={condition.after}
                            onChange={(e) => {
                              setSelectedCondition({
                                ...selectedCondition,
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
            {selectedCondition?.type === 'cross_over' && (
              <>
                {(() => {
                  const condition =
                    selectedCondition as ScreeningConditionCrossOverStruct

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
                          value={condition.line1}
                          onChange={(e) => {
                            setSelectedCondition({
                              ...selectedCondition,
                              line1: e.target.value as MovingAverageType,
                            } as unknown as ScreeningConditionCrossOverStruct)
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
                          value={condition.line2}
                          onChange={(e) => {
                            setSelectedCondition({
                              ...selectedCondition,
                              line2: e.target.value as MovingAverageType,
                            } as unknown as ScreeningConditionCrossOverStruct)
                          }}
                        >
                          <option value="close">終値 (0日移動平均線)</option>
                          <option value="ma_25">25日移動平均線</option>
                          <option value="ma_50">50日移動平均線</option>
                        </Form.Control>
                      </Form.Group>
                      {condition.line1 === condition.line2 && (
                        <Alert variant="danger" className="mt-3">
                          `Line 1`と`Line 2`が同じです。
                        </Alert>
                      )}
                      <Form.Group className="mt-3">
                        <Form.Label>期間</Form.Label>
                        <Form.Group className="d-flex justify-content-between align-items-center">
                          <Form.Control
                            type="date"
                            value={condition.from}
                            onChange={(e) => {
                              setSelectedCondition({
                                ...selectedCondition,
                                from: e.target.value,
                              })
                            }}
                          />
                          ～
                          <Form.Control
                            type="date"
                            value={condition.to}
                            onChange={(e) => {
                              setSelectedCondition({
                                ...selectedCondition,
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
                if (selectedCondition) {
                  setConditions([...conditions, selectedCondition])
                }
                closeModal()
              }}
              disabled={
                selectedCondition === null ||
                (selectedCondition.type === 'cross_over' &&
                  (selectedCondition as ScreeningConditionCrossOverStruct)
                    .line1 ===
                    (selectedCondition as ScreeningConditionCrossOverStruct)
                      .line2)
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
