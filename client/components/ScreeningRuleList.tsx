import React, { Dispatch, SetStateAction } from 'react'
import {
  ScreeningRuleCrossOverStruct,
  ScreeningRuleGrowthRateStruct,
  ScreeningRuleStructs,
} from '../interface/screening_rule'
import { Alert, Table } from 'react-bootstrap'
import {
  Trash,
  ChevronDoubleUp,
  ChevronDoubleDown,
} from 'react-bootstrap-icons'
import dayjs from '../src/dayjs'

export default function ScreeningRuleList(props: {
  rules: ScreeningRuleStructs[]
  setRules: Dispatch<SetStateAction<ScreeningRuleStructs[]>>
}) {
  const { rules, setRules } = props

  if (rules.length === 0) {
    return <Alert variant="warning">ルールがありません。</Alert>
  }

  return (
    <div>
      {rules.map((_Rule, index) => {
        return (
          <Alert key={index} variant="info" className="position-relative">
            {(() => {
              if (_Rule.collapsed) {
                return (
                  <>
                    <ChevronDoubleDown
                      onClick={() => {
                        const _Rules = [...rules]
                        _Rules[index].collapsed = false
                        setRules(_Rules)
                      }}
                      role="button"
                      className="me-3"
                    />
                    Rule #{index + 1} |{' '}
                    {(() => {
                      if (_Rule.type === 'growth_rate') return '株価上昇率'
                      if (_Rule.type === 'cross_over') return 'クロスオーバー'
                    })()}
                  </>
                )
              }

              if (_Rule.type === 'growth_rate') {
                const Rule = _Rule as ScreeningRuleGrowthRateStruct
                return (
                  <>
                    <ChevronDoubleUp
                      onClick={() => {
                        const _Rules = [...rules]
                        _Rules[index].collapsed = true
                        props.setRules(_Rules)
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
                            {Rule.up ? 'over' : 'under'} {Rule.threshold}%
                          </td>
                        </tr>
                        <tr>
                          <th className="w-25">期間</th>
                          <td>
                            {Rule.before} - {Rule.after} |{' '}
                            {dayjs(Rule.after).diff(dayjs(Rule.before), 'day') +
                              1}
                            day(s)
                          </td>
                        </tr>
                        <tr>
                          <th className="w-25">OHLC</th>
                          <td>
                            {(() => {
                              if (Rule.ohlc === 'open') return '始値'
                              if (Rule.ohlc === 'high') return '高値'
                              if (Rule.ohlc === 'low') return '安値'
                              if (Rule.ohlc === 'close') return '終値'
                            })()}
                            ({Rule.ohlc.toUpperCase()})
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </>
                )
              }

              if (_Rule.type === 'cross_over') {
                const Rule = _Rule as ScreeningRuleCrossOverStruct
                return (
                  <>
                    <ChevronDoubleUp
                      onClick={() => {
                        const _Rules = [...rules]
                        _Rules[index].collapsed = true
                        props.setRules(_Rules)
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
                          <td>{Rule.line1}</td>
                        </tr>
                        <tr>
                          <th className="w-25">Line 2</th>
                          <td>{Rule.line2}</td>
                        </tr>
                        <tr>
                          <th className="w-25">期間</th>
                          <td>
                            {Rule.from} - {Rule.to} |{' '}
                            {dayjs(Rule.to).diff(dayjs(Rule.from), 'day') + 1}
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
                if (confirm(`Rule #${index + 1} を削除しますか？`)) {
                  const _Rules = [...rules]
                  _Rules.splice(index, 1)
                  props.setRules(_Rules)
                }
              }}
            />
          </Alert>
        )
      })}
    </div>
  )
}
