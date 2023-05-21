import { type Dispatch, type SetStateAction, createContext } from 'react'
import type SharedData from './SharedData'

const initSharedData: SharedData = {
  username: null,
  email: null
}
const initSetSharedData: Dispatch<SetStateAction<SharedData>> = () => {}

const dataContextContent = {
  sharedData: initSharedData,
  setSharedData: initSetSharedData
}

export const DataContext = createContext(
  dataContextContent
)
