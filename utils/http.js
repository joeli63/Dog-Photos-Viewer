import { decamelizeKeys, camelizeKeys } from '@/utils'

export const filterQueryParams = (params) =>
  Object.keys(params).reduce((queryParams, key) => {
    if (Array.isArray(params[key]) && params[key].length === 0) {
      return queryParams
    }

    if (!params[key] && params[key] !== 0) {
      return queryParams
    }

    return Object.assign(queryParams, {
      [key]: !Array.isArray(params[key])
        ? params[key]
        : params[key].filter((value) => Boolean(value) && value !== 0),
    })
  }, {})

export const normalizeArrayParams = (params) =>
  Object.keys(params).reduce((queryParams, key) => {
    if (Array.isArray(params[key]) && key.substr(-2, 2) !== '[]') {
      queryParams[`${key}[]`] = params[key]
    } else {
      queryParams[key] = params[key]
    }

    return queryParams
  }, {})

export const preprocessStringfyingQuery = (params) => {
  params = decamelizeKeys(params)

  params = normalizeArrayParams(params)

  return params
}