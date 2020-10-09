<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- <van-cell v-for="item in list" :key="item.com_id.toString()">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
         <span style="color: #466b9d;" slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636;">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px;">{{
              item.pubdate | relativeTime
            }}</span>
            <van-button size="mini" type="default">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell> -->
      <comment-item v-for="(item,index) in list" :key="index" :comment="item" @click-reply="$emit('click-reply',$event)" />
    </van-list>
    <!-- 评论列表 -->
    <!-- 评论列表 -->

  </div>
</template>

<script>
import { getComments } from '@/api/comment.js'
import CommentItem from './commentItem'

export default {
  name: 'ArticleComment',
  props: {
    articleId: {
      type: [String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []// 引用类型必须函数返回
    }
  },
  components: { CommentItem },
  data () {
    return {
      // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束,
      offset: null, // 请求下一页数据的页码
      totalCount: 0, // 总数据条数
      limit: 10, // 每页大小
      isReplyShow: false

    }
  },
  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getComments({
        type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.articleId, // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 每页大小
      })
      // 2. 将数据添加到列表中
      const { results } = data.data
      this.$emit('updataCount', data.data.total_count)
      this.list.push(...results)
      // 更新总数据条数
      this.totalCount = data.data.total_count
      // 3. 将加载更多的 loading 设置为 false
      this.loading = false
      // 4. 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id // 更新获取下一页数据的页码
      } else {
        this.finished = true // 没有数据了，关闭加载更多
      }
    }

  }
}
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
