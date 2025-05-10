<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])
const isLoading = ref(false)
const dialog = ref(null)

// 获取文章分类列表
const getChannelList = async () => {
  isLoading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  isLoading.value = false
}
getChannelList()

// 添加分类
const onAddChannel = () => {
  dialog.value.open({})
}

// 编辑分类
const onEditChannel = (row) => {
  dialog.value.open(row)
}

// 删除逻辑
const onDelChannel = async (row) => {
  // 提示框
  await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  // 调用接口删除服务器数据
  await artDelChannelService(row.id)
  // 删除成功提示
  ElMessage.success('删除成功')
  // 调用函数 => 回显数据
  getChannelList()
}
</script>

<template>
  <MyCard title="文章分类">
    <!-- MyCard 插槽 -->
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>

    <!-- table 部分 -->
    <el-table v-loading="isLoading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="150" align="center">
        <!-- table-column 自定义插槽 -->
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>

      <!-- table 空数据插槽 -->
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- diaLog 弹窗组件 -->
    <ChannelEdit ref="dialog" @success="getChannelList"></ChannelEdit>
  </MyCard>
</template>

<style scoped></style>
