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
    return (
      <Alert variant="warning" className="mt-3">
        ルールがありません。
      </Alert>
    )
  }

  return (
    <>
      {rules.map((_rule, index) => {
        return (
          <Alert key={index} variant="info" className="mt-3 position-relative">
            {(() => {
              if (_rule.collapsed) {
                return (
                  <>
                    <ChevronDoubleDown
                      onClick={() => {
                        const _rules = [...rules]
                        _rules[index].collapsed = false
                        setRules(_rules)
                      }}
                      role="button"
                      className="me-3"
                    />
                    Rule #{index + 1} |{' '}
                    {(() => {
                      if (_rule.type === 'growth_rate') return '株価上昇率'
                      if (_rule.type === 'cross_over') return 'クロスオーバー'
                    })()}
                  </>
                )
              }

              if (_rule.type === 'growth_rate') {
                const rule = _rule as ScreeningRuleGrowthRateStruct
                return (
                  <>
                    <ChevronDoubleUp
                      onClick={() => {
                        const _rules = [...rules]
                        _rules[index].collapsed = true
                        setRules(_rules)
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
                            {rule.up ? 'over' : 'under'} {rule.threshold}%
                          </td>
                        </tr>
                        <tr>
                          <th className="w-25">期間</th>
                          <td>
                            {rule.before} - {rule.after} |{' '}
                            {dayjs(rule.after).diff(dayjs(rule.before), 'day') +
                              1}
                            day(s)
                          </td>
                        </tr>
                        <tr>
                          <th className="w-25">OHLC</th>
                          <td>
                            {(() => {
                              if (rule.ohlc === 'open') return '始値'
                              if (rule.ohlc === 'high') return '高値'
                              if (rule.ohlc === 'low') return '安値'
                              if (rule.ohlc === 'close') return '終値'
                            })()}
                            ({rule.ohlc.toUpperCase()})
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </>
                )
              }

              if (_rule.type === 'cross_over') {
                const Rule = _rule as ScreeningRuleCrossOverStruct
                return (
                  <>
                    <ChevronDoubleUp
                      onClick={() => {
                        const _rules = [...rules]
                        _rules[index].collapsed = true
                        props.setRules(_rules)
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
                  const _rules = [...rules]
                  _rules.splice(index, 1)
                  setRules(_rules)
                }
              }}
            />
          </Alert>
        )
      })}
    </>
  )
}
