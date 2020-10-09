<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false"  class="channel-title">
      <van-button
        size="mini"
        round
        type="danger"
        plain
        @click="isEditShow=!isEditShow"
      >{{isEditShow?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        :class="{active:index===active}"
        v-for="(channel,index) in userChannels"
        :key="index"
        text="文字"
        :icon="isEditShow && index!==0?'clear':''"
        @click="onUserChannelClick(channel,index)"
      >
      <div slot="text" class="text-wrap">
        <span>{{channel.name}}</span>
      </div>
      </van-grid-item>
    </van-grid>
    <van-cell title="频道推荐" :border="false" class="channel-title"></van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(channel,index) in recommendChannels"
        :key="index"
        text="文字"
          @click="onAddChannel(channel)"
      >
      <div slot="text" class="text-wrap">
        <span>{{channel.name}}</span>
      </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所i有頻道數據
      isEditShow: false
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐频道
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // 添加频道
    async onAddChannel (channel) {
      this.userChannels.push(channel)
      // 如果已登录，则存储到线上
      if (this.user) {
        await addUserChannel([{
          id: channel.id, // 频道 id
          seq: this.userChannels.length // 频道的 序号
        }])
      } else {
      // 如果未登录，则存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    // 删除频道
    onUserChannelClick (channel, index) {
      if (this.isEditShow && index !== 0) {
        this.deleteChannel(channel, index)
      } else {
        this.active = index
        this.switchChannel(index)
      }
    },
    async deleteChannel (channel, index) {
      // 如果傻逼持股的是当前激活频道之前的频道
      if (index <= this.active) {
        this.$emit('updata-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)
      // 如果未登录，则存储到本地
      // 如果已登录，则存储到线上
      if (this.user) {
        await deleteUserChannel(channel.id)
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel (index) {
      this.$emit('close')
      this.$emit('updata-active', index)
    }

  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 54PX;
  .channel-title{
    font-size: 16px;
    color: #333;
  }
  .channel-item {
    height: 43px;
    width: 80px;
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text {
        color: #222;
        font-size: 14px;
        margin-top: 0;
      }
    }
    .text-wrap{
        color: #222;
        font-size: 14px;
    }
  }
}
/deep/.van-icon-clear{
  position: absolute;
  right: -5px;
  top: -5px;
  font-size: 16px;
  color: #ccc;
}
.active{
  .text-wrap{
        color: red !important;
    }
}
</style>
