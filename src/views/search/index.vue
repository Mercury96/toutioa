<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @clear="onClear"
      />
    </form>
    <div style="height:54px"></div>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch" />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history v-else :searchHistories="searchHistories" @search="onSearch" @updatehistories="searchHistories=$event" />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getSearchHistory } from '@/api/search.js'
import { mapState } from 'vuex'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('search-historys') || []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    searchHistories (val) {
    // 同步到本地存储
      setItem('serach-histories', val)
    }
  },
  created () {
    this.loadSearchHistories()
  },
  mounted () {},
  methods: {
    onClear () {
      this.isResultShow = false
    },
    onSearch (val) {
      this.searchText = val

      // 记录历史记录
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      this.isResultShow = true
      // 用户登录 记录到线上
      // 未登录 存储到本地
      // setItem('search-history', this.searchHistories)
    },
    onCancel () {
      this.$router.back()
    },
    async loadSearchHistories () {
      // const localHistory = getItem('search-history') || []
      // if (this.user) {
      //   const { data } = await getSearchHistory()
      //   console.log(data)
      //   this.searchHistories = [...new Set([...data.data.keywords, ...localHistory])]
      // }
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  .van-search__action {
    color: #fff;
  }
  .van-search{
    position: fixed;
    width: 100%;
    height: 54px;
    top: 0;
    z-index: 999;
    margin-bottom: 54px;
  }
}
</style>
