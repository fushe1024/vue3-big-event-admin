<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { artGetListService, artDelArticleService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { ref,watch } from 'vue'

// 文章列表
const manageList = ref([])
const total = ref(0)
const isLoading = ref(false)

// 请求参数
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

// 获取文章列表
const getManageList = async () => {
  isLoading.value = true
  const res = await artGetListService(params.value)
  manageList.value = res.data.data
  total.value = res.data.total
  isLoading.value = false
}
getManageList()
// 查询逻辑
const onSearch = () => {
  // 重置页码
  params.value.pagenum = 1
  // 重新渲染数据
  getManageList()
}
// 重置逻辑
const onReset = () => {
  // 重置查询条件
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''

  // 重新获取数据
  getManageList()
}

// 分页器逻辑
watch(() => params.value.pagenum, () => getManageList())
watch(() => params.value.pagesize, () => {
  params.value.pagenum = 1
  // 重新获取数据
  getManageList()
})


// 编辑文章逻辑
const editDrawer = ref(null)

// 发布文章
const onAddManage = () => {
  editDrawer.value.openDrawer({})
}
// 编辑文章
const onEditManage = (row) => {
  editDrawer.value.openDrawer(row)
}
// 删除文章
const onDelManage = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelArticleService(row.id)
  ElMessage.success('删除成功')
  getManageList()
}

const onSuccess = (type) => {
  if(type === 'add') {
    // 添加成功后重新获取数据
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    if (lastPage !== params.value.pagenum) {
      params.value.pagenum = lastPage
    }
  }
  // 发布成功后重新获取数据
  getManageList()
}
</script>

<template>
  <MyCard title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddManage">发布文章</el-button>
    </template>
    <!-- form 部分 -->
    <el-form inline>
      <el-form-item label="文章分类：" style="width: 300px;">
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：" style="width: 300px;">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- table 部分 -->
    <el-table v-loading="isLoading" :data="manageList" style="width: 100%;">
      <el-table-column prop="title" label="文章标题" />
      <el-table-column prop="cate_name" label="文章分类" />
      <el-table-column label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="发布状态" />
      <el-table-column label="操作" width="150" align="center">
        <!-- table-column 自定义插槽 -->
        <template #default="{ row }">
          <el-button circle plain type="primary" :icon="Edit" @click="onEditManage(row)"></el-button>
          <el-button circle plain type="danger" :icon="Delete" @click="onDelManage(row)"></el-button>
        </template>
      </el-table-column>
      <!-- table 空数据插槽 -->
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 分页器部分 -->
    <div class="my-pagination">
      <el-pagination :page-sizes="[2, 3, 5, 10]" v-model:current-page="params.pagenum"
        v-model:page-size="params.pagesize" :background="true" layout="jumper, total, sizes, prev, pager, next"
        :total="total" />
    </div>

    <!-- 编辑文章抽屉 -->
    <article-edit ref="editDrawer" @success="onSuccess"></article-edit>
  </MyCard>
</template>

<style scoped lang="scss">
.my-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: end;
}
</style>
