<template>
  <van-popup :value="value" @input="$emit('input', $event)" style="height: 30%;" position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      confirm-button-text="完成"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </van-popup>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      minDate: new Date(1970, 1, 1),
      currentDate: new Date(2020, 10, 8)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async  onConfirm () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })
      const data = dayjs(this.currentDate).format('YYYY-MM-DD')
      await updateUserProfile({ birthday: data })
      this.$emit('input', data)
      this.$emit('close')
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang="less"></style>
