<template>
  <div id="app">
    <span class="text">ABCDEFG</span>
    <router-view/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  const getters = {
    a: () => 1,
    b: () => 2,
    c: () => 3
  }
  function fn (keys) {
    const data = {}
    keys.forEach(key => {
      // eslint-disable-next-line no-prototype-builtins
      if (getters.hasOwnProperty(key)) {
        data[key] = getters[key]
      }
    })
    return data
  }
  export default {
    computed: {
      ...mapGetters(['test']),
      ...fn(['a', 'b', 'c'])
    },
    mounted() {
      // this.$store.dispatch('setTest', 101).then(() => {
      //   console.log(this.test)
      // })
      // console.log({
      //   ...this.fn(),
      //   c: 3,
      //   d: 4
      // })
      console.log(this.a, this.b, this.c)
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    var fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })
</script>

<style lang="scss" scoped>
  @import "assets/styles/global.scss";
  .text{
    font-family: "Days One";
    font-size: px2rem(20);
    color: orange;
  }
</style>
