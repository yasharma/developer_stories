import Vue from 'vue'
import axios from 'axios'
import VeeValidate from 'vee-validate'
import Buefy from 'buefy'

window.axios = axios
window.Vue = Vue

Vue.use(VeeValidate)
Vue.use(Buefy, {
  defaultIconPack: 'mdi'
})

Vue.config.productionTip = false

window.axios.defaults.headers.common = {'X-Requested-With': 'XMLHttpRequest'}
window.axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:9000/api/' : ''
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  console.log(error);
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})
