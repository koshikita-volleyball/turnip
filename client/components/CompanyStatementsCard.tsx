import React from "react"
import { Alert } from "react-bootstrap"
import FinsStatementsStruct from "../interface/fins_statements"

export default function CompanyStatementsCard(props: {
  statements: FinsStatementsStruct[]
}) {

  if (!props.statements) {
    return <Alert variant="danger">Failed to load statements...</Alert>
  }

  return (
    <>
    </>
  )
}
