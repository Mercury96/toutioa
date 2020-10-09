<template>
  <div class="">
    <!-- 头像预览 -->
    <img :src="Image" alt="" ref="image" class="image">
      <van-nav-bar
      class="crop-bottom"
        slot="cover"
        left-text="取消"
        right-text="确定"
        @click-left="$emit('close')"
        @click-right="onUpdatePhoto"
      />
    <!-- 头像预览 -->

    <!-- 头像预览 -->
    <!-- <van-popup
      v-model="isPreviewPhotoShow"
      style="height: 100%; background-color: #000"
      position="bottom"
    >
      <img-cropper
        :src="previewImage"
        ref="img-cropper"
      />
      <div class="crop-bottom">
        <span @click="$emit('close')">取消</span>
        <span @click="onPhotoConfirm">完成</span>
      </div>
    </van-popup> -->
    <!-- /头像预览 -->
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: '',
  components: {},
  props: {
    previewImages: {
    }
  },
  data () {
    return {
      Image: URL.createObjectURL(this.previewImages),
      isPreviewPhotoShow: false,
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    async onUpdatePhoto () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      const { data } = await updateUserPhoto(fd)
      this.$emit('close')
      this.$toast.success('保存成功')
      this.$emit('updatePhoto', data.photo)
    }
  }
}
</script>

<style scoped lang="less">
.crop-bottom {
  position: fixed;
  bottom: 0;
  height: 44px;
  font-size: 16px;
  /* background: #000; */
   background-color: rgba(0, 0, 0, .6);
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}
/* Ensure the size of the image fit the container perfectly */
.img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
