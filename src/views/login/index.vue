<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 登录表单 -->
  <van-form @submit="onLogin"  @failed="onFailed"  :show-error="false"
  :show-error-message="false"  ref="login-form">
    <van-cell-group>
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        name="mobile"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '请输入手机号' }]"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
         name="code"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <template #button>
          <van-count-down v-if="isCountDownShow" :time="1000*6" format="ss s" @finish="isCountDownShow=false"/>
          <van-button
            v-else
            class="send-btn"
            size="mini"
            round
            @click.prevent="onSendSms"
            :loading="isSendSmsLoading"
          >发送验证码</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <div class="login-btn-wrap">
      <van-button class="login-btn" type="info" block >登录</van-button>
    </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '18328686205', // 手机号'13911111111'
        code: '246810' // 验证码'246810'
      },
      isCountDownShow: false,
      isSendSmsLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 表单验证成功登录
    async onLogin () {
      // 开始转圈圈
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '登录中...' // 提示消息
      })

      try {
        const { data } = await login(this.user)
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$toast.success('登录成功')
        // 将后端返回的用户登录状态（token等数据）放到 Vuex 容器中
        this.$store.commit('setUser', data.data)
        this.$store.commit('removeCachePage', 'LayoutIndex')
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        console.log('登录失败', err)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    // 表单验证失败
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message, // 提示消息
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
      }
    },
    // 获取验证码
    async onSendSms () {
      try {
        // 校验手机号码
        await this.$refs['login-form'].validate('mobile')
        // 验证通过 -> 请求发送验证码 -> 用户接收短信 -> 输入验证码 -> 请求登录
        // 请求发送验证码 -> 隐藏发送按钮，显示倒计时
        // 倒计时结束 -> 隐藏倒计时，显示发送按钮
        this.isSendSmsLoading = true // 展示按钮的 loading 状态，防止网络慢用户多次点击触发发送行为
        this.isSendSmsLoading = true
        await sendSms(this.user.mobile)
      } catch (err) {
        // try 里面任何代码的错误都会进入 catch
        // 不同的错误需要有不同的提示，那就需要判断了
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }

        // 提示用户
        this.$toast({
          message,
          position: 'top'
        })
      }
      this.isSendSmsLoading = true // 展示按钮的 loading 状态，防止网络慢用户多次点击触发发送行为
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
