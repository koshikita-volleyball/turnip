import React, { type Dispatch, type SetStateAction, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs'
import { MarketInfo, Sector17Info, Sector33Info } from '../data/export'

export default function FilteringBlock (props: {
  useFiltering: boolean
  setUseFiltering: Dispatch<SetStateAction<boolean>>
  companyName: string
  setCompanyName: Dispatch<SetStateAction<string>>
  marketCode: string
  setMarketCode: Dispatch<SetStateAction<string>>
  sector17Code: string
  setSector17Code: Dispatch<SetStateAction<string>>
  sector33Code: string
  setSector33Code: Dispatch<SetStateAction<string>>
  afterChange: () => void
}): React.JSX.Element {
  const {
    useFiltering,
    setUseFiltering,
    companyName,
    setCompanyName,
    marketCode,
    setMarketCode,
    sector17Code,
    setSector17Code,
    sector33Code,
    setSector33Code,
    afterChange
  } = props

  const [collapsed, setCollapsed] = useState(true)

  const [tmpCompanyName, setTmpCompanyName] = useState(companyName)
  const [tmpMarketCode, setTmpMarketCode] = useState(marketCode)
  const [tmpSector17Code, setTmpSector17Code] = useState(sector17Code)
  const [tmpSector33Code, setTmpSector33Code] = useState(sector33Code)

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
              value={tmpCompanyName}
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
            value={tmpMarketCode}
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
            value={tmpSector17Code}
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
            value={tmpSector33Code}
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
            setCompanyName(tmpCompanyName)
            setMarketCode(tmpMarketCode)
            setSector17Code(tmpSector17Code)
            setSector33Code(tmpSector33Code)
            afterChange()
          }}
        >
          絞り込みを適用する
        </Button>
      </div>
    </>
  )
}
