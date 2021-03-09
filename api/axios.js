import axios from 'axios'
import { camelizeKeys } from '@/utils'
import * as httpStatusCode from '@/constants/httpStatusCode'

const BASE_API_URI = process.env.apiBaseUrl

const httpClient = axios.create()

const Client = {
  config: {
    headers: {
      'Content-Type': 'application/json',
    },
  },

  store: null,
  redirect: null,

  init({ store, redirect }) {
    this.store = store
    this.redirect = redirect
  },

  setHeader(name, value) {
    this.config.headers[name] = value
  },

  removeHeader(name) {
    delete this.config.headers[name]
  },

  fetch(url, config = {}, options = {}) {
    return this.request({ method: 'get', url }, config, options)
  },

  post(url, data = {}, config = {}, options = {}) {
    return this.request({ method: 'post', url, data }, config, options)
  },

  put(url, data = {}, config = {}, options = {}) {
    return this.request({ method: 'put', url, data }, config, options)
  },

  delete(url, config = {}, options = {}) {
    return this.request({ method: 'delete', url }, config, options)
  },

  request(request, config, options = {}, retry = false) {
    // eslint-disable-next-line prettier/prettier
    const {
      query = {},
      withHeaders = false,
    } = options

    const { url } = request
    request.url = `${BASE_API_URI}/${url}`

    return httpClient
      .request(Object.assign({}, this.config, config, request))
      .then((response) => (withHeaders ? response : response.data))
      .then((data) => data)
      .catch((error) => this.handleError(error, { request, config, options }))
  },

  async handleError(error, requestParams) {
    if (!error.isAxiosError) {
      throw error
    }

    const { status } = error.response

    switch (status) {
      case httpStatusCode.UNAUTHORIZED:
      case httpStatusCode.FORBIDDEN:
        throw new Error('Whoops!')
      case httpStatusCode.UNPROCESSABLE_ENTITY:
        throw new Error('Whoops!')
        break
      default:
        break
    }

    throw error
  },

  retryRequest(requestParams) {
    const { request, config, options } = requestParams

    return this.request(request, config, options, true)
  },
}

export default Client
