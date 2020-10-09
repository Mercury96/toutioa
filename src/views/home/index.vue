<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 文章频道列表 -->
    <van-tabs v-model="active" class="channel-tabs">
      <van-tab class="tab-item"  :title="channel.name" v-for="(channel,index) in channels" :key="index">
        <!-- 文章列表组件 -->
        <article-list :channel="channel"/>
      </van-tab>
      <div slot="nav-right" :style="{}"  class="nav-placeholder"></div>
      <div slot="nav-right" class="wap-nav-wrap" @click="isChannelEditShow=true">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
 <!-- 文章频道列表 -->
    <van-popup v-model="isChannelEditShow"
      position="top" :style="{ height: '100%' }"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
    get-container="body">
        <channel-edit :user-channels="channels"  @close="isChannelEditShow=false" @updata-active="onUpdateActive" :active="active"/>
     </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user.js'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: { ArticleList, ChannelEdit },
  props: {},
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 未登录
        const localChannels = getItem('channels')
        if (localChannels) {
        // 有本地频道数据，则使用
          channels = localChannels
        } else {
        // 没有本地频道数据，则请求获取默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    },
    onUpdateActive (index) {
      this.active = index
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .channel-tabs{
    /deep/ .van-tab{
      border-bottom: 1px solid #edeff3;
      border-right: 1px solid#edeff3;
    }
    /deep/ .van-tabs__line{
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
      bottom: 20px;
    }
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .wap-nav-wrap{
    position: fixed;
    right: 0;
    height: 44px;
    line-height: 44px;
    background-color: #fff;
    opacity: 0.9;
  }
  .nav-placeholder{
    width:33px;
    flex-shrink:0
  }
}
</style>
