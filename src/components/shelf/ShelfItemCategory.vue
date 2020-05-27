<template>
<!--    第二种类型组件分类组件-->
  <div class="shelf-item-category" v-if="data.itemList.length > 0">
<!--    九宫格列表-->
    <div class="shelf-item-category-list">
<!--      具体的元素-->
      <div class="shelf-item-category-item" v-for="(item, index) in data.itemList" :key="index">
        <img class="shelf-item-category-img" :src="item.cover">
      </div>
    </div>
  </div>
  <div class="shelf-item-category-bg" v-else>
    <span class="icon-book2"></span>
  </div>
</template>
<script>
  export default {
    name: 'ShelfItemCategory',
    props: {
      data: Object
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item-category{
    width: 100%;
    height: 100%;
    /*超出的部分隐藏*/
    overflow: hidden;
    /*九宫格的布局*/
    .shelf-item-category-list{
      display: flex;
      /*水平布局，可以换行*/
      flex-flow: row wrap;
      align-content: flex-start;
      width: 100%;
      height: 100%;
      padding-top: px2rem(5);
      box-sizing: border-box;
      .shelf-item-category-item{
        /*九宫格布局，里面宽度为33.33%*/
        flex: 0 0 33.33%;
        width: 33.33%;
        height: 33.33%;
        box-sizing: border-box;
        /*选择器，选中元素,上右下左*/
        &:nth-child(3n+1) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
        }
        &:nth-child(3n+2) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
        }
        &:nth-child(3n+3) {
          padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
        }
        .shelf-item-category-img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .shelf-item-category-bg {
    width: 100%;
    height: 100%;
    font-size: px2rem(30);
    color: #ccc;
    background: white;
    @include center
  }

</style>
