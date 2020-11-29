// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import main from './main'

Vue.use(ElementUi);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  template: '<main/>',
  render: h => h(main)
})


