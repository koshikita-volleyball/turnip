import { per_page } from './const'

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const paginate = <T>(arr: T[], page: number): { pagination: Pagination; data: T[] } => {
  const limit = per_page
  const total = arr.length
  const totalPages = Math.ceil(total / limit)
  const hasNext = page < totalPages
  const hasPrev = page > 1

  const data = arr.slice((page - 1) * limit, page * limit)
  return {
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
    data,
  }
}

export default paginate
