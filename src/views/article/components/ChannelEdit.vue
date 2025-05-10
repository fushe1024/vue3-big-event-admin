<script setup>
import { ref, watch } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

// 表单数据
const formData = ref({
  cate_name: '',
  cate_alias: ''
})
const clearFormData = () => {
  formData.value = {
    cate_name: '',
    cate_alias: ''
  }
}

const formRef = ref(null)
// 表单规则
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

// 打开弹窗
const open = (value) => {
  dialogVisible.value = true
  formData.value = { ...value }
}

// // 关闭逻辑 => 关闭弹窗 = 清空表单 = 清空验证
const close = () => {
  dialogVisible.value = false
  // 清空表单数据
  clearFormData()
  // 清空表单验证
  formRef.value.clearValidate()
}

const emit = defineEmits(['success'])
// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate()
  if (formData.value.id) {
    await artEditChannelService(formData.value)
    ElMessage.success('修改成功')
  } else {
    await artAddChannelService(formData.value)
    ElMessage.success('添加成功')
  }
  // 通知父亲更新数据
  emit('success')
  close()
}

watch(dialogVisible, () => {
  if (!dialogVisible.value) {
    // 清空表单数据
    clearFormData()
    // 清空表单验证
    formRef.value.clearValidate()
  }
})

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formData.id ? '编辑分类' : '添加分类'" width="500">
    <!-- 表单 -->
    <el-form :model="formData" :rules="rules" ref="formRef" style="padding: 5px 20px">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formData.cate_name" />
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formData.cate_alias" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
