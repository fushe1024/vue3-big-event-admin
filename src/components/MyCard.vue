<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <el-card class="my-card">
    <!-- 头部 -->
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 身体 -->
    <slot name="default"></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.my-card {
  min-height: 100%;
  box-sizing: border-box;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
