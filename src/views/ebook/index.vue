<template>
<!-- ref="ebook"方便获取dom，改变top值 -->
    <div class="ebook" ref="ebook">
      <ebook-header></ebook-header>
      <ebook-reader></ebook-reader>
      <ebook-title></ebook-title>
      <ebook-menu></ebook-menu>
      <ebook-bookmark></ebook-bookmark>
      <ebook-footer></ebook-footer>
    </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  import EbookBookmark from '../../components/ebook/EbookBookmark'
  import EbookHeader from '../../components/ebook/EbookHeader'
  import EbookFooter from '../../components/ebook/EbookFooter'
  import { getReadTime, saveReadTime } from '../../utils/localStorage'
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin],
    name: 'index',
    components: {
      EbookReader,
      // eslint-disable-next-line vue/no-unused-components
      EbookTitle,
      EbookMenu,
      EbookBookmark,
      EbookHeader,
      EbookFooter
    },
    // 通过watch事件来监听offsetY的值(在EbookReader组件中)来改变top实现下拉,v代表新的值
    watch: {
      // bookAvailable分页没好不能下拉，默认false
      offsetY(v) {
        if (!this.menuVisible && this.bookAvailable) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore()
          }
        }
      }
    },
    methods: {
      restore() {
        this.$refs.ebook.style.top = 0
        this.$refs.ebook.style.transition = 'all .2s linear'
        setTimeout(() => {
          this.$refs.ebook.style.transition = ''
        }, 200)
      },
      move(v) {
        this.$refs.ebook.style.top = v + 'px'
      },
      startLoopReadTime() {
        let readTime = getReadTime(this.fileName)
        if (!readTime) {
          readTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          if (readTime % 30 === 0) {
            saveReadTime(this.fileName, readTime)
          }
        }, 1000)
      }
    },
    mounted () {
      this.startLoopReadTime()
    },
    beforeDestroy () {
      if (this.task) {
        // 终止当前定时任务
        clearInterval(this.task)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  /*下拉是通过绝对定位改变top值进行下拉*/
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

</style>
