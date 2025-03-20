import axios from 'axios'
const baseUrl = '/'

const act = axios.create({
  baseURL: baseUrl + 'action'
})

const api = axios.create({
  baseURL: baseUrl + 'data'
})

const run = axios.create({
  baseURL: baseUrl
})

export { act, api, run }