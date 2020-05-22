<template>
    <div class="ebook-slide-contents">
      <div class="slide-contents-search-wrapper">
        <div class="slide-contents-search-input-wrapper">
          <div class="slide-contents-search-icon">
            <span class="icon-search"></span>
          </div>
          <!-- v-model="searchText"  这样就可以完成双向数据绑定-->
          <!-- @keyup.enter="search()"  绑定一个search方法-->
          <!-- .exact  只能点击回车键才能生效-->
          <input class="slide-contents-search-input"
          type="text"
          v-model="searchText"
          @keyup.enter.exact="search()"
          :placeholder="$t('book.searchHint')"
          @click="showSearchPage">
        </div>
        <div class="slide-contents-search-cancel" v-if="searchVisible" @click="hideSearchPage">{{$t('book.cancel')}}</div>
      </div>
      <div class="slide-contents-book-wrapper" v-show="!searchVisible">
        <div class="slide-contents-book-img-wrapper">
          <img :src="cover" class="slide-contents-book-img">
        </div>
        <div class="slide-contents-book-info-wrapper">
          <div class="slide-contents-book-title">{{metadata.title}}</div>
          <div class="slide-contents-book-author">{{metadata.creator}}</div>
        </div>
        <div class="slide-contents-book-progress-wrapper">
          <div class="slide-contents-book-progress">
            <span class="progress">{{progress + '%'}}</span>
            <span class="progress-text">{{$t('book.haveRead2')}}</span>
          </div>
          <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
        </div>
      </div>
      <Scroll class="slide-contents-list" :top="156" :bottom="48" v-show="!searchVisible">
        <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
          <!--          二级目录缩进，动态绑定style-->
          <span class="slide-contents-item-label" :class="{'selected': section === index}" :style="contentItemStyle(item)"
          @click="displaySearchAndNavigation(item.href)">{{item.label}}</span>
          <span class="slide-contents-item-page"></span>
        </div>
      </Scroll>
      <Scroll class="slide-search-list" :top="66" :bottom="48" v-show=" searchVisible">
<!--        给出搜索结果,v-html="item.excerpt",将内容作为html内容，这样可实现高亮-->
        <div class="slide-search-item" v-for="(item, index) in searchList" :key="index" v-html="item.excerpt" @click="displaySearchAndNavigation(item.cfi, true)">
        </div>
      </Scroll>
    </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Scroll from '../common/Scroll'
  import { px2rem } from '../../utils/utils'

  export default {
    name: 'EbookSlideContent',
    mixins: [ebookMixin],
    components: {
      Scroll
    },
    data() {
      return {
        searchVisible: false,
        // 表示搜索结果
        searchList: null,
        // 表示搜索文本，将搜索文本与input进行绑定v-model
        searchText: ''
      }
    },
    methods: {
      displaySearchAndNavigation(target, highlight = false) {
        this.display(target, () => {
          this.hideTitleAndMenu()
          if (highlight) {
            // annotations专门用来管理高亮的元素
            this.currentBook.rendition.annotations.highlight(target)
          }
        })
      },
      search() {
        if (this.searchText && this.searchText.length > 0) {
          this.doSearch(this.searchText).then(list => {
            this.searchList = list
            this.searchList.map(item => {
              item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
              return item
            })
          })
        }
      },
      doSearch(q) {
        return Promise.all(
        this.currentBook.spine.spineItems.map(
          section => section.load(this.currentBook.load.bind(this.currentBook))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section)))
        //  二维数组和空数组连接的方法进行降维，apply方法是将其作为一个一个的形参来传入，将数组中的对象逐一的传入到concat中
        //  将二维数组降成一维数组得到我们的搜索结果
        ).then(results => Promise.resolve([].concat.apply([], results)))
      },
      showSearchPage() {
        this.searchVisible = true
      },
      hideSearchPage() {
        this.searchVisible = false
        this.searchList = null
        this.searchText = ''
      },
      contentItemStyle(item) {
        return {
          marginLeft: `${px2rem(item.level * 15)}rem`
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet" scoped>
  @import "../../assets/styles/global";
  .ebook-slide-contents{
    width: 100%;
    font-size: 0;
    .slide-contents-search-wrapper{
      display: flex;
      width: 100%;
      height: px2rem(36);
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-search-input-wrapper{
        flex: 1;
        @include center;
        .slide-contents-search-icon{
          flex: 0 0 px2rem(28);
          font-size: px2rem(12);
          @include center;
        }
        .slide-contents-search-input{
          flex: 1;
          width: 100%;
          height: px2rem(32);
          font-size: px2rem(14);
          background: transparent;
          border: none;
          &:focus {
            outline: none;
          }
        }
      }
      .slide-contents-search-cancel{
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right;
      }
    }
    .slide-contents-book-wrapper{
      display: flex;
      width: 100%;
      height: px2rem(90);
      padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
      box-sizing: border-box;
      .slide-contents-book-img-wrapper{
        flex: 0 0 px2rem(45);
        .slide-contents-book-img{
          width: px2rem(45);
          height: px2rem(60);
        }
      }
      .slide-contents-book-info-wrapper{
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        .slide-contents-book-title{
          width: px2rem(153.75);
          font-size: px2rem(14);
          line-height: px2rem(16);
          @include ellipsis2(2)
        }
        .slide-contents-book-author{
          // 375*0.85=318.5-30=288.75-20=268.75-45=223.75-70=153.75
          // 指定宽度 ellipsis缩略才生效
          width: px2rem(153.75);
          font-size: px2rem(12);
          margin-top: px2rem(10);
          @include ellipsis
        }
      }
      .slide-contents-book-progress-wrapper{
        flex: 0 0 px2rem(70);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .slide-contents-book-progress{
          .progress{
            font-size: px2rem(14);
          }
          .progress-text{
            font-size: px2rem(12);
          }
        }
        .slide-contents-book-time{
          font-size: px2rem(12);
          margin-top: px2rem(5);
        }
      }
    }
    .slide-contents-list{
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-item{
        display: flex;
        padding: px2rem(20) 0;
        box-sizing: border-box;
        .slide-contents-item-label{
          /*使用flex布局后会自动计算宽度，ellipsis生效*/
          flex: 1;
          font-size: px2rem(14);
          line-height: px2rem(16);
          @include ellipsis
        }
        .slide-contents-item-page{}
      }
    }
    .slide-search-list{
      width: 100%;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-search-item{
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
    }
  }

</style>
