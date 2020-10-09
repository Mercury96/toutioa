/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store/'
import jsonBig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router'
const refreshToken = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return jsonBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]
})
// Add a request interceptor 请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state
  // 如果用户已经登录
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完返回config 否则或停在这里
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, async function (error) {
  // 处理失败请求
  const status = error.response.status
  const { user } = store.state
  if (status === 400) {
    // 客户端参数错误
    Toast.fail('请求参数异常')
  } else if (status === 401) {
    // token无效
    if (!user || !user.token) {
      return
    }
    // 重新请求说去token
    try {
      const { data } = await refreshToken({
        url: '/app/v1_0/authorizations',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 获取成功更新
      user.token = data.token
      store.commit('setUser', user)
      // error.config本次请求的相关配置对象
      return request(error.config)
    } catch (err) {
      redirectLogin()
    }
  } else if (status === 403) {
    // 没有权限
    Toast.fail('请求无权限')
  } else if (status >= 500) {
    // 服务端异常
    Toast.fail('服务器异常')
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})
function redirectLogin () {
  // router.currentRoute 当前路由对象，和你在组件中访问的 this.$route 是同一个东西
  // query 参数的数据格式就是：?key=value&key=value
  router.replace('/login?redirect=' + router.currentRoute.fullPath)
}
export default request
