import en from './en.json'

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T & string]: K | `${K}.${NestedKeyOf<T[K] & string>}` }[keyof T & string]
  : never

type FlattenObject<T, Prefix extends string = ''> = T extends object
  ? { [K in keyof T & string as `${Prefix}${Prefix extends '' ? '' : '.'}${K}`]: T[K] }
  : Record<string, never>

type FlatStrings = FlattenObject<typeof en>
type StringKey = keyof FlatStrings

const flat: Record<string, string> = {}

function flatten(obj: Record<string, unknown>, prefix = '') {
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    if (typeof value === 'string') {
      flat[fullKey] = value
    } else if (typeof value === 'object' && value !== null) {
      flatten(value as Record<string, unknown>, fullKey)
    }
  }
}

flatten(en as Record<string, unknown>)

export function t(key: string, params?: Record<string, string | number>): string {
  let value = flat[key] ?? key
  if (params) {
    for (const [param, replacement] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${param}\\}`, 'g'), String(replacement))
    }
  }
  return value
}

export function getLocale() {
  return en
}

export default en
