// plugins/i18n.js
const blue = {}

blue.install = function(Vue,options){
      // inject a globally available $translate() method
      Vue.config.globalProperties.$func = (key) => {
        // retrieve a nested property in `options`
        // using `key` as the path
        return key+1
      }
    }
  
  export default blue