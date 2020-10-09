<template>
  <div class="chat-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <div class="message-list" ref="message-list">
      <div
        class="message-item"
        v-for="(item, index) in messages"
        :key="index"
      >
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="item.photo"
        />
        <div class="msg-wrap" style="flex: 1;">
          <div class="title">{{ item.msg }}</div>
        </div>
      </div>
    </div>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message">
      <van-field
        v-model="message"
        center
        clearable
      >
        <van-button
          slot="button"
          size="small"
          type="primary"
          @click="onSendMessage"
        >发送</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'ChatPage',
  data () {
    return {
      message: '',
      socket: null,
      messages: getItem('chat-messages') || [] // 存储所有的消息列表
    }
  },

  computed: {},

  watch: {
    messages (newValue) {
      setItem('chat-messages', newValue)
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },

  created () {
    // 建立连接
    const socket = io('http://ttapi.research.itcast.cn')
    this.socket = socket
    // 当客户端与服务器建立连接成功，触发 connect 事件
    socket.on('connect', () => {
      console.log('建立连接成功！')
    })
    // 监听接收服务端消息
    socket.on('message', data => {
      this.messages.push(data)
      console.log('收到服务器消息：', data)
    })
  },

  mounted () {
    this.scrollToBottom()
  },

  methods: {
    onSendMessage () {
      const message = this.message.trim()
      if (!message) {
        return
      }

      // 发送消息
      this.socket.emit('message', {
        msg: message,
        timestamp: Date.now()
      })

      // 把消息存储到数组中
      this.messages.push({
        message,
        isMe: true,
        photo: 'https://img.yzcdn.cn/vant/cat.jpeg'
      })

      // 清空文本框
      this.message = ''
    },
    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>

<style scoped lang="less">
.chat-container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 46px 0 50px 0;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background: #f5f5f6;
  .message-list {
    height: 100%;
    overflow-y: scroll;
    .message-item {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      padding: 10px;
      .msg-wrap {
        word-break: break-all;
        word-wrap: break-word;
      }
      .title {
        display: table;
        background: #e0effb;
        border-radius: 6px;
        font-size: 14px;
        padding: 10px 10px;
        margin-right: 45px;
      }
      .avatar {
        width: 40px;
        height: 40px;
        margin-right: 5px;
      }
    }
    .reverse {
      flex-direction: row-reverse;
      .msg-wrap {
        display: flex;
        flex-direction: row-reverse;
        .title {
          margin-right: 5px;
          margin-left: 45px;
        }
      }
    }
  }

  .send-message {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f6 !important;
  }
}
</style>
