import request from '@/utils/request'

// 获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')

// 增加文章分类
export const artAddChannelService = (data) =>
  request.post('/my/cate/add', data)

// 编辑文章分类
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)

// 删除文章分类
export const artDelChannelService = (id) => request.delete('/my/cate/del', {
  params: { id }
})

// 获取文章列表
export const artGetListService = (params) =>
  request.get('/my/article/list', { params })

// 删除文章
export const artDelArticleService = (id) =>
  request.delete('/my/article/info', { params: { id } })

// 添加文章
export const artPublishService = (data) =>
  request.post('/my/article/add', data)

// 获取文章详情
export const artGetDetailService = (id) =>
  request.get('/my/article/info', { params: { id } })

// 更新文章
export const artUpdateService = (data) =>
  request.put('/my/article/info', data)
