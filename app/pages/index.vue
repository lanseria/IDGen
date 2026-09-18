<script setup lang="ts">
useSeoMeta({
  title: '身份证生成器 - IDGen',
  description: '按地区、出生日期、性别等条件批量生成符合校验规则的大陆居民身份证号，仅供开发测试使用',
})
</script>

<template>
  <div class="mx-auto px-4 pb-16 max-w-180 w-full">
    <header class="py-10 text-center">
      <h1 class="text-2xl tracking-wide font-bold flex items-center justify-center gap-2">
        <img src="/logo.png" alt="IDGen" class="w-7 h-7">
        证件生成器
      </h1>
      <p class="text-sm leading-6 mt-3 op-fade">
        大陆居民身份证号码生成 · 可按地区、出生日期、性别批量生成
      </p>
    </header>

    <IdCardGenerator />

    <p class="text-xs leading-5 mt-8 text-center op-mute">
      本工具生成的所有信息均为随机虚构数据，仅用于软件开发与测试场景，请勿用于任何非法用途
    </p>
  </div>
</template>
