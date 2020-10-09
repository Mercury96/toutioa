<template>
  <div class="user-container">
    <!-- 导航栏 -->
    <van-nav-bar :title="user.name" left-arrow  @click-left="$router.back()" />
    <!-- /导航栏 -->

    <!-- 用户信息 -->
    <div class="user-info-container">
      <div class="row1">
        <van-image
          class="col1"
          fit="cover"
          round
          :src="user.photo"
        />
        <div class="col2">
          <div class="row1">
            <div class="item">
              <div class="count">{{user.art_count}}</div>
              <div class="text">发布</div>
            </div>
            <div class="item">
              <div class="count">{{user.follow_count}}</div>
              <div class="text">关注</div>
            </div>
            <div class="item">
              <div class="count">{{user.fans_count}}</div>
              <div class="text">粉丝</div>
            </div>
            <div class="item">
              <div class="count">{{user.like_count}}</div>
              <div class="text">获赞</div>
            </div>
          </div>
          <div class="action">
            <van-button
              type="primary"
              size="small"
            >私信</van-button>
            <van-button
              type="default"
              size="small"
            >编辑资料</van-button>
          </div>
        </div>
      </div>
      <div class="intro-wrap">
        <div>
          <span>认证：</span>
          <span>用户的认证信息</span>
        </div>
        <div>
          <span>简介：</span>
          <span>用户的简介信息</span>
        </div>
      </div>
    </div>
    <!-- /用户信息 -->

    <!-- 文章列表 -->
        <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      >
      <van-cell
        v-for="(item,index) in list"
        :key="index"
        :title="item"
      />
      </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getUserById } from '@/api/user'
import { getArticlesByUser } from '@/api/article'
export default {
  name: 'UserPage',
  components: {},
  props: {},
  data () {
    return {
      user: {}, // 用户信息
      list: [],
      loading: false, // 控制上拉加载更多的 loading
      finished: false, // 控制是否加载结束了
      page: 1 // 获取下一页数据的页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    async loadUser () {
      try {
        const { data } = await getUserById(this.$route.params.userId)
        this.user = data.data
      } catch (err) {
        console.log(err)
        this.$toast('获取用户数据失败')
      }
    },
    async onLoad () {
      // 异步更新数据
      const { data } = await getArticlesByUser(this.$route.params.userId, {
        page: this.page, // 可选的，默认是第 1 页
        per_page: 20 // 可选的，默认每页 10 条
      })
      console.log(data)
      // 2. 把数据添加到列表中
      // list []
      // data.data.results []
      // ...[1, 2, 3] 会把数组给展开，所谓的展开就是一个一个的拿出来
      const { results } = data.data
      this.list.push(...results)
      // 3. 加载状态结束
      this.loading = false

      // 4. 判断数据是否全部加载完毕
      if (results.length) {
        this.page++ // 更新获取下一页数据的页码
      } else {
        this.finished = true // 没有数据了，不需要加载更多了
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  font-size: 14px;
  .user-info-container {
    padding: 12px;
    background-color: #fff;
    margin-bottom: 10px;
    >.row1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .item {
        text-align: center;
        .text {
          font-size: 12px;
        }
      }
      >.col1 {
        width: 80px;
        height: 80px;
      }
      >.col2 {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 70%;
        height: 80px;
        padding: 0 12px;
        >.row1 {
          display: flex;
          justify-content: space-between;
        }
        .action {
          display: flex;
          justify-content: space-between;
          .van-button {
            width: 45%;
          }
        }
      }
    }
  }
}
</style>
