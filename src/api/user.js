/**
 * 用户相关的请求模块
 */
import request from '@/utils/request'
/**
 * 用户登录
 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
/**
 * 发送短信验证码
 */
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
/*
 * 获取用户自己的信息
 */
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}
/**
 * 获取用户频道列表
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
/**
 * 添加关注
 */
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
 * 取消关注
 */
export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
// 获取指定用户信息
export const getUserById = userId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/users/${userId}`
  })
}

/**
 * 获取用户个人资料
 */
export function getProfile (userId) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

/**
 * 更新用户照片资料
 */
export function updateUserPhoto (formData) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    // Content-Type multipart/form-data
    // 必须传递 FormData 对象
    data: formData
  })
}

/**
 * 更新用户照片资料
 */
export function updateUserProfile (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}

/**
 * 获取验证码
 */
export function sendSmsCode (mobile) {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 获取用户的关注列表
 */
export function getFollowingsByUser (userId, params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/followings',
    params,
    data: {
      target: userId.toString()
    }
  })
}

/**
 * 获取用户的粉丝列表
 */
export function getFollowersByUser (userId, params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/followers',
    params,
    data: {
      target: userId.toString()
    }
  })
}
