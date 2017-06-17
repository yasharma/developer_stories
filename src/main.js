// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './bootstrap'
import Vue from 'vue'
import pageHeader from './components/Header'
import router from './router'

// Bulma CSS file
import './assets/css/bulma.min.css'
import 'buefy/lib/buefy.css'
import './assets/css/style.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // template: '<App/>',
  components: { pageHeader }
})
