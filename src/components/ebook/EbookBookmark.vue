<template>
    <div class="ebook-bookmark" ref="bookmark">
      <div class="ebook-bookmark-text-wrapper">
        <div class="ebook-bookmark-down-wrapper" ref="iconDown">
          <span class="icon-down"></span>
        </div>
        <div class="ebook-bookmark-text">{{text}}</div>
      </div>
<!--      增加一个样式，判断是否可以定位-->
      <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
        <bookmark :color="color" :width="15" :height="35"></bookmark>
      </div>
    </div>
</template>

<script>
  import Bookmark from '../common/Bookmark'
  import { realPx } from '../../utils/utils'
  import { ebookMixin } from '../../utils/mixin'
  import { getBookmark, saveBookmark } from '../../utils/localStorage'
  // eslint-disable-next-line no-unused-vars
  const BLUE = '#346cbc'
  // eslint-disable-next-line no-unused-vars
  const WHITE = '#fff'
  export default {
    name: 'EbookBookmark',
    mixins: [ebookMixin],
    components: {
      Bookmark
    },
    computed: {
      height() {
        return realPx(35)
      },
      // 临界值
      threshold() {
        return realPx(55)
      },
      fixedStyle() {
        return {
          position: 'fixed',
          top: 0,
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
        }
      }
    },
    // 通过watch监听offSetY的变化
    watch: {
      offsetY(v) {
        // 这些情况什么也不监听
        if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
          return
        }
        if (v >= this.height && v < this.threshold) {
          this.beforeThreshold(v)
        } else if (v >= this.threshold) {
          this.afterThreshold(v)
        } else if (v > 0 && v < this.height) {
          // 状态1管理文本和书签的颜色
          this.beforeHeight()
        } else if (v === 0) {
          this.restore()
        }
      },
      isBookmark(isBookmark) {
        this.isFixed = isBookmark
        if (isBookmark) {
          this.color = BLUE
        } else {
          this.color = WHITE
        }
      }
    },
    data() {
      return {
        text: '',
        color: WHITE,
        isFixed: false
      }
    },
    methods: {
      addBookMark() {
        this.bookmark = getBookmark(this.fileName)
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`
        this.currentBook.getRange(cfirange).then(range => {
          const text = range.toString().replace(/\s\s/g, '')
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          saveBookmark(this.fileName, this.bookmark)
        })
      },
      removeBookMark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark) {
          saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
        }
        this.setIsBookmark(false)
      },
      restore() {
        // 状态4 归位
        setTimeout(() => {
          //  top归位
          this.$refs.bookmark.style.top = `${-this.height}px`
          //  图标归位
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.isFixed) {
          this.setIsBookmark(true)
          this.addBookMark()
        } else {
          this.setIsBookmark(false)
          this.removeBookMark()
        }
      },
      // 状态 1 未超过书签的高度
      beforeHeight(v) {
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
          this.isFixed = true
        } else {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
          this.isFixed = false
        }
      },
      beforeThreshold(v) {
        // 状态2：未到达临界状态，书签吸顶
        this.$refs.bookmark.style.top = `${-v}px`
        this.beforeHeight()
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      afterThreshold(v) {
        // 状态3：到达临界状态
        this.$refs.bookmark.style.top = `${-v}px`
        if (this.isBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
          this.isFixed = true
        }
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      }
    }
  }
</script>

<style lang="scss" ref="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-bookmark{
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper{
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper{
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center
      }
      .ebook-bookmark-text{
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper{
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }

</style>
