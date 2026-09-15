<script setup lang="ts">
import type { BirthdayMode, GenderOption, NameMode, OutputFormat } from '~/utils/idcard'
import { MAX_QUANTITY, MIN_QUANTITY } from '~/utils/idcard'

// 表单为单一内聚区块，状态统一收敛在 useIdCardGenerator 中，
// 仅地区选择与结果面板拆分为独立子组件
const { options, records, outputText, generate, generateLucky, clear } = useIdCardGenerator()

const birthdayModes: { value: BirthdayMode, label: string }[] = [
  { value: 'date', label: '指定日期' },
  { value: 'age', label: '指定年龄' },
  { value: 'random', label: '随机' },
]

const genderOptions: { value: GenderOption, label: string }[] = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'random', label: '随机' },
]

const nameModes: { value: NameMode, label: string }[] = [
  { value: 'none', label: '无' },
  { value: 'random', label: '随机' },
  { value: 'fixed', label: '指定' },
]

const outputFormats: { value: OutputFormat, label: string }[] = [
  { value: 'detail', label: '详细信息' },
  { value: 'code', label: '仅身份证号' },
  { value: 'json', label: 'JSON' },
]
</script>

<template>
  <div class="px-4 py-2 border border-base rounded-xl bg-base shadow-sm">
    <!-- 出生地 -->
    <div class="py-2.5 flex flex-wrap gap-x-2 items-start">
      <div class="text-sm pt-1.5 text-right op-fade shrink-0 w-18">
        出生地
      </div>
      <div class="flex-1 min-w-0">
        <IdCardRegionSelect v-model="options.region" />
      </div>
    </div>

    <!-- 出生日期 -->
    <div class="py-2.5 flex flex-wrap gap-x-2 items-start">
      <div class="text-sm pt-1.5 text-right op-fade shrink-0 w-18">
        出生日期
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-2 items-center">
        <label
          v-for="mode in birthdayModes"
          :key="mode.value"
          class="text-sm flex gap-1.5 cursor-pointer select-none items-center"
        >
          <input v-model="options.birthdayMode" type="radio" name="birthday-mode" :value="mode.value" class="accent-teal-600">
          {{ mode.label }}
        </label>
      </div>
    </div>

    <!-- 日期 / 年龄输入 -->
    <div v-if="options.birthdayMode !== 'random'" class="py-2.5 flex flex-wrap gap-x-2 items-start">
      <div class="text-sm pt-1.5 text-right op-fade shrink-0 w-18">
        {{ options.birthdayMode === 'age' ? '年龄' : '日期' }}
      </div>
      <div class="text-sm flex flex-wrap gap-2 items-center">
        <template v-if="options.birthdayMode === 'date'">
          <input v-model.number="options.year" type="number" min="1900" max="2100" class="input-base text-center w-24" aria-label="出生年份">
          <span>年</span>
          <input v-model.number="options.month" type="number" min="1" max="12" class="input-base text-center w-20" aria-label="出生月份">
          <span>月</span>
          <input v-model.number="options.day" type="number" min="1" max="31" class="input-base text-center w-20" aria-label="出生日期">
          <span>日</span>
        </template>
        <template v-else>
          <input v-model.number="options.age" type="number" min="0" max="150" class="input-base text-center w-24" aria-label="年龄">
          <span>岁（按当前年份推算出生日期，月日随机）</span>
        </template>
      </div>
    </div>

    <!-- 性别 -->
    <div class="py-2.5 flex flex-wrap gap-x-2 items-start">
      <div class="text-sm pt-1.5 text-right op-fade shrink-0 w-18">
        性别
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-2 items-center">
        <label
          v-for="option in genderOptions"
          :key="option.value"
          class="text-sm flex gap-1.5 cursor-pointer select-none items-center"
        >
          <input v-model="options.gender" type="radio" name="gender" :value="option.value" class="accent-teal-600">
          {{ option.label }}
        </label>
      </div>
    </div>

    <!-- 姓名 -->
    <div class="py-2.5 flex flex-wrap gap-x-2 items-start">
      <div class="text-sm pt-1.5 text-right op-fade shrink-0 w-18">
        姓名
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-2 items-center">
        <label
          v-for="mode in nameModes"
          :key="mode.value"
          class="text-sm flex gap-1.5 cursor-pointer select-none items-center"
        >
          <input v-model="options.nameMode" type="radio" name="name-mode" :value="mode.value" class="accent-teal-600">
          {{ mode.label }}
        </label>
        <input
          v-if="options.nameMode === 'fixed'"
          v-model="options.name"
          type="text"
          maxlength="10"
          placeholder="输入姓名"
          class="input-base w-40"
          aria-label="指定姓名"
        >
      </div>
    </div>

    <!-- 生成数量 -->
    <div class="py-2.5 flex flex-wrap gap-x-2 items-start">
      <div class="text-sm pt-1.5 text-right op-fade shrink-0 w-18">
        生成数量
      </div>
      <div class="text-sm flex flex-wrap gap-2 items-center">
        <input v-model.number="options.quantity" type="number" :min="MIN_QUANTITY" :max="MAX_QUANTITY" class="input-base text-center w-28" aria-label="生成数量">
        <span class="op-fade">1 ~ 1000 条</span>
      </div>
    </div>

    <!-- 输出格式 -->
    <div class="py-2.5 flex flex-wrap gap-x-2 items-start">
      <div class="text-sm pt-1.5 text-right op-fade shrink-0 w-18">
        输出格式
      </div>
      <div class="flex flex-wrap gap-2 items-center">
        <select v-model="options.format" class="input-base min-w-32" aria-label="输出格式">
          <option v-for="format in outputFormats" :key="format.value" :value="format.value">
            {{ format.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- 操作 -->
    <div class="px-0 pb-3 pt-4 flex gap-3 items-center sm:pl-20">
      <button class="btn" @click="generate()">
        生成
      </button>
      <button class="btn-ghost" @click="generateLucky()">
        手气不错
      </button>
    </div>

    <IdCardResultPanel :text="outputText" :count="records.length" @clear="clear()" />
  </div>
</template>
