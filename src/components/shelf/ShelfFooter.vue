<template>
    <div class="shelf-footer" v-show="isEditMode">
<!--      对布局里面的元素做一些设定，写在计算属性computed里面,对tab数据做一个设定,tab是一个数组。-->
<!--      我们要使用国际化，所以把它写在计算属性里面-->
      <div class="shelf-footer-tab-wrapper"
           v-for="item in tabs"
           :key="item.index"
           @click="onTabClick(item)">
        <div class="shelf-footer-tab" :class="{'is-selected' : isSelected}">
          <div class="icon-private tab-icon"  v-if="item.index === 1 && !isPrivate"></div>
          <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
          <div class="icon-download tab-icon" v-if="item.index === 2 && !isDownload"></div>
          <div class="icon-download-remove tab-icon" v-if="item.index === 2 && isDownload"></div>
          <div class="icon-move tab-icon" v-if="item.index === 3"></div>
          <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
<!--          显示的文字用一个方法去展示-->
<!--          建一个label方法，把item传入进去-->
          <div class="tab-text" :class="{'remove-text': item.index === 4}">{{label(item)}}</div>
        </div>
      </div>
    </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import { removeLocalStorage, saveBookShelf } from '../../utils/localStorage'
  import { download } from '../../api/store'
  import { removeLocalForage } from '../../utils/localForage'

  export default {
    name: 'ShelfFooter',
    mixins: [storeShelfMixin],
    computed: {
      isSelected() {
        return this.shelfSelected && this.shelfSelected.length > 0
      },
      tabs() {
        return [
          {
            label: this.$t('shelf.private'),
            label2: this.$t('shelf.noPrivate'),
            index: 1
          },
          {
            label: this.$t('shelf.download'),
            label2: this.$t('shelf.delete'),
            index: 2
          },
          {
            label: this.$t('shelf.move'),
            index: 3
          },
          {
            label: this.$t('shelf.remove'),
            index: 4
          }
        ]
      },
    //  判断我们选中的当前图书是不是私密阅读状态
      isPrivate() {
        // 没有选中图书
        if (!this.isSelected) {
          return false
        } else {
        //  如果选中图书我们就做一个遍历，去遍历shelfSelected使用every方法，需要每一本书都是private状态，才会判断它是private
          return this.shelfSelected.every(item => item.private)
        }
      },
      isDownload() {
        // 没有选中图书
        if (!this.isSelected) {
          return false
        } else {
          //  如果选中图书我们就做一个遍历，去遍历shelfSelected使用every方法，需要每一本书都是cache状态，才会判断它是private
          return this.shelfSelected.every(item => item.cache)
        }
      }
    },
    data() {
      return {
        // 将popup定义为组件间的变量，这样操作起来就会很方便
        popupMenu: null
      }
    },
    methods: {
      // 删除缓存
      removeSelectedBook() {
        // 一次性处理完所有电子书
        Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(books => {
          books.map(book => {
            book.cache = false
          })
          saveBookShelf(this.shelfList)
          this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
        })
      },
      removeBook(book) {
        return new Promise((resolve, reject) => {
          removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
          // 删除离线的电子书
          removeLocalForage(`${book.fileName}`)
          // 前两句执行完后，直接去执行resolve 在Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
          resolve(book)
        })
      },
      // 加完 async await 后会采用同步的方式
      async downloadSelectedBook() {
        for (let i = 0; i < this.shelfSelected.length; i++) {
        //  针对遍历出来的结果做一个下载,将book对象传入
          await this.downloadBook(this.shelfSelected[i]).then(book => {
            book.cache = true
          })
        }
      },
      downloadBook(book) {
        // 持续下载的显示
        let text = ''
        const toast = this.toast({
          text
        })
        toast.continueShow()
        // 电子书下载其实是通过一个Promise对象
        return new Promise((resolve, reject) => {
          // 自己去调一个api
          download(book, () => {
            // console.log('下载完毕')
            // toast.hide()
            // 隐藏toast，然后去调用这个函数的后面.then处理resolve
            toast.remove()
            resolve(book)
          }, reject, progressEvent => {
            // console.log(progressEvent)
            // 下载进度计算
            const process = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
            text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${process})`)
            // console.log(text)
            toast.updateText(text)
          })
        })
      },
      removeSelected() {
        this.shelfSelected.forEach(selected => {
          // 如果shelfList里的书与shelfSelected不相等就留下来
          this.setShelfList(this.shelfList.filter(book => book !== selected))
        })
        this.setShelfSelected([])
        this.onComplete()
      },
      onComplete() {
        this.hidePopup()
        this.setIsEditMode(false)
        // 存储书架列表中每本书的状态到localstorage
        saveBookShelf(this.shelfList)
      },
      hidePopup() {
        this.popupMenu.hide()
      },
      setPrivate() {
        let isPrivate
        if (this.isPrivate) {
          isPrivate = false
        } else {
          isPrivate = true
        }
        // 实现逻辑完后，要把它写到选中图书里面
        this.shelfSelected.forEach(book => {
          book.private = isPrivate
        })
        this.onComplete()
        if (isPrivate) {
          this.simpleToast(this.$t('shelf.setPrivateSuccess'))
        } else {
          this.simpleToast(this.$t('shelf.closePrivateSuccess'))
        }
      },
      showPrivate() {
        this.popupMenu = this.popup({
          title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
          btn: [
            {
              text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
              click: () => {
                this.setPrivate()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      async setDownload() {
        // 自动找到所有所选的图书并且实现下载
        this.onComplete()
        if (this.isDownload) {
          this.removeSelectedBook()
        } else {
          // 弹出进度 和 显示成功冲突 在downloadSelectedBook 中加入es2017 async  await
          // 异步方法 设置完async，await后，会等await后面这句话执行完，虽然downloadSelectedBook是异步的，再执行下一句
          await this.downloadSelectedBook()
          // 下载是一本一本进行下载
          saveBookShelf(this.shelfList)
          // 同步方法
          // console.log('aaaaaaaaa')
          this.simpleToast(this.$t('shelf.setDownloadSuccess'))
        }
      },
      showDownload() {
        this.popupMenu = this.popup({
          title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
          btn: [
            {
              text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
              click: () => {
                this.setDownload()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      showRemove() {
        let title
        if (this.shelfSelected.length === 1) {
          title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
        } else {
          title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
        }
        this.popupMenu = this.popup({
          title: title,
          btn: [
            {
              text: this.$t('shelf.removeBook'),
              // 按钮的颜色变成红色
              type: 'danger',
              click: () => {
                this.removeSelected()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      onTabClick(item) {
        // 完成dom的创建 show完成显示
        // 可以使组件之间的耦合度大大下降，不需要import toast
        // this.$createToast({
        //   $props: {
        //     text: 'hello zj'
        //   }
        // }).show()
      // 进一步简化 利用全局的mixin进一步简化,增加一个方法 在create-api.js
      //   this.toast({ text: 'zhao' }).show()
      //  没有选中元素，不对这个点击事件进行处理
        if (!this.isSelected) {
          return
        }
        // 反之 去判断
        switch (item.index) {
          case 1:
            this.showPrivate()
            break
          case 2:
            this.showDownload()
            break
          case 3:
            this.dialog().show()
            break
          case 4:
            this.showRemove()
            break
          default:
            break
        }
      },
      label(item) {
        switch (item.index) {
          case 1:
            return this.isPrivate ? item.label2 : item.label
          case 2:
            return this.isDownload ? item.label2 : item.label
          default:
            return item.label
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-footer{
    /*不考虑最外层的情况*/
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    .shelf-footer-tab-wrapper{
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab{
        width: 100%;
        height: 100%;
        @include columnCenter;
        opacity: .5;
        &.is-selected {
          opacity: 1;
        }
        .tab-icon{
          font-size: px2rem(20);
          color: #666;
        }
        .tab-text{
          top: px2rem(5);
          font-size: px2rem(12);
          color: #666;
          &.remove-text {
            color: $color-pink;
          }
        }
        .icon-shelf {
          color: $color-pink;
        }
      }
    }
  }

</style>
