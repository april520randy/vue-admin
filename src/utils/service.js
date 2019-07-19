import axios from 'axios'

axios.defaults.withCredentials = true

const service = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  timeout: 120000
})

export default service
