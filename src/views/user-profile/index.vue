<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
       @click-left="$router.replace('/my')"
    />
    <!-- /导航栏 -->
    <input type="file" hidden ref="file" accept="image/*" @change="fileChange">
    <!-- 个人信息 -->
    <van-cell class="avatar-cell" title="头像" is-link center @click="$refs.file.click()">
      <van-image
        class="avatar"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isEditNameShow=true" />
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link   @click="isEditGenerShow = true" />
    <van-cell title="生日" :value="user.birthday" is-link  @click="isEditBirthdayShow = true"/>
    <!-- /个人信息 -->
    <!-- 修改昵称 -->
      <van-popup v-model="isEditNameShow" position="bottom" :style="{ height: '100%' }">
      <update-name @cancel="isEditNameShow=false"
      :name="user.name"
      @updateName="user.name=$event"
      v-if="isEditNameShow"/>
    </van-popup>
     <!-- 修改昵称 -->
      <!-- 修改昵称 -->
      <van-popup v-model="isEditGenerShow" position="bottom" :style="{ height: '100%' }">
      <update-name @cancel="isEditNameShow=false"
      :name="user.name"
      @updateName="user.name=$event"
      v-if="isEditNameShow"/>
    </van-popup>
     <!-- 修改昵称 -->
     <!-- 修改性别 -->
      <van-popup v-model="isEditGenerShow" position="bottom" :style="{ height: '30%' }">
      <update-gender @close="isEditGenerShow = false"
      v-model="user.gender" v-if="isEditGenerShow"/>
    </van-popup>
     <!-- 修改性别 -->
     <!-- 修改生日 -->
     <van-popup v-model="isEditBirthdayShow" position="bottom" >
      <update-birth @close="isEditBirthdayShow = false"
      v-model="user.birthday" v-if="isEditBirthdayShow"/>
    </van-popup>
     <!-- 修改生日 -->
    <!-- 修改头像 -->
    <van-popup v-model="isEditPhotoShow" position="bottom" :style="{ height: '100%' }" class="photoUpdate">
      <update-avatar @close="isEditPhotoShow= false" :previewImages="previewImgs" @updatePhoto="updatePhoto"
      v-if="isEditPhotoShow"/>
    </van-popup>
    <!-- 修改头像 -->
  </div>
</template>

<script>

import { getProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirth from './components/update-birthday'
import UpdateAvatar from './components/update-avatar'
export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateGender, UpdateBirth, UpdateAvatar },
  props: {},
  data () {
    return {
      user: {},
      isEditNameShow: false,
      isEditGenerShow: false,
      isEditBirthdayShow: false,
      isEditPhotoShow: false,
      previewImgs: []

    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      const { data } = await getProfile()
      this.user = data.data
      // this.currentDate = new Date(this.user.birthday)
    },
    fileChange () {
      this.isEditPhotoShow = true
      const fileObj = this.$refs.file.files[0]
      this.previewImgs = fileObj
      // 选择相同的文件不触发change 需要触发清空
      this.$refs.file.value = ''
    },
    updatePhoto (e) {
      this.user.photo = e
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
}
.photoUpdate{
  background-color: #000;
}
</style>
