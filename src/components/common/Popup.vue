<template>
  <div class="popup" v-if="popupVisible">
    <transition name="fade">
<!-- @click.stop.prevent禁止整个事件冒泡   -->
    <div class="popup-bg" @click.stop.prevent="hide" v-show="popupVisible"></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="visible">
        <div class="popup-title" v-if="title && title.length > 0">{{title}}</div>
        <div class="popup-btn"
           :class="{'danger' : item.type === 'danger'}"
           v-for="(item, index) in btn"
           :key="index"
           @click="item.click">{{item.text}}</div>
    </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'Popup',
    // 传进来的参数
    props: {
      title: String,
      // btn里面是一个一个的对象
      btn: Array
    },
    data() {
      return {
        // 背景和整个弹窗的显示
        popupVisible: false,
        // 用visible控制按钮的显示
        visible: false
      }
    },
    methods: {
      show() {
        this.popupVisible = true
        // 先将整个popup显示出来，再来调用visible
        setTimeout(() => {
          this.visible = true
        })
      },
      hide() {
        this.visible = false
        //  隐藏的过程是先将 visible隐藏 再将 popupVisible隐藏,通过一个异步方法，定时任务
        setTimeout(() => {
          this.popupVisible = false
        }, 200)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .popup{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);
    .popup-bg{
      width: 100%;
      height: 100%;
    }
    .popup-wrapper{
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 2000;
      width: 100%;
      background: white;
      .popup-title{
        width: 100%;
        height: px2rem(44);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(12);
        line-height: px2rem(14);
        padding: px2rem(15);
        box-sizing: border-box;
        color: #999;
        @include center
      }
      .popup-btn{
        width: 100%;
        height: px2rem(60);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(16);
        color: #666;
        font-weight: bold;
        @include center;
        &.danger{
          color: $color-pink;
        }
      }
    }
  }
</style>
