import type { FlatArea } from './regions'
import { formatRegionName, getFlatAreas } from './regions'

export type BirthdayMode = 'date' | 'age' | 'random'
export type GenderOption = 'male' | 'female' | 'random'
export type NameMode = 'none' | 'random' | 'fixed'
export type OutputFormat = 'detail' | 'code' | 'json'

export interface RegionSelection {
  /** 每条记录随机选取地区 */
  random: boolean
  province: string
  city: string
  area: string
}

export interface IdCardOptions {
  region: RegionSelection
  birthdayMode: BirthdayMode
  year: number
  month: number
  day: number
  age: number
  gender: GenderOption
  nameMode: NameMode
  name: string
  quantity: number
  format: OutputFormat
}

export interface IdCardRecord {
  id: string
  name: string
  gender: '男' | '女'
  birthday: string
  age: number
  region: string
}

const ID_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

const SURNAMES
  = '李 王 张 刘 陈 杨 黄 赵 吴 周 徐 孙 马 朱 胡 郭 何 林 罗 高 郑 梁 谢 宋 唐 许 韩 冯 邓 曹 彭 曾 肖 田 董 潘 袁 蔡 蒋 余 于 杜 叶 程 苏 魏 吕 丁 任 卢 姚 沈 钟 姜 崔 谭 陆 范 汪 廖 石 金 韦 贾 夏 傅 方 邹 熊 白 孟 秦 邱 侯 江 尹 薛 闫 段 雷 龙 史 陶 黎 贺 顾 毛 郝 龚 邵 万 钱 严 覃 武 戴 莫 孔 向 汤'.split(' ')

const GIVEN_MALE
  = '伟 强 磊 军 洋 勇 杰 涛 斌 波 辉 刚 健 明 亮 俊 峰 鑫 宇 浩 凯 昊 宸 瑞 涵 博 文 昱 鸿 铭 泽 世 天 承 德 智 志 立 家 国 安 建 华 龙 翔 林 森 航 东 海 山 川 晨 曦 阳 平 福 贵 生 学 祥 新 利 彬 信 昌 康 星 光 达 岩 茂 进 坚 和 彪 诚 敬 振 壮 群 豪 邦 乐 善 厚 庆 民 友 裕 哲 超 谦 奇'.split(' ')

const GIVEN_FEMALE
  = '芳 娟 敏 静 丽 娜 燕 雪 梅 琳 素 云 莲 真 环 荣 爱 霞 香 月 莺 媛 怡 佳 晶 舒 婷 雯 颖 慧 美 玉 欣 蕾 碧 兰 苑 洁 瑶 蓉 茜 莹 娴 露 璐 冰 秋 双 卉 菲 霏 倩 沛 丹 萍 青 岚 婕 韵 妍 楠 汐 悦 彤 玲 芝 萱 可 嘉 若 语 诗 曼'.split(' ')

export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 1000

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** GB 11643-1999 第 18 位校验码 */
export function calcCheckCode(id17: string): string {
  let sum = 0
  for (const [i, weight] of ID_WEIGHTS.entries())
    sum += Number(id17[i]) * weight
  // CHECK_CODES 恰有 11 项,sum % 11 必然落在下标范围内
  return CHECK_CODES[sum % 11]!
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** 将任意输入收敛为合法的 YYYY-MM-DD（越界回退到最小合法值） */
function normalizeDate(year: number, month: number, day: number): string {
  const y = clampInt(year || 2000, 1900, new Date().getFullYear())
  const m = clampInt(month || 1, 1, 12)
  const d = clampInt(day || 1, 1, daysInMonth(y, m))
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function clampInt(value: number, min: number, max: number): number {
  const n = Math.trunc(value)
  return Number.isNaN(n) ? min : Math.min(Math.max(n, min), max)
}

/** 按年月日与今天对比计算周岁 */
export function calcAge(birthday: string, now = new Date()): number {
  const year = Number(birthday.slice(0, 4))
  const month = Number(birthday.slice(5, 7))
  const day = Number(birthday.slice(8, 10))
  let age = now.getFullYear() - year
  const monthDiff = now.getMonth() + 1 - month
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < day))
    age--
  return age
}

function randomBirthdayByAge(age: number): string {
  const year = new Date().getFullYear() - Math.min(Math.max(Math.trunc(age) || 0, 0), 150)
  const month = randomInt(1, 12)
  const day = randomInt(1, daysInMonth(year, month))
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function resolveBirthday(options: IdCardOptions): string {
  if (options.birthdayMode === 'date')
    return normalizeDate(options.year, options.month, options.day)
  if (options.birthdayMode === 'age')
    return randomBirthdayByAge(options.age)
  return randomBirthdayByAge(randomInt(18, 60))
}

function resolveRegion(options: IdCardOptions): { code: string, name: string } {
  const areas = getFlatAreas()
  const picked = options.region.random
    ? areas[randomInt(0, areas.length - 1)]
    : areas.find(area => area.code === options.region.area)

  if (picked)
    return toRegion(picked)

  // 选项尚未同步时的兜底
  return { code: options.region.area, name: options.region.area }
}

function toRegion(area: FlatArea): { code: string, name: string } {
  return {
    code: area.code,
    name: formatRegionName(area.province, area.city, area.area),
  }
}

/** 顺序码（第 15~17 位）：奇数为男、偶数为女 */
function resolveSequence(gender: '男' | '女'): string {
  const seq = randomInt(1, 999)
  const isOdd = seq % 2 === 1
  const aligned = (gender === '男') === isOdd ? seq : seq >= 999 ? seq - 1 : seq + 1
  return String(aligned).padStart(3, '0')
}

export function randomName(gender: '男' | '女'): string {
  const pool = gender === '男' ? GIVEN_MALE : GIVEN_FEMALE
  const givenLength = randomInt(1, 2)
  let given = ''
  for (let i = 0; i < givenLength; i++)
    given += pool[randomInt(0, pool.length - 1)]
  return SURNAMES[randomInt(0, SURNAMES.length - 1)] + given
}

export function generateIdCardRecord(options: IdCardOptions): IdCardRecord {
  const gender: '男' | '女' = options.gender === 'random'
    ? Math.random() < 0.5 ? '男' : '女'
    : options.gender === 'male' ? '男' : '女'

  const birthday = resolveBirthday(options)
  const { code, name: region } = resolveRegion(options)
  const id17 = `${code}${birthday.replaceAll('-', '')}${resolveSequence(gender)}`

  const name = options.nameMode === 'fixed'
    ? options.name.trim().slice(0, 10)
    : options.nameMode === 'random' ? randomName(gender) : ''

  return {
    id: `${id17}${calcCheckCode(id17)}`,
    name,
    gender,
    birthday,
    age: calcAge(birthday),
    region,
  }
}

export function generateIdCardRecords(options: IdCardOptions, count: number): IdCardRecord[] {
  const total = clampInt(count || MIN_QUANTITY, MIN_QUANTITY, MAX_QUANTITY)
  return Array.from({ length: total }, () => generateIdCardRecord(options))
}

export function formatRecords(records: IdCardRecord[], format: OutputFormat): string {
  if (!records.length)
    return ''

  if (format === 'code')
    return records.map(record => record.id).join('\n')

  if (format === 'json')
    return JSON.stringify(records, null, 2)

  return records
    .map(record => [
      `身份证号码:${record.id}`,
      record.name && `姓名:${record.name}`,
      `性别:${record.gender}`,
      `出生日期:${record.birthday}`,
      `年龄:${record.age}`,
      `出生地:${record.region}`,
    ].filter(Boolean).join(','))
    .join('\n')
}
