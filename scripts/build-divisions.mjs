/**
 * 从民政部行政区划数据源生成 app/data/divisions.ts
 * 数据源: https://github.com/modood/Administrative-divisions-of-China (GB/T 2260)
 *
 * 用法: node scripts/build-divisions.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import process from 'node:process'

const SOURCES = [
  'https://raw.githubusercontent.com/modood/Administrative-divisions-of-China/master/dist',
  'https://cdn.jsdelivr.net/gh/modood/Administrative-divisions-of-China@master/dist',
]

async function fetchJson(name) {
  let lastError
  for (const base of SOURCES) {
    try {
      const res = await fetch(`${base}/${name}`)
      if (!res.ok)
        throw new Error(`HTTP ${res.status}`)
      return await res.json()
    }
    catch (error) {
      lastError = error
      console.warn(`[build-divisions] ${base}/${name} 失败: ${error.message}`)
    }
  }
  throw lastError
}

const [provinces, cities, areas] = await Promise.all([
  fetchJson('provinces.json'),
  fetchJson('cities.json'),
  fetchJson('areas.json'),
])

if (!provinces.length || !cities.length || !areas.length) {
  console.error('[build-divisions] 数据不完整')
  process.exit(1)
}

const header = `/**
 * 全国省 / 市 / 区三级行政区划数据 (GB/T 2260)
 * 由 scripts/build-divisions.mjs 自动生成，请勿手工编辑
 */

export interface Division {
  code: string
  name: string
}

export interface DivisionWithParent extends Division {
  provinceCode: string
  cityCode?: string
}

`

const body = [
  `export const provinceList: Division[] = ${JSON.stringify(provinces)}`,
  '',
  `export const cityList: DivisionWithParent[] = ${JSON.stringify(cities)}`,
  '',
  `export const areaList: DivisionWithParent[] = ${JSON.stringify(areas)}`,
  '',
].join('\n')

await mkdir(new URL('../app/data', import.meta.url), { recursive: true })
await writeFile(new URL('../app/data/divisions.ts', import.meta.url), header + body, 'utf8')

console.log(`[build-divisions] 已生成: 省 ${provinces.length} / 市 ${cities.length} / 区县 ${areas.length}`)
