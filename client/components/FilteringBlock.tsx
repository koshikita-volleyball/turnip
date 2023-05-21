import React, { type Dispatch, type SetStateAction, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs'
import { MarketInfo, Sector17Info, Sector33Info } from '../data/export'

export default function FilteringBlock (props: {
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
    afterChange
  } = props

  const [collapsed, setCollapsed] = useState(true)

  const [tmp_company_name, setTmpCompanyName] = useState(company_name)
  const [tmp_market_code, setTmpMarketCode] = useState(market_code)
  const [tmp_sector_17_code, setTmpSector17Code] = useState(sector_17_code)
  const [tmp_sector_33_code, setTmpSector33Code] = useState(sector_33_code)

  if (collapsed) {
    return (
      <>
        <div className="bg-light mt-2 p-3 d-flex align-items-center">
          <BsArrowsExpand
            className="d-block me-3"
            role="button"
            onClick={() => { setCollapsed(false) }}
          />
          <span role="button" onClick={() => { setCollapsed(false) }}>
            絞り込み条件を表示する。
          </span>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mt-2 p-3 bg-light border">
        <div className="d-flex align-items-center">
          <BsArrowsCollapse
            className="d-block me-3"
            role="button"
            onClick={() => { setCollapsed(true) }}
          />
          <span role="button" onClick={() => { setCollapsed(true) }}>
            絞り込み条件を非表示にする。
          </span>
        </div>
        <Form.Label className="d-flex mt-3">
          <Form.Check
            type="checkbox"
            onChange={(e) => {
              setUseFiltering(e.target.checked)
              afterChange()
            }}
            checked={useFiltering}
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
              value={tmp_company_name}
              onChange={(e) => {
                const value = e.target.value
                setTmpCompanyName(value)
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
              setTmpMarketCode(value)
            }}
            value={tmp_market_code}
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
              setTmpSector17Code(value)
            }}
            value={tmp_sector_17_code}
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
              setTmpSector33Code(value)
            }}
            value={tmp_sector_33_code}
          >
            <option value="">指定しない</option>
            {Sector33Info.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button
          variant="secondary"
          className="d-block mt-3 mx-auto w-50"
          onClick={() => {
            setCompanyName(tmp_company_name)
            setMarketCode(tmp_market_code)
            setSector17Code(tmp_sector_17_code)
            setSector33Code(tmp_sector_33_code)
            afterChange()
          }}
        >
          絞り込みを適用する
        </Button>
      </div>
    </>
  )
}
