<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
  color?: string
}>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div class="flex items-center gap-3">
      <div
        v-if="icon"
        :class="['w-10 h-10 rounded-lg flex items-center justify-center text-xl', color ?? 'bg-green-100 text-green-700']"
      >
        <i :class="icon" />
      </div>
      <div>
        <p class="text-sm text-gray-500">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-800">{{ value }}</p>
      </div>
    </div>
  </div>
</template>
