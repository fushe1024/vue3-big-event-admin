<script setup>
import { ref } from 'vue';
import { artGetChannelsService } from '@/api/article'
const model = defineModel()

// 文章分类
const channelList = ref([])

// 获取文章分类列表
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()

</script>

<template>
  <el-select v-model="model">
    <el-option v-for="item in channelList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
  </el-select>
</template>

<style scoped></style>
