
<template>
  <div class="update-fender">
      <van-picker
        show-toolbar
        title="性别"
        :columns="columns"
        @cancel="$emit('close')"
        :default-index="defaultIndex"
        @confirm="onConfirm"
        @change="onPicker"
      />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value,
      index: this.value
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onPicker (p, v, index) {
      this.index = index
    },
    async onConfirm () {
      // 请求更新
      await updateUserProfile({ gender: this.index })
      // 更新视图
      this.$emit('input', this.index)
      // 关闭弹层
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less"></style>
