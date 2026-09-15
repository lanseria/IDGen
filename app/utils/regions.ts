import type { Division } from '~/data/divisions'
import { areaList, cityList, provinceList } from '~/data/divisions'

export interface DivisionCity extends Division {
  areas: Division[]
}

export interface DivisionProvince extends Division {
  cities: DivisionCity[]
}

export interface FlatArea {
  code: string
  province: string
  city: string
  area: string
}

let divisionTree: DivisionProvince[] | null = null
let flatAreas: FlatArea[] | null = null

/**
 * 省 -> 市 -> 区 三级树，惰性构建并缓存。
 * 不设区的市（如东莞、中山）补一个「市码 + 00」的区县节点。
 */
export function getDivisionTree(): DivisionProvince[] {
  if (divisionTree)
    return divisionTree

  divisionTree = provinceList.map(province => ({
    ...province,
    cities: cityList
      .filter(city => city.provinceCode === province.code)
      .map((city) => {
        const children = areaList.filter(area => area.cityCode === city.code)
        const areas = children.length
          ? children
          : [{ code: `${city.code}00`, name: city.name, provinceCode: city.provinceCode, cityCode: city.code }]
        return { ...city, areas }
      }),
  }))
  return divisionTree
}

/** 扁平的区县列表，用于「随机地区」 */
export function getFlatAreas(): FlatArea[] {
  if (flatAreas)
    return flatAreas

  flatAreas = getDivisionTree().flatMap(province =>
    province.cities.flatMap(city =>
      city.areas.map(area => ({
        code: area.code,
        province: province.name,
        city: city.name,
        area: area.name,
      })),
    ),
  )
  return flatAreas
}

/** 拼接地区显示名，跳过「市辖区」等中间层级 */
export function formatRegionName(province: string, city: string, area: string): string {
  const intermediate = new Set(['市辖区', '县', '省直辖县级行政区划', '自治区直辖县级行政区划'])
  return [province, city, area]
    .filter(part => part && !intermediate.has(part))
    .join(' ')
}
