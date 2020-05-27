<template>
    <div class="store-home">
      <search-bar></search-bar>
<!--      把这本书传给flap-card,再到flapcard组件中的props中接受这个参数-->
      <flap-card :data="random"></flap-card>
      <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
        <div class="banner-wrapper">
          <div class="banner-img" :style="{backgroundImage:`url('${banner}')`}"></div>
        </div>
        <guess-you-like :data="guessYouLike"></guess-you-like>
        <recommend :data="recommend" class="recommend"></recommend>
<!--        精选-->
        <featured :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')" class="featured"/>
<!--        分类，一排都是，通过循环的方式实现-->
        <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
          <category-book :data="item"></category-book>
        </div>
        <category class="categories" :data="categories"></category>
      </scroll>
    </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  import { storeHomeMixin } from '../../utils/mixin'
  import FlapCard from '../../components/home/FlapCard'
  import { home } from '../../api/store'
  import GuessYouLike from '../../components/home/GuessYouLike'
  import Recommend from '../../components/home/Recommend'
  import Featured from '../../components/home/Featured'
  import CategoryBook from '../../components/home/CategoryBook'
  import Category from '../../components/home/Category'

  export default {
    name: 'StoreHome',
    mixins: [storeHomeMixin],
    components: {
      Category,
      CategoryBook,
      Featured,
      Recommend,
      GuessYouLike,
      FlapCard,
      Scroll,
      SearchBar
    },
    data() {
      return {
        scrollTop: 94,
        random: null,
        banner: '',
        guessYouLike: null,
        recommend: null,
        featured: null,
        categoryList: null,
        categories: null
      }
    },
    mounted () {
      // axios请求完后，都是通过异步的方法返回的
      // 通过异步的方法接受返回值，返回值就是response
      home().then(response => {
        if (response && response.status === 200) {
          const data = response.data
          // console.log(data)
          // Math.random() 随机生成一个0到1之间的数,包括0，不包括1,利用向下取整
          const randomIndex = Math.floor(Math.random() * data.random.length)
          // 然后把这本书传给flap-card
          this.random = data.random[randomIndex]
          // 在data中定义一个banner变量，用来存储data下的banner,然后在dom中进行展示
          this.banner = data.banner
          this.guessYouLike = data.guessYouLike
          this.recommend = data.recommend
          this.featured = data.featured
          this.categoryList = data.categoryList
          this.categories = data.categories
        }
      })
    },
    methods: {
      // 捕捉Y轴的偏移量，外层组件捕捉但不处理
      onScroll(offsetY) {
        this.setOffsetY(offsetY)
        if (offsetY > 0) {
          this.scrollTop = 52
        } else {
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .store-home {
    width: 100%;
    height: 100%;
    .banner-wrapper{
      /*左右两边给10个像素*/
      width: 100%;
      padding: px2rem(10);
      box-sizing: border-box;
      .banner-img{
        /*宽度确定，高度会自动计算，然后进行缩放*/
        width: 100%;
        height: px2rem(150);
      /*  让这张图片适应我们的屏幕尺寸*/
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .recommend {
      margin-top: px2rem(20);
    }
    .featured {
      margin-top: px2rem(20);
    }
    .category-list-wrapper {
      margin-top: px2rem(20);
    }
    .categories {
      margin-top: px2rem(20);
    }
  }
</style>
