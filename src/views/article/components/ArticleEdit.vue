<script setup>
import { ref, nextTick } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService, artGetDetailService, artUpdateService } from '@/api/article'
import { baseURL } from '@/utils/request'
import { convertUrlToFile } from '@/utils/urlToFile'

// 控制抽屉显示隐藏
const drawerVisible = ref(false)

// 默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
// 表单绑定数据
const formModel = ref({ ...defaultForm })

// 图片本地预览
const imageUrl = ref('')
const handleAvatar = (file) => {
  imageUrl.value = URL.createObjectURL(file.raw)
  formModel.value.cover_img = file.raw
}

// 提交逻辑
const formRef = ref(null)
const emit = defineEmits(['success'])
const onSubmit = async (state) => {
  formModel.value.state = state // 添加发布状态

  // 准备 fomrdata 数据
  const fd = new FormData()
  for (const key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // 如果有 id 说明是编辑操作
  if (formModel.value.id) {
    await artUpdateService(fd)
    emit('success', 'edit')
    ElMessage.success('编辑成功')
    drawerVisible.value = false
  } else {
    await artPublishService(fd)
    ElMessage.success('添加成功')
    drawerVisible.value = false
    emit('success', 'add')
  }
}

// 富文本编辑器
const editorRef = ref(null)

// 打开抽屉逻辑
const openDrawer = async (row) => {
  drawerVisible.value = true
  // 有 id 调用接口 获取数据 回显
  if (row.id) {
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data

    // 拼接图片地址
    imageUrl.value = baseURL + res.data.data.cover_img

    // 将图片地址转换为file对象
    formModel.value.cover_img = await convertUrlToFile(imageUrl.value)
  } else {
    // 重置表单
    formModel.value = { ...defaultForm }
    imageUrl.value = '' // 重置img
    // 等待渲染完成清空编辑器
    nextTick(() => {
      editorRef.value.setHTML('') // 清空编辑器
    })
  }
}

defineExpose({
  openDrawer
})
</script>

<template>
  <el-drawer v-model="drawerVisible" title="发布文章" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="handleAvatar"
          :auto-upload="false"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit('已发布')" type="primary">发布</el-button>
        <el-button @click="onSubmit('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
