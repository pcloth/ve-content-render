import VueComponent from './lib/ve-content-render.vue'
export function install(Vue) {
  Vue.component(VueComponent.name, VueComponent)
  /* -- Add more components here -- */
}
export default VueComponent

