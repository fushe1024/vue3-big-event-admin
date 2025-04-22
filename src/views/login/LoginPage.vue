<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import {userRegisterService, userLoginService} from '@/api/user'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/index'
import {useRouter} from 'vue-router'
const userStore = useUserStore()
const router = useRouter()


// 是否注册
const isRegister = ref(false)
// 表单数据
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 清空表单
const clearFormData = () => {
    formModel.value = {
      username: '',
      password: '',
      repassword: ''
  }
}

// 表单引用
const form = ref(null)
// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 16 个字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 16 个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ]
}

// 注册逻辑
const register = async () => {
  await form.value.validate()
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}


// 登录逻辑
const login = () => {
  form.value.validate(async (valid) => {
    if (valid) {
      const { data } = await userLoginService(formModel.value)
      userStore.setToken(data.token)
      ElMessage.success('登录成功')
      router.replace('/')
      clearFormData()
    } else {
      ElMessage.error('登录失败')
    }
  })
}


// 切换登录注册 => 清空 表单数据
watch(isRegister,()=> {
  clearFormData()
})

</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册 -->
      <el-form ref="form" :rules="rules" :model="formModel" size="large" autocomplete="off" v-if="isRegister">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
          v-model="formModel.username"
          :prefix-icon="User"
          placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            show-password
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回登录
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录 -->
      <el-form ref="form" :rules="rules" :model="formModel" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            没有账户 点击注册
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
