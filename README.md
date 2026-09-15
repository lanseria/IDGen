# IDGen 证件生成器

基于 [Vitesse](https://github.com/antfu/vitesse) for Nuxt 4 的证件信息生成工具。

## 简介

IDGen 是一个用于生成虚构证件信息的开发测试工具，当前支持「大陆居民身份证」：

- 🗺️ 内置全国省 / 市 / 区三级行政区划数据（GB/T 2260），支持级联选择或随机地区
- 🎂 出生日期支持指定日期、指定年龄、随机三种模式
- 🚻 性别（男 / 女 / 随机，顺序码奇偶自动对齐）、姓名（无 / 随机 / 指定）
- 🔢 身份证号符合 GB 11643-1999 校验码规则
- 📦 批量生成 1 ~ 1000 条，输出格式支持详细信息 / 仅号码 / JSON
- 📋 一键复制、下载为 txt、清空
- 🌓 深浅色主题适配，支持 PWA 离线使用

> ⚠️ 免责声明：本工具生成的所有信息均为随机虚构数据，仅用于软件开发与测试场景（如表单校验、功能演示），请勿用于任何非法用途。

## 开发

```bash
pnpm i        # 安装依赖
pnpm dev      # 本地开发
pnpm build    # 生产构建
pnpm preview  # 预览构建产物
```

## 更新行政区划数据

行政区划数据由 `scripts/build-divisions.mjs` 从
[modood/Administrative-divisions-of-China](https://github.com/modood/Administrative-divisions-of-China)
生成到 `app/data/divisions.ts`，如需更新：

```bash
node scripts/build-divisions.mjs
```

## License

[MIT](./LICENSE)
