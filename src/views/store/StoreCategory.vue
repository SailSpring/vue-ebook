<template>
    <div class="store-shelf">
      <shelf-title :title="shelfCategory.title"></shelf-title>
<!--      top置为0,顶头进行显示-->
<!--      滚动时候出现阴影，借助滚动的onScroll方法-->
      <Scroll class="store-shelf-scroll-wrapper" :top="0" :bottom="scrollBottom" @onScroll = "onScroll" ref="scroll" v-if="ifShowList">
        <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
      </Scroll>
      <div class="store-shelf-empty-view" v-else>
        {{$t('shelf.groupNone')}}
      </div>
      <shelf-footer></shelf-footer>
    </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import Scroll from '../../components/common/Scroll'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'

  export default {
    name: 'StoreShelf',
    //   这样就不需要在每一个组件中引入vueX了
    mixins: [storeShelfMixin],
    components: {
      ShelfFooter,
      ShelfList,
      Scroll,
      ShelfTitle
    },
    watch: {
      isEditMode(isEditMode) {
        this.scrollBottom = isEditMode ? 48 : 0
      //  最后调用scroll组件的refresh方法
      //  整个dom对界面的变化响应完成之后再来实现refresh
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    computed: {
      ifShowList() {
        return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      }
    },
    data() {
      return {
        // 默认是0，处于编辑模式48,增加一个监听器，监听isEditMode的变化
        scrollBottom: 0
      }
    },
    methods: {
      onScroll(offsetY) {
        // 在这个方法里面它会传入offsetY，去设置vueX中的offsetY的值,然后到shelfTitle去做一个监听器
        this.setOffsetY(offsetY)
      }
    },
    mounted () {
      // this.getShelfList()
      this.getCategoryList(this.$route.query.title)
      this.setCurrentType(2)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .store-shelf{
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
    .store-shelf-empty-view{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: px2rem(14);
      color: #333;
      @include center
    }
  }

</style>
