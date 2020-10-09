<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
       <span @click="$emit('updatehistories',[])">全部删除</span>
       &nbsp;&nbsp;
      <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true" />
    </van-cell>
    <van-cell :title="item" v-for="(item,index) in searchHistories" :key="index"  @click="onHistoryClick(item, index)" >
      <van-icon name="close" v-show="isDeleteShow"  />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onHistoryClick (item, index) {
      // 如果是删除
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        // 如果是搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
