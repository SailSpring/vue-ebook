<template>
    <div class="shelf-search-wrapper" :class="{'search-top': ifInputClicked, 'hide-shadow' : ifHideShadow }">
<!--      ifInputClicked 搜索框被点击的时候class生效-->
      <div class="shelf-search" :class="{'search-top' :  ifInputClicked}">
        <div class="search-wrapper">
<!--          默认引用icon,做图标大小的初始化-->
          <div class="icon-search-wrapper">
            <span class="icon-search icon"></span>
          </div>
          <div class="search-input-wrapper">
            <input class="search-input"
                   type="text"
                   :placeholder="$t('shelf.search')"
                   @click="onSearchClick"
                   v-model="searchText">
          </div>
<!--          对clear的显示状态做一个判断,判断的条件和输入框里的内容有关系,所以我们需要通过v-model在input做一个数据绑定,绑定到searchText变量当中-->
          <div class="icon-clear-wrapper" v-show="searchText.length > 0" @click="clearSearchText">
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
        <div class="icon-locale-wrapper" v-if="!ifInputClicked" @click="switchLocale">
<!--          用一个计算属性来判断该显示哪个按钮-->
          <span class="icon-cn icon" v-if="lang === 'cn'"></span>
          <span class="icon-en icon" v-else></span>
        </div>
        <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
          <span class="cancel-text">{{$t('shelf.cancel')}}</span>
        </div>
      </div>
<!--      整个tab显示状态是由ifInputClicked决定-->
      <transition name="hot-search-move">
        <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
          <!--        tab下面利用循环写它的布局,先创建tab的数据,tab的数据存到计算属性里面,因为它要支持国际化-->
          <!--        key不可以重复-->
          <div class="shelf-search-tab-item" v-for="item in tabs" :key="item.id" @click="onTabClick(item.id)">
            <!--          其中一个文本会有一个选中状态 item.id === selectedTab-->
            <span class="shelf-search-tab-text" :class="{'is-selected': item.id === selectedTab}">{{item.text}}</span>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import { setLocalStorage } from '../../utils/localStorage'
  import { storeShelfMixin } from '../../utils/mixin'

  export default {
    name: 'ShelfSearch',
    mixins: [storeShelfMixin],
    watch: {
      // 监听offsetY的变化,然后维护data中的一个变量ifHideShadow,是否隐藏阴影
      offsetY(offsetY) {
        if (offsetY > 0 && this.ifInputClicked) {
          this.ifHideShadow = false // 显示阴影
        } else {
          this.ifHideShadow = true
        }
      }
    },
    computed: {
      lang() {
        return this.$i18n.locale
      },
      tabs() {
        // 直接返回一个数组,数组里面包含对象,每个对象里面包含id和text
        return [
          {
            id: 1,
            text: this.$t('shelf.default')
          },
          {
            id: 2,
            text: this.$t('shelf.progress')
          },
          {
            id: 3,
            text: this.$t('shelf.purchase')
          }
        ]
      }
    },
    data() {
      return {
        // 定义一个变量记录是否点击搜索框,默认没有点击
        ifInputClicked: false,
        searchText: '',
        // 表示id为1的tab被选中
        selectedTab: 1,
        ifHideShadow: true
      }
    },
    methods: {
      onTabClick(id) {
        this.selectedTab = id
      },
      clearSearchText() {
        this.searchText = ''
      },
      switchLocale() {
        // 获取计算属性中的语言
        // 这个修改不会保存到localStorage中
        if (this.lang === 'en') {
          this.$i18n.locale = 'cn'
        } else {
          this.$i18n.locale = 'en'
        }
        setLocalStorage('locale', this.$i18n.locale)
      },
      onSearchClick() {
        this.ifInputClicked = true
        this.setShelfTitleVisible(false)
      },
      onCancelClick() {
        this.ifInputClicked = false
        this.setShelfTitleVisible(true)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-search-wrapper{
    position: relative;
    z-index: 105;
    width: 100%;
    /*上面(标题)42,搜索框52加起来就是94*/
    height: px2rem(94);
    font-size: px2rem(16);
    background: white;
    /*rgba(0,0,0,.1) 黑色0.1的透明度*/
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-shadow{
      box-shadow: none;
    }
    &.search-top{
      position: fixed;
      left: 0;
      top: 0;
    }
    .shelf-search{
      position: absolute;
      top: px2rem(42);
      left: 0;
      display: flex;
      width: 100%;
      height: px2rem(52);
      z-index: 105;
      /*监听top的变化,0.2s,线性*/
      transition: top $animationTime linear;
      &.search-top {
        top: 0;
      }
      .search-wrapper{
        flex: 1;
        display: flex;
        margin: px2rem(8) 0 px2rem(8) px2rem(10);
        border: px2rem(1) solid #ccc;
        border-radius: px2rem(3);
        .icon-search-wrapper{
          flex: 0 0 px2rem(22);
          @include right
          .icon-search{
            font-size: px2rem(12);
          }
        }
        .search-input-wrapper{
          /*自动拉伸*/
          flex: 1;
          /*内部左右给10个边距*/
          padding: 0 px2rem(10);
          box-sizing: border-box;
          @include center
          .search-input{
            width: 100%;
            font-size: px2rem(14);
            border: none;
            color: #333;
          /*  解决选中会出现外边框*/
            &:focus {
              outline: none;
            }
          /*  修改里面的placeHolder样式*/
            &::-webkit-input-placeholder{
              font-size: px2rem(14);
              color: #ccc;
            }
          }
        }
        .icon-clear-wrapper{
          flex: 0 0 px2rem(24);
          @include left
          .icon-close-circle-fill{
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-locale-wrapper{
        flex: 0 0 px2rem(55);
        @include center;
        .icon-cn, .icon-en{
          font-size: px2rem(22);
          color: #666;
        }
      }
      .cancel-btn-wrapper{
        flex: 0 0 px2rem(55);
        @include center
        .cancel-text{
          font-size: px2rem(14);
          color: $color-blue;
        }
      }
    }
    .shelf-search-tab-wrapper{
      position: absolute;
      top: px2rem(52);
      left: 0;
      z-index: 105;
      display: flex;
      width: 100%;
      height: px2rem(42);
      .shelf-search-tab-item{
        /*撑满*/
        flex: 1;
        @include center
        .shelf-search-tab-text{
          font-size: px2rem(12);
          color: #999;
          &.is-selected {
            color: $color-blue;
          }
        }
      }
    }
  }

</style>
