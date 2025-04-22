<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { userUpdateAvatarService } from '@/api/user'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
// userStore.getUser()

// 本地预览地址
const imgUrl = ref(userStore.userInfo.user_pic || '')
const isDisabled = ref(true)

// 触发文件上传
const onUploadFile = file => {
  // 打开上传按钮
  isDisabled.value = false
  // 将文件转换为 Base 64 格式
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = e => {
    imgUrl.value = e.target.result
  }
}

// 点击 => 选择图片按钮
const uploadRef = ref(null)
const onUploadBtn = () => {
  uploadRef.value.$el.querySelector('input').click()
}

// 点击 => 上传头像按钮
const onUploadImg = async () => {
  await userUpdateAvatarService(imgUrl.value)
  await userStore.getUser()
  ElMessage.success('头像更换成功')
}


</script>

<template>
  <MyCard title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload ref="uploadRef" class="avatar-uploader" :auto-upload="false" :show-file-list="false"
          :on-change="onUploadFile">
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <el-button @click="onUploadBtn" type="primary" :icon="Plus" size="large">
          选择图片
        </el-button>
        <el-button @click="onUploadImg" type="success" :icon="Upload" size="large" :disabled="isDisabled">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </MyCard>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
