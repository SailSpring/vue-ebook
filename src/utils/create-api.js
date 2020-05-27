import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/common/Toast'
import Popup from '../components/common/Popup'
import GroupDialog from '../components/shelf/ShelfGroupDialog'

// 通过Vue.use(CreateAPI)来使用这个插件
Vue.use(CreateAPI)
// use 完之后会在Vue上挂载一个CreateAPI的方法,设置完后，可以通过api的形式调用toast
Vue.createAPI(Toast, true)
// 利用全局的mixin进一步简化,增加一个方法
Vue.createAPI(Popup, true)
// 通过Vue.createAPI()为它生成一个api
Vue.createAPI(GroupDialog, true)
Vue.mixin({
  methods: {
    toast(settings) {
      return this.$createToast({
        $props: settings
      })
    },
    popup(settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    // 再次封装
    simpleToast(text) {
      const toast = this.toast({
        text: text
      })
      toast.show()
      toast.updateText(text)
    },
    dialog(settings) {
      return this.$createGroupDialog({
        $props: settings
      })
    }
  }
})
