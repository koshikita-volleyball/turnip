import React, { Dispatch, SetStateAction } from 'react'
import { Button, Form } from 'react-bootstrap'

import { MarketInfo, Sector17Info, Sector33Info } from '../data/export'

export default function FilteringBlock(props: {
  useFiltering: boolean
  setUseFiltering: Dispatch<SetStateAction<boolean>>
  company_name: string
  setCompanyName: Dispatch<SetStateAction<string>>
  market_code: string
  setMarketCode: Dispatch<SetStateAction<string>>
  sector_17_code: string
  setSector17Code: Dispatch<SetStateAction<string>>
  sector_33_code: string
  setSector33Code: Dispatch<SetStateAction<string>>
  afterChange: () => void
}) {

  const {
    useFiltering,
    setUseFiltering,
    company_name,
    setCompanyName,
    market_code,
    setMarketCode,
    sector_17_code,
    setSector17Code,
    sector_33_code,
    setSector33Code,
    afterChange,
  } = props

  return (
    <>
      <div className="mt-3 p-3 bg-light border">
        <Form.Label className='d-flex mt-3'>
          <Form.Check
            type="checkbox"
            onChange={(e) => {
              setUseFiltering(e.target.checked)
              afterChange()
            }}
            className="me-3"
          />
          絞り込みを使用する。
        </Form.Label>
        <Form>
          <Form.Group className="mt-3">
            <Form.Label>銘柄名</Form.Label>
            <Form.Control
              type="text"
              placeholder="銘柄名"
              value={company_name}
              onChange={(e) => {
                setCompanyName(e.target.value)
                afterChange()
              }}
            />
          </Form.Group>
        </Form>
        <Form.Group className="mt-3">
          <Form.Label>市場</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => {
              const value = e.target.value
              setMarketCode(value)
              afterChange()
            }}
            value={market_code}
          >
            <option value="">指定しない</option>
            {MarketInfo.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>17業種</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => {
              const value = e.target.value
              setSector17Code(value)
              afterChange()
            }}
            value={sector_17_code}
          >
            <option value="">指定しない</option>
            {Sector17Info.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>33業種</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => {
              const value = e.target.value
              setSector33Code(value)
              afterChange()
            }}
            value={sector_33_code}
          >
            <option value="">指定しない</option>
            {Sector33Info.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>
    </>
  )
}
