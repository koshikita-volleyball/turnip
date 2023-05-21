import type React from 'react'
import { createContext } from 'react'
import type SharedData from './SharedData'
export const DataContext = createContext(
  {} as {
    sharedData: SharedData
    setSharedData: React.Dispatch<React.SetStateAction<SharedData>>
  }
)
