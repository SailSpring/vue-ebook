<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
<!--    卡片登场 keyframes动画-->
    <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
      <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
        <div class="flap-card-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left" :style="semiCircleStyle(item, 'left')" ref="left">
          </div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right" :style="semiCircleStyle(item, 'right')" ref="right">
          </div>
        </div>
      </div>
<!--      烟花,创建18个dom,作为烟花点，建好小球写小球的样式-->
      <div class="point-wrapper">
<!--        小球的运动动画绑定一个class来控制显示与不显示-->
        <div class="point" :class="{'animation': runPointAnimation}" v-for="item in pointList" :key="item"></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''">
        </div>
        <div class="content-wrapper">
          <div class="title">{{data ? data.title : ''}}</div>
          <div class="author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'
  import { flapCardList, categoryText } from '../../utils/store'

  export default {
    name: 'FlapCard',
    mixins: [storeHomeMixin],
    props: {
      // 接受一个data 是object类型
      data: Object
    },
    data() {
      return {
        flapCardList,
        front: 0,
        back: 1,
        intervalTime: 25,
        runFlapCardAnimation: false,
        // pointList是数组表示小球
        pointList: null,
        runPointAnimation: false,
        runBookCardAnimation: false
      }
    },
    watch: {
      flapCardVisible(v) {
        if (v) {
          this.runAnimation()
        }
      }
    },
    methods: {
      categoryText() {
        if (this.data) {
          return categoryText(this.data.category, this)
        } else {
          return ''
        }
      },
      startPointAnimation() {
        this.runPointAnimation = true
      //  0.75秒后去掉animation，通过异步方法来进行控制
        setTimeout(() => {
          this.runPointAnimation = false
        }, 750)
      },
      runAnimation() {
        this.runFlapCardAnimation = true
        // 异步方式300毫秒之后执行
        this.timeout = setTimeout(() => {
          this.startFlapCardAnimation()
          this.startPointAnimation()
        }, 300)
        this.timeout2 = setTimeout(() => {
          this.stopAnimation()
          this.runBookCardAnimation = true
        }, 2500)
      },
      close() {
        this.setFlapCardVisible(false)
        this.stopAnimation()
      },
      semiCircleStyle(item, dir) {
        return {
          backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
          backgroundSize: item.backgroundSize,
          backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
        }
      },
      // 转动时通过这个函数转动，改变角度和颜色，前面的圆右边部分转动，后面的圆左边部分转动
      rotate(index, type) {
        const item = this.flapCardList[index]
        let dom
        if (type === 'front') {
          dom = this.$refs.right[index]
        } else {
          dom = this.$refs.left[index]
        }
        dom.style.transform = `rotateY(${item.rotateDegree}deg)`
        dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
      },
      flapCardRotate() {
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.back]
        // 右边转动
        frontFlapCard.rotateDegree += 10
        // 颜色加深
        frontFlapCard._g -= 5
        backFlapCard.rotateDegree -= 10
        backFlapCard._g += 5
        if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
          backFlapCard.zIndex += 2
        }
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
          this.next()
        }
      },
      next() {
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.back]
        // 做还原操作，准备开始第二组
        frontFlapCard.rotateDegree = 0
        backFlapCard.rotateDegree = 0
        frontFlapCard._g = frontFlapCard.g
        backFlapCard._g = backFlapCard.g
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        // 还原后将指针指向下一个
        this.front++
        this.back++
        const len = this.flapCardList.length
        if (this.front >= len) {
          this.front = 0
        }
        if (this.back >= len) {
          this.back = 0
        }
        // 动态改变zIndex值
        // 100 -> 96
        // 99 -> 100
        // 98 -> 99
        // 97 -> 98
        // 96 -> 97
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - ((index - this.front + len) % len)
          // switch (index) {
          //   case 0:
          //     item.zIndex = 96
          //     break
          //   case 1:
          //     item.zIndex = 100
          //     break
          //   case 2:
          //     item.zIndex = 99
          //     break
          //   case 3:
          //     item.zIndex = 98
          //     break
          //   case 4:
          //     item.zIndex = 97
          // }
        })
      //  归位以后要做一次prepare操作
        this.prepare()
      },
      prepare() {
        const backFlapCard = this.flapCardList[this.back]
        backFlapCard.rotateDegree = 180
        backFlapCard._g = backFlapCard.g - 5 * 18
        this.rotate(this.back, 'back')
      },
      startFlapCardAnimation() {
        this.prepare()
        // 让后面的左半部分转动180度后与前面部分重叠，再开始转动，两个是一起转动的，到了垂直部分改动z-index显示发生变化
        this.task = setInterval(() => {
          this.flapCardRotate()
        }, this.intervalTime)
      },
      reset() {
        this.front = 0
        this.back = 1
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - index
          item._g = item.g
          item.rotateDegree = 0
          this.rotate(index, 'front')
          this.rotate(index, 'back')
        })
        this.runBookCardAnimation = false
        this.runFlapCardAnimation = false
        this.runPointAnimation = false
      },
      stopAnimation() {
        // 关掉定时任务
        if (this.task) {
          clearInterval(this.task)
        }
        this.reset()
      //  关掉异步方法
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        if (this.timeout2) {
          clearTimeout(this.timeout2)
        }
      }
    },
  //  创建小球 整个dom在创建的时候就把pointList创建起来,一共18个小球
    created () {
      this.pointList = []
      for (let i = 0; i < 18; i++) {
        this.pointList.push(`point${i}`)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  @import "../../assets/styles/flapCard";
  .flap-card-wrapper{
    @include absCenter;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    @include center
    .flap-card-bg{
      position: relative;
      width: px2rem(64);
      height: px2rem(64);
      border-radius: px2rem(5);
      background: white;
      /*默认缩放变成0,透明度变成0*/
      transform: scale(0);
      opacity: 0;
      /*0.3s执行登场动画之后再来翻转动画*/
      &.animation {
        /*加入both状态会维持在最后百分之百的状态*/
        animation: flap-card-move .3s ease-in both;
      }
      /*css3的新特性*/
      @keyframes flap-card-move {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
        75% {
          transform: scale(1.9);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .flap-card{
        width: px2rem(48);
        height: px2rem(48);
        /*绝对定位的居中*/
        @include absCenter;
        .flap-card-circle{
          /*半圆的通用样式*/
          display: flex;
          width: 100%;
          height: 100%;
          .flap-card-semi-circle{
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
          /*  转动到背面的显示状态*/
            backface-visibility: hidden;
          }
          .flap-card-semi-circle-left{
            /*上 右 下 左 左半圆*/
            border-radius: px2rem(24) 0 0 px2rem(24);
            /*居中，左边的图片居右显示*/
            background-position: center right;
          /*  转动轴*/
            transform-origin: right;
          }
          .flap-card-semi-circle-right{
            border-radius: 0 px2rem(24)  px2rem(24) 0;
            background-position: center left;
            transform-origin: left;
          }
        }
      }
      .point-wrapper {
        /*保证浮在表面能够被看到*/
        z-index: 1500;
        @include absCenter
        .point {
          /*圆形*/
          border-radius: 50%;
          @include absCenter;
        /*  引入flapCard.scss,后实现小球的宽高以及动画*/
          &.animation {
          /*  使用scss的循环来实现*/
            @for $i from 1 to length($moves) {
              /*找到对应的point元素,然后给它定义独特的样式*/
              &:nth-child(#{$i}) {
                @include move($i)
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      // height: 70%;
      max-width: px2rem(400);
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
    .close-btn-wrapper{
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      z-index: 1100;
      width: 100%;
      @include center
      .icon-close{
        width: px2rem(45);
        height: px2rem(45);
        border-radius: 50%;
        background: #333;
        font-size: px2rem(25);
        color: white;
        @include center
      }
    }
  }

</style>
