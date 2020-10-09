/*
  搜索请求模块
*/
import request from '@/utils/request'
export const getSuggestions = (data) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q: data
    }
  })
}
/**
 * 获取搜索结果
 */
export function getSearchResult (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
/**
 * 获取搜索历史结果
 */
export const getSearchHistory = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories'
  })
}
