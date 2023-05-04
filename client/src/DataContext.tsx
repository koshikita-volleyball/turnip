import React, { createContext } from 'react'
import SharedData from './SharedData'
export const DataContext = createContext(
  {} as {
    sharedData: SharedData
    setSharedData: React.Dispatch<React.SetStateAction<SharedData>>
  },
)
