// 定义一个对象,包含一个state
const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisible: false,
    // 书架里面 标题和搜索框用到的vuex的变量是四个
    isEditMode: false, // 是否进入编辑模式
    shelfList: [], // 书架当中图书列表
    shelfSelected: [], // 书架图书当前选中的列表,这样各组件之间都知道当前的选中状态
    shelfTitleVisible: true, // 表示书架标题的显示状态
    shelfCategory: [], // 书架分类列表数据
    currentType: 1 // 书架列表为1，书架的分类列表为2
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY(state, offsetY) {
      state.hotSearchOffsetY = offsetY
    },
    SET_FLAP_CARD_VISIBLE(state, visible) {
      state.flapCardVisible = visible
    },
    SET_IS_EDIT_MODE(state, isEditMode) {
      state.isEditMode = isEditMode
    },
    SET_SHELF_LIST(state, list) {
      state.shelfList = list
    },
    SET_SHELF_SELECTED(state, selected) {
      state.shelfSelected = selected
    },
    SET_SHELF_TITLE_VISIBLE(state, visible) {
      state.shelfTitleVisible = visible
    },
    SET_SHELF_CATEGORY(state, category) {
      state.shelfCategory = category
    },
    SET_CURRENT_TYPE(state, type) {
      state.currentType = type
    }
  }
}

export default store
