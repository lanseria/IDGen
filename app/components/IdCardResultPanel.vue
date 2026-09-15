<script setup lang="ts">
const props = defineProps<{
  text: string
  count: number
}>()

const emit = defineEmits<{
  clear: []
}>()

// 注意不要解构 useClipboard 返回的 text(剪贴板内容),
// 否则会遮蔽同名 prop,导致生成结果无法展示
const { copy, copied } = useClipboard({ source: () => props.text })

function download() {
  const blob = new Blob([props.text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `身份证生成结果_${Date.now()}.txt`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="border border-base rounded-xl bg-base overflow-hidden">
    <div class="px-4 py-2 border-b border-base flex flex-wrap gap-2 items-center justify-between">
      <div class="text-sm font-500">
        生成结果
        <span v-if="count" class="font-400 op-fade">共 {{ count }} 条</span>
      </div>
      <div class="flex gap-2">
        <!-- isSupported 仅在客户端求值,用 ClientOnly 保证水合前后一致 -->
        <ClientOnly>
          <button class="btn-ghost text-xs" :disabled="!text" @click="copy()">
            <div class="text-sm" :class="copied ? 'i-carbon-checkmark text-teal-600 dark:text-teal-400' : 'i-carbon-copy'" />
            {{ copied ? '已复制' : '复制' }}
          </button>
        </ClientOnly>
        <button class="btn-ghost text-xs" :disabled="!text" @click="download()">
          <div class="i-carbon-download text-sm" />
          下载
        </button>
        <button class="btn-ghost text-xs" :disabled="!count" @click="emit('clear')">
          <div class="i-carbon-trash-can text-sm" />
          清空
        </button>
      </div>
    </div>
    <div class="text-13px leading-6 font-mono p-4 bg-secondary max-h-100 whitespace-pre-wrap break-all overflow-auto tabular-nums">
      <span v-if="text">{{ text }}</span>
      <span v-else class="op-mute">
        点击「生成」按钮获取结果，可用「手气不错」随机生成一组
      </span>
    </div>
  </div>
</template>
