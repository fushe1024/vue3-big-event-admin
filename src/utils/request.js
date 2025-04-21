import axios from 'axios'
// 导入仓库
import { useUserStore } from '@/stores'
// 导入组件包
import { ElMessage } from 'element-plus'
// 导入路由
import router from '@/router'
// 基地址
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  // 请求成功
  (config) => {
    // 使用仓库数据
    const useUser = useUserStore()
    // 判断仓库中的token是否存在
    if (useUser.token) {
      // 请求头携带token
      config.headers.Authorization = useUser.token
    }
    return config
  },
  // 请求失败
  (err) => Promise.reject(err)
)

// 相应拦截器
instance.interceptors.response.use(
  // 响应成功
  (res) => {
    // TODO 3. 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    // TODO 4. 处理业务失败
    ElMessage.error(res.data.message || '服务异常')
    // 抛出错误
    return Promise.reject(res.data)
  },
  // 响应错误
  (err) => {
    // TODO 5. 处理401错误
    if (err.response?.status === 401) {
      router.push('/login')
    }
    // 错误默认情况
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

// 导出
export default instance
export { baseURL }
