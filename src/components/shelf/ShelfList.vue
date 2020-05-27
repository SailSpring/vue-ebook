<template>
  <div class="shelf-list" :style="{top: shelfListTop}">
<!--    通过循环获取每一本图书-->
<!--    transition-group与transition不同的是，会给下面遍历的每一个item都添加class,以实际dom的形式存在，所以需要一个tag-->
    <transition-group name="list"
                      tag="div"
                      id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <!--      把遍历到的数据传递给shelf-item,我们在shelfitem中接受数据-->
        <!--      高度利用style指定height属性,height是动态计算的,计算属性里面加入itemHeight-->
        <!--      主要用来显示封面-->
        <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
        <!--      增加标题的显示-->
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItem from './ShelfItem'
  import { px2rem, realPx } from '../../utils/utils'

  export default {
    name: 'ShelfList',
    components: { ShelfItem },
    mixins: [storeShelfMixin],
    // 用来接受用户输入的top
    props: {
      top: {
        type: Number,
        default: 94
      },
      data: Array
    },
    computed: {
      itemHeight() {
        // 图片的宽高比为250 * 350
        // 实际高度h = w*350/250
        return ((window.innerWidth - realPx(120)) / 3) * 350 / 250 + 'px'
      },
      shelfListTop() {
        return px2rem(this.top) + 'rem'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-list {
    position: absolute;
    left: 0;
    width: 100%;
    /*如果z-index跟shelfSearch一样都是105，但又出现在shelfSearch后面，所以它就覆盖了shelfSearch*/
    z-index: 100;
    #shelf-list{
      display: flex;
      /*水平排列可以换行,不加wrap所有图书被挤在一行*/
      flex-flow: row wrap;
      width: 100%;
      /*最外层增加边距15，然后每一本书组件中再和左右相隔15，这样每本书的间距就是30*/
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .shelf-list-item-wrapper{
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: px2rem(15);
        box-sizing: border-box;
        &.list-leave-active {
          display: none;
        }
        &.list-move {
          /*监听transform*/
          transition: transform .5s;
        }
        .shelf-list-title-wrapper{
          margin-top: px2rem(10);
        }
      }
    }
  }

</style>
