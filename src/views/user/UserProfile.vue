<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

// 解构仓库数据
const {
  userInfo: { username, nickname, email, id }, getUser
} = useUserStore()

// 表单数据
const form = ref({ username, nickname, email, id })

// 表单引用
const formRef = ref(null)

// 校验规则
const rules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      message: '昵称长度需在2-10个字符之间',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('昵称不能仅为空格'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
}

// 提交处理
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await userUpdateInfoService(form.value)
      await getUser()
      ElMessage.success('修改成功！')
    } else {
      ElMessage.error('请正确填写表单')
      return false
    }
  })
}
</script>

<template>
  <MyCard title="基本资料">
    <el-form
    :model="form"
    :rules="rules"
    ref="formRef"
    label-width="100px"
    style="max-width: 600px"
  >
    <!-- 登录名称 -->
    <el-form-item label="登录名称" prop="username">
      <el-input v-model="form.username" disabled />
    </el-form-item>

    <!-- 用户昵称 -->
    <el-form-item label="用户昵称" prop="nickname">
      <el-input v-model="form.nickname" placeholder="请输入昵称" />
    </el-form-item>

    <!-- 用户邮箱 -->
    <el-form-item label="用户邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱" />
    </el-form-item>

    <!-- 提交按钮 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交修改</el-button>
    </el-form-item>
  </el-form>
  </MyCard>
</template>
