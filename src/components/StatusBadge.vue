<script setup lang="ts">
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../types'
import type { Project } from '../types'

defineProps<{ status: Project['status'] }>()
</script>

<template>
  <span :class="['inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', PROJECT_STATUS_COLORS[status]]">
    {{ PROJECT_STATUS_LABELS[status] }}
  </span>
</template>
