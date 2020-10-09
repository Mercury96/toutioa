<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="文章详情"
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <!-- <div class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div> -->
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name" @click="$router.push('/user/'+article.aut_id)">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate|relativeTime}}</div>
          <van-button
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            :loading="isFollowLoading"
            size="small"
            @click="onFollow"
          >{{article.is_followed?"已关注":"关注"}}</van-button>
          <!-- <van-button
            class="follow-btn"
            round
            size="small"
          >已关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <!-- <div class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div> -->
      <!-- /加载失败：404 -->
      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <!-- <div class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div> -->
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
       <!-- 文章评论 -->
    <article-comment :articleId="articleId" :list="commentList" @click-reply="onReplyClick" @updataCount="totalCommentCount=$event" />
    <!-- /文章评论 -->
    </div>
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow=true"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        :info="totalCommentCount"
        color="#777"
      />
      <van-icon
        :color="article.is_collected?'red': '#777'"
        :name="article.is_collected?'star':'star-o'"
        @click="onCollect"
      />
      <van-icon
        :color="article.attitude==1?'red': '#777'"
        :name="article.attitude==1?'good-job':'good-job-o'"
        @click="onLike"
      />
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <post-commment @postSuccess="onPostSuccess" :target="articleId"/>
    </van-popup>
    <!-- /发布评论 -->
            <!-- 评论回复 -->
      <van-popup
        v-model="isReplyShow"
        position="bottom"
        style="height: 95%"
      >
          <comment-reply
    @click-close="isReplyShow = false"
    :comment="currentComment"
    :articleId="articleId"
    v-if="isReplyShow"
  />
      </van-popup>
<!-- /评论回复 -->
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById, addCollect, deleteCollect, addLike, deleteLike } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
import ArticleComment from './components/article-comment'
import postCommment from './components/post-comment'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: { ArticleComment, postCommment, CommentReply },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      article: {},
      isFollowLoading: false,
      isPostShow: false,
      commentList: [],
      isReplyShow: false,
      totalCommentCount: 0,
      currentComment: {} // 点击回复的那个评论对象
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      try {
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        // 1、从文章内容中获取到所有的 img DOM 节点

        // 2、获取文章内容中所有的图片地址
        this.$nextTick(() => {
          this.handleImagePreview()
        })
        // 3、遍历所有 img 节点，给每个节点注册点击事件
        // 4、在 img 点击事件处理函数中，调用 ImagePreview 预览
      } catch (err) {
        console.log(err)
      }
    },
    // 处理图片预览
    handleImagePreview () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    // 关注
    async onFollow () {
      // 开启按钮的 loading 状态
      this.isFollowLoading = true
      // 如果已关注，则取消关注
      const authorId = this.article.aut_id
      if (this.article.is_followed) {
        await deleteFollow(authorId)
      } else {
      // 否则添加关注
        await addFollow(authorId)
      }
      this.article.is_followed = !this.article.is_followed
      // 关闭按钮的 loading 状态
      this.isFollowLoading = false
    },
    // 收藏
    async onCollect () {
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })

      try {
        // 如果已收藏，则取消收藏
        if (this.article.is_collected) {
          await deleteCollect(this.articleId)
          // this.article.is_collected = false
          this.$toast.success('取消收藏')
        } else {
          // 添加收藏
          await addCollect(this.articleId)
          // this.article.is_collected = true
          this.$toast.success('收藏成功')
        }
        this.article.is_collected = !this.article.is_collected
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    // 点赞
    async onLike () {
      // 两个作用：1、交互提示 2、防止网络慢用户连续不断的点击按钮请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })

      try {
        // 如果已经点赞，则取消点赞
        if (this.article.attitude === 1) {
          await deleteLike(this.articleId)
          this.article.attitude = -1
          this.$toast.success('取消点赞')
        } else {
          // 否则添加点赞
          await addLike(this.articleId)
          this.article.attitude = 1
          this.$toast.success('点赞成功')
        }
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    onPostSuccess (data) {
      this.commentList.unshift(data)
      this.isPostShow = false
    },
    // 评论回复
    onReplyClick (data) {
      // 将子组件中传给我评论对象存储到当前组件
      this.currentComment = data

      this.isReplyShow = true
      console.log(data)
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 45px;
    bottom: 44px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 20px;
      padding: 25px 16px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 8px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 12px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 11px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 85px;
        height: 28px;
      }
    }

    .article-content {
      padding: 27px 16px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 100px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 100px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 60px;
      color: #b4b4b4;
    }
    .text {
      font-size: 12px;
      color: #666666;
      margin: 16px 0 23px;
    }
    .retry-btn {
      width: 280px;
      height: 35px;
      line-height: 35px;
      border: 1px solid #c3c3c3;
      font-size: 12px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 11px;
        background-color: #e22829;
      }
    }
  }
}
</style>
