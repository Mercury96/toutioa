<template>
  <div class="search-suggestion">
    <van-cell  icon="search" v-for="(item,index) in suggestions" :key="index" @click="search(item)">
        <div slot="title" v-html="highlight(item, searchText)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search.js'
// lodash 支持按需加载，有利于打包结果优化
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据

    }
  },
  computed: {},
  watch: {
    searchText: {
      handler: debounce(async function () {
        const { data } = await getSuggestions(this.searchText)
        this.suggestions = data.data.options
        console.log(data)
      }, 1000),
      immediate: true
      // 该回调将会在侦听开始之后立即调用
    }

  },
  created () {},
  mounted () {},
  methods: {
    // 参数 source: 原始字符串
    // 参数 keyword: 需要高亮的关键词
    // 返回值：替换之后的高亮字符串
    highlight (source, keyword) {
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      const reg = new RegExp(keyword, 'gi')
      return source.replace(reg, `<span style="color: #3296fa">${keyword}</span>`)
    },
    search (item) {
      this.$emit('search', item)
    }
  }
}
</script>

<style scoped lang="less"></style>
