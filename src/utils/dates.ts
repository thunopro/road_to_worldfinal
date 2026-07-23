/** yyyy-mm-dd theo múi giờ địa phương */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function keyToDate(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key: string, days: number): string {
  const d = keyToDate(key)
  d.setDate(d.getDate() + days)
  return localDateKey(d)
}

/** số ngày giữa hai dateKey (b - a) */
export function daysBetween(a: string, b: string): number {
  const ms = keyToDate(b).getTime() - keyToDate(a).getTime()
  return Math.round(ms / 86400000)
}

/** dateKey của thứ Hai đầu tuần chứa ngày này */
export function weekStartKey(key: string): string {
  const d = keyToDate(key)
  const dow = (d.getDay() + 6) % 7 // 0 = Monday
  d.setDate(d.getDate() - dow)
  return localDateKey(d)
}

export function formatDateVi(key: string): string {
  const d = keyToDate(key)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function lastNDayKeys(n: number, end: Date = new Date()): string[] {
  const keys: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(d.getDate() - i)
    keys.push(localDateKey(d))
  }
  return keys
}
