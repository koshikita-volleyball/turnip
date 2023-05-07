import React, { Dispatch, SetStateAction } from 'react'
import {
  ScreeningConditionCrossOverStruct,
  ScreeningConditionGrowthRateStruct,
  ScreeningConditionStructs,
} from '../interface/screening_condition'
import { Alert, Table } from 'react-bootstrap'
import {
  Trash,
  ChevronDoubleUp,
  ChevronDoubleDown,
} from 'react-bootstrap-icons'
import dayjs from '../src/dayjs'

export default function ScreeningConditionList(props: {
  conditions: ScreeningConditionStructs[]
  setConditions: Dispatch<SetStateAction<ScreeningConditionStructs[]>>
}) {
  const { conditions } = props

  if (conditions.length === 0) {
    return <Alert variant="warning">ルールがありません。</Alert>
  }

  return (
    <div>
      {conditions.map((_condition, index) => {
        return (
          <Alert key={index} variant="info" className="position-relative">
            {(() => {
              if (_condition.collapsed) {
                return (
                  <>
                    <ChevronDoubleDown
                      onClick={() => {
                        const _conditions = [...conditions]
                        _conditions[index].collapsed = false
                        props.setConditions(_conditions)
                      }}
                      role="button"
                      className="me-3"
                    />
                    Rule #{index + 1} |{' '}
                    {(() => {
                      if (_condition.type === 'growth_rate') return '株価上昇率'
                      if (_condition.type === 'cross_over')
                        return 'クロスオーバー'
                    })()}
                  </>
                )
              }

              if (_condition.type === 'growth_rate') {
                const condition =
                  _condition as ScreeningConditionGrowthRateStruct
                return (
                  <>
                    <ChevronDoubleUp
                      onClick={() => {
                        const _conditions = [...conditions]
                        _conditions[index].collapsed = true
                        props.setConditions(_conditions)
                      }}
                      role="button"
                      className="me-3"
                    />
                    Rule #{index + 1}
                    <Table className="no-border mt-3">
                      <tbody>
                        <tr>
                          <th className="w-25">条件</th>
                          <td>株価上昇率</td>
                        </tr>
                        <tr>
                          <th className="w-25">株価上昇率の閾値</th>
                          <td>
                            {condition.up ? 'over' : 'under'}{' '}
                            {condition.threshold}%
                          </td>
                        </tr>
                        <tr>
                          <th className="w-25">期間</th>
                          <td>
                            {condition.before} - {condition.after} |{' '}
                            {dayjs(condition.after).diff(
                              dayjs(condition.before),
                              'day',
                            ) + 1}
                            day(s)
                          </td>
                        </tr>
                        <tr>
                          <th className="w-25">OHLC</th>
                          <td>
                            {(() => {
                              if (condition.ohlc === 'open') return '始値'
                              if (condition.ohlc === 'high') return '高値'
                              if (condition.ohlc === 'low') return '安値'
                              if (condition.ohlc === 'close') return '終値'
                            })()}
                            ({condition.ohlc.toUpperCase()})
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </>
                )
              }

              if (_condition.type === 'cross_over') {
                const condition = _condition as ScreeningConditionCrossOverStruct
                return (
                  <>
                    <ChevronDoubleUp
                      onClick={() => {
                        const _conditions = [...conditions]
                        _conditions[index].collapsed = true
                        props.setConditions(_conditions)
                      }}
                      role="button"
                      className="me-3"
                    />
                    Rule #{index + 1}
                    <Table className="no-border mt-3">
                      <tbody>
                        <tr>
                          <th className="w-25">条件</th>
                          <td>クロスオーバー</td>
                        </tr>
                        <tr>
                          <th className="w-25">Line 1</th>
                          <td>{condition.line1}</td>
                        </tr>
                        <tr>
                          <th className="w-25">Line 2</th>
                          <td>{condition.line2}</td>
                        </tr>
                        <tr>
                          <th className="w-25">期間</th>
                          <td>
                            {condition.from} - {condition.to} |{' '}
                            {dayjs(condition.to).diff(
                              dayjs(condition.from),
                              'day',
                            ) + 1}
                            day(s)
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </>
                )
              }

              return null
            })()}
            <Trash
              className="position-absolute top-0 end-0 text-danger fs-2 fw-bold"
              role="button"
              onClick={() => {
                if (confirm('削除しますか？')) {
                  const _conditions = [...conditions]
                  _conditions.splice(index, 1)
                  props.setConditions(_conditions)
                }
              }}
            />
          </Alert>
        )
      })}
    </div>
  )
}
