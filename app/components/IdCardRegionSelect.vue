<script setup lang="ts">
import type { RegionSelection } from '~/utils/idcard'
import { getDivisionTree } from '~/utils/regions'

const region = defineModel<RegionSelection>({ required: true })

const tree = getDivisionTree()

const cities = computed(() =>
  tree.find(province => province.code === region.value.province)?.cities ?? [],
)

const areas = computed(() =>
  cities.value.find(city => city.code === region.value.city)?.areas ?? [],
)

// 省或市变更后，若下级选项已不包含当前值则重置为第一项
watch(() => region.value.province, () => {
  if (!cities.value.some(city => city.code === region.value.city))
    region.value.city = cities.value[0]?.code ?? ''
})

watch(() => region.value.city, () => {
  if (!areas.value.some(area => area.code === region.value.area))
    region.value.area = areas.value[0]?.code ?? ''
})
</script>

<template>
  <div class="flex flex-wrap gap-2 items-center">
    <select
      v-model="region.province"
      class="input-base min-w-30"
      aria-label="省份"
      :disabled="region.random"
    >
      <option v-for="province in tree" :key="province.code" :value="province.code">
        {{ province.name }}
      </option>
    </select>
    <select
      v-model="region.city"
      class="input-base min-w-32"
      aria-label="城市"
      :disabled="region.random"
    >
      <option v-for="city in cities" :key="city.code" :value="city.code">
        {{ city.name }}
      </option>
    </select>
    <select
      v-model="region.area"
      class="input-base min-w-32"
      aria-label="区县"
      :disabled="region.random"
    >
      <option v-for="area in areas" :key="area.code" :value="area.code">
        {{ area.name }}
      </option>
    </select>
    <label class="text-sm op-fade flex gap-1.5 cursor-pointer select-none items-center">
      <input v-model="region.random" type="checkbox" class="accent-teal-600">
      随机地区
    </label>
  </div>
</template>
