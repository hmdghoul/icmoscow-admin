<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div class="absolute inset-0 bg-black/50" @click="emit('cancel')" />
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="mt-2 text-sm text-gray-600">{{ message }}</p>
        <div class="mt-6 flex gap-3 justify-end">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors',
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700',
            ]"
            @click="emit('confirm')"
          >
            {{ confirmLabel ?? 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
