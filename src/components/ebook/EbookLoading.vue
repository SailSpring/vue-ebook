<template>
    <div class="ebook-loading">
      <div class="ebook-loading-wrapper">
        <!--        左右-->
        <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
          <!--         遍历左右两个数组item， 各三条线-->
          <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
            <!--        具体的线,通过ref很方便地获取dom-->
            <div class="ebook-loading-line" ref="line"></div>
            <!--        蒙版-->
            <div class="ebook-loading-mask" ref="mask"></div>
          </div>
        </div>
        <!--        中间-->
        <div class="ebook-loading-center"></div>
      </div>
    </div>
</template>

<script>
  import { px2rem } from '../../utils/utils'

  export default {
    name: 'EbookLoading',
    // 二维数组，第一个数组存储左侧三条线，第二个数组存储右侧三条线
    data() {
      return {
        data: [
          [{}, {}, {}],
          [{}, {}, {}]
        ],
        maskWidth: [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 }
        ],
        lineWidth: [
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 }
        ],
        add: true,
        end: false
      }
    },
    methods: {},
    // 在钩子函数中实现这样的动画，关键是通过setInterval()定时任务来实现
    mounted() {
      this.task = setInterval(() => {
        this.$refs.mask.forEach((item, index) => {
          const mask = this.$refs.mask[index]
          const line = this.$refs.line[index]
          const maskWidth = this.maskWidth[index]
          const lineWidth = this.lineWidth[index]
          if (index === 0) {
            if (this.add && maskWidth.value < 16) {
              maskWidth.value++
              lineWidth.value--
            } else if (!this.add && lineWidth.value < 16) {
              maskWidth.value--
              lineWidth.value++
            }
          } else {
            if (this.add && maskWidth.value < 16) {
              const preMaskWidth = this.maskWidth[index - 1]
              if (preMaskWidth.value >= 8) {
                maskWidth.value++
                lineWidth.value--
              }
            } else if (!this.add && lineWidth.value < 16) {
              const preLineWidth = this.lineWidth[index - 1]
              if (preLineWidth.value >= 8) {
                maskWidth.value--
                lineWidth.value++
              }
            }
          }
          mask.style.width = `${px2rem(maskWidth.value)}rem`
          mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`
          line.style.width = `${px2rem(lineWidth.value)}rem`
          line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`
          if (index === this.maskWidth.length - 1) {
            if (this.add) {
              if (maskWidth.value === 16) {
                this.end = true
              }
            } else {
              if (maskWidth.value === 0) {
                this.end = true
              }
            }
          }
          if (this.end) {
            this.add = !this.add
            this.end = false
          }
        })
      }, 20)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-loading{
    position: relative;
    z-index: 500;
    width: px2rem(63);
    height: px2rem(40);
    background: transparent;
    border: px2rem(1.5) solid #d7d7d7;
    border-radius: px2rem(3);
    .ebook-loading-wrapper{
      display: flex;
      width: 100%;
      height: 100%;
      .ebook-loading-item{
        display: flex;
        flex-direction: column;
        flex: 1;
        /*上下7个像素的内边距*/
        padding: px2rem(7) 0;
        box-sizing: border-box;
        .ebook-loading-line-wrapper{
          flex: 1;
          @include left;
          /*左右7个像素的内边距*/
          padding: 0 px2rem(7);
          box-sizing: border-box;
          .ebook-loading-line{
            flex: 0 0 px2rem(16);
            width: px2rem(16);
            height: px2rem(2);
            background: #d7d7d7;
          }
          .ebook-loading-mask{
            /*默认宽度为0，后面通过改变宽度来进行动态调节*/
            flex: 0 0 0;
            width: 0;
            height: px2rem(2);
          }
        }
      }
      .ebook-loading-center{
        position: absolute;
        left: 50%;
        top: 0;
        width: px2rem(1.5);
        height: 100%;
        background: #d7d7d7;
      }
    }
  }

</style>
