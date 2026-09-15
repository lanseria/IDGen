import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
    {
      // 语义化明暗双色 token
      'bg-page': 'bg-gray-50 dark:bg-#0d0d0d',
      'bg-base': 'bg-white dark:bg-#161616',
      'bg-secondary': 'bg-gray-50 dark:bg-#1d1d1d',
      'border-base': 'border-gray-200 dark:border-#2b2b2b',
      'color-base': 'text-gray-800 dark:text-gray-200',
      'op-fade': 'op-60 dark:op-50',
      'op-mute': 'op-40 dark:op-30',

      // 表单控件
      'input-base': 'h-8 px-2 text-sm rounded outline-none transition-colors bg-white dark:bg-#161616 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-#2b2b2b focus:border-teal-600/50 disabled:cursor-not-allowed disabled:op-40',

      // 次级按钮
      'btn-ghost': 'h-8 inline-flex items-center gap-1 rounded px-3 text-sm cursor-pointer transition-colors border border-gray-200 dark:border-#2b2b2b bg-white dark:bg-#161616 text-gray-800 dark:text-gray-200 hover:border-teal-600/60 hover:text-teal-600 dark:hover:text-teal-400 disabled:pointer-events-none disabled:op-40',
    },
  ],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
