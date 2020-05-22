<template>
    <div class="bookmark" :style="style" ref="bookmark"></div>
</template>

<script>
  import { px2rem } from '../../utils/utils'

  export default {
    name: 'Bookmark',
    props: {
      width: Number,
      height: Number,
      color: String
    },
    // 改变颜色
    computed: {
      style() {
        if (this.color) {
          return { borderColor: `${this.color} ${this.color} transparent ${this.color}` }
        } else {
          return {}
        }
      }
    },
  //  改变宽高
    methods: {
      refresh() {
        if (this.height && this.width) {
          // 上 左 下 右 上+下=高 左+右=宽
          this.$refs.bookmark.style.borderWidth = `${px2rem(this.height - 5)}rem ${px2rem(this.width / 2)}rem ${px2rem(5)}rem ${px2rem(this.width / 2)}rem`
        }
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .bookmark{
    /*宽高都设置为0，当前界面几乎缩小为一个点*/
    width: 0;
    height: 0;
    border-width: px2rem(50) px2rem(10) px2rem(10) px2rem(10);
    border-style: solid;
    border-color: white white transparent white;
  }

</style>
