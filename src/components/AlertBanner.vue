<script setup lang="ts">
defineProps<{
  message: string
  type?: 'error' | 'success'
}>()
</script>

<template>
  <div
    :class="[
      'flex items-start gap-3 px-4 py-3 rounded-lg text-sm',
      type === 'success'
        ? 'bg-green-50 text-green-800 border border-green-200'
        : 'bg-red-50 text-red-800 border border-red-200',
    ]"
  >
    <i
      :class="[
        'text-lg mt-0.5 shrink-0',
        type === 'success' ? 'ri-check-circle-line text-green-600' : 'ri-error-warning-line text-red-600',
      ]"
    />
    <span>{{ message }}</span>
  </div>
</template>
