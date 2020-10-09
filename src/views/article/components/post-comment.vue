<template>
  <div class="post-comment">
    <van-field
      class="post-field"
      v-model="inputComment"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
    />
    <van-button
      type="primary"
      size="small"
      @click="onAddComment"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'PostComment',
  components: {},
  props: {
    articleId: {
      type: [Object, Number, String],
      default: null
    },
    target: {
      type: [Object, Number, String],
      required: true
    }
  },
  data () {
    return {
      message: '',
      inputComment: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onAddComment () {
      const inputComment = this.inputComment.trim()

      // 非空校验
      if (!inputComment.length) {
        return
      }

      // 请求添加
      const res = await addComment({
        target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: inputComment, // 评论内容
        // art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数
        art_id: this.articleId ? this.articleId.toString() : null
      })
      // 将发布的最新评论展示到列表顶部
      this.$emit('postSuccess', res.data.data.new_obj)
      // 清空文本框
      this.inputComment = ''
    }
  }
}
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  padding: 15px;
  align-items: flex-end;
  .post-field {
    background: #f5f7f9;
    margin-right: 15px;
  }
}
</style>
