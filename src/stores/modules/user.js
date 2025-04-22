import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'

// 用户模块
export const useUserStore = defineStore('user',() => {
  const token = ref('') // 定义 token
  const removeToken = () => (token.value = '') // 清除 token
  const setToken = (t) => (token.value = t) // 设置 token

  const userInfo = ref({})
  const removeUserInfo = () => (userInfo.value = {}) // 清除用户信息

  // 获取用户信息
  const getUser = async () => {
    const res = await userGetInfoService() // 请求获取数据
    userInfo.value = res.data.data
  }
  return { token, setToken,removeToken, userInfo, getUser,removeUserInfo }
},{
  persist: true
})
