import type { BirthdayMode, IdCardOptions, IdCardRecord } from '~/utils/idcard'
import { formatRecords, generateIdCardRecords, randomInt } from '~/utils/idcard'

function createDefaultOptions(): IdCardOptions {
  return {
    region: { random: false, province: '11', city: '1101', area: '110101' },
    birthdayMode: 'date',
    year: 2000,
    month: 1,
    day: 1,
    age: 25,
    gender: 'random',
    nameMode: 'random',
    name: '',
    quantity: 5,
    format: 'detail',
  }
}

/** 「手气不错」：随机化表单中除地区外的各项条件 */
function randomizeOptions(options: IdCardOptions): void {
  const modes: BirthdayMode[] = ['date', 'age', 'random']
  options.birthdayMode = modes[randomInt(0, modes.length - 1)] ?? 'random'

  if (options.birthdayMode === 'date') {
    options.year = randomInt(1960, new Date().getFullYear() - 18)
    options.month = randomInt(1, 12)
    options.day = randomInt(1, 28)
  }
  else if (options.birthdayMode === 'age') {
    options.age = randomInt(18, 60)
  }

  options.gender = Math.random() < 0.5 ? 'male' : 'female'
  options.nameMode = Math.random() < 0.6 ? 'random' : 'none'
}

export function useIdCardGenerator() {
  const options = reactive<IdCardOptions>(createDefaultOptions())
  const records = shallowRef<IdCardRecord[]>([])

  // 输出格式与表单联动：切换格式无需重新生成
  const outputText = computed(() => formatRecords(records.value, options.format))

  function generate() {
    records.value = generateIdCardRecords(options, options.quantity)
  }

  function generateLucky() {
    randomizeOptions(options)
    generate()
  }

  function clear() {
    records.value = []
  }

  return { options, records, outputText, generate, generateLucky, clear }
}
