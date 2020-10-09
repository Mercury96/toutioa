
<template>
  <div class="update-name">
    <van-nav-bar
      title="昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('cancel')"
      @click-right="confirm"
    >
    </van-nav-bar>
    <div class="intro-field-wrap">
      <van-field
        v-model="inputName"
        rows="2"
        autosize
        type="textarea"
        maxlength="11"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      inputName: this.name
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async confirm () {
      try {
        // 请求更新
        await updateUserProfile({ name: this.inputName })
        // 更新视图
        this.$emit('updateName', this.inputName)
        // 关闭弹层
        this.$emit('cancel')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('昵称必须在1-7个字符之间')
        } else if (err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
