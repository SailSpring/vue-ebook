<template>
<!--  每一个书架元素叫shlefItem,shelfItem有三种状态，每种状态给它创建一个组件,然后使用动态组件动态去加载这三个组件，根据传入的参数 -->
  <div class="shelf-item" :class="{'shelf-item-shadow': data.type=== 1 || data.type === 2}"
  @click="onItemClick">
<!--    动态组件通过component标签 is属性判断-->
<!--    也可以把逻辑封装到计算属性里面computed-->
<!--    <component :is="data.type === 1 ? book : (data.type === 2 ? category :add)"></component>-->
    <component :is="item" :data="data" class="shelf-item-component" :class="{'is-edit' : isEditMode && data.type === 2}"></component>
    <div class="icon-selected"
         :class="{'is-selected' : data.selected}"
         v-show="isEditMode && data.type === 1"></div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfBook from './ShelfItemBook'
  import ShelfCategory from './ShelfItemCategory'
  import ShelfAdd from './ShelfItemAdd'
  import { gotoStoreHome } from '../../utils/store'
  export default {
    name: 'ShelfItem',
    // 可以实现数据的共享
    mixins: [storeShelfMixin],
    props: {
      data: Object
    },
    computed: {
      item() {
        return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
      }
    },
    data() {
      return {
        book: ShelfBook,
        category: ShelfCategory,
        add: ShelfAdd
      }
    },
    methods: {
      onItemClick() {
        if (this.isEditMode) {
          this.data.selected = !this.data.selected
        //  将选中的图书放进shelfSelected中
          if (this.data.selected) {
            // 对数据的基础方法做一个扩展，不加重复的元素，在main.js引入utils中的boost
            this.shelfSelected.pushWithoutDuplicate(this.data)
          } else {
          //  更新shelfSelected的值
          //  找的是与this.data.id不相等的数，找的了就把它保留，然后把它还给shelfSelected
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        } else {
          if (this.data.type === 1) {
            this.showBookDetail(this.data)
          } else if (this.data.type === 2) {
            this.$router.push({
              path: '/store/category',
              query: {
                // 其实就是分类的名称
                title: this.data.title
              }
            })
          } else {
            //  去到书城首页,在store.js编写
            gotoStoreHome(this)
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item {
    position: relative;
    width: 100%;
    height: 100%;
    &.shelf-item-shadow{
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
    }
    .shelf-item-component{
      opacity: 1;
      &.is-edit{
        opacity: .5;
      }
    }
    .icon-selected{
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0, 0, 0, .4);
      &.is-selected {
        color: $color-blue;
      }
    }
  }

</style>
