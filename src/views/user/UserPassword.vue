<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

// 表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 表单引用
const formRef = ref(null)

// 自定义校验规则：新旧密码不能相同
const validateNewPassword = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

// 自定义校验规则：确认密码必须一致
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入的新密码不一致'))
  } else {
    callback()
  }
}

// 校验规则
const rules = {
  old_pwd: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '长度需在6-15位之间', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '长度需在6-15位之间', trigger: 'blur' },
    { validator: validateNewPassword, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '长度需在6-15位之间', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const router = useRouter()
// 提交表单
const submitForm = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  userStore.removeToken()
  userStore.removeUserInfo()
  ElMessage.success('密码修改成功,请您重新登录！')
  // 去登录页
  router.replace('/login')
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <MyCard title="重置密码">
    <el-form
      ref="formRef"
      :model="pwdForm"
      :rules="rules"
      label-width="100px"
      style="max-width: 600px"
    >
      <!-- 原密码 -->
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          v-model="pwdForm.old_pwd"
          type="password"
          show-password
          placeholder="请输入原密码"
        />
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="pwdForm.new_pwd"
          type="password"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input
          v-model="pwdForm.re_pwd"
          type="password"
          show-password
          placeholder="请再次输入新密码"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </MyCard>
</template>
