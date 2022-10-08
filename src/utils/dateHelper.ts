import moment from 'moment'
export const dateDefaultFormat = 'YYYY-MM-DD'
export const timeDefaultFormat = 'HH:mm:ss'
export const dateTimeDefaultFormat = `${dateDefaultFormat}T${timeDefaultFormat}`
export const maxTime = '23:59'
export const minTime = '00:00'

export function swapPeriod (period: string[]) {
  let rcvFrom, rcvTo
  if (period[0]) {
    if (period[1]) {
      [rcvFrom, rcvTo] = period
    } else {
      [rcvFrom, rcvTo] = [period[0], period[0]]
    }
  } else {
    if (period[1]) {
      [rcvFrom, rcvTo] = [period[1], period[1]]
    } else {
      [rcvFrom, rcvTo] = [null, null]
    }
  }
  return { rcvFrom, rcvTo }
}

function toLeadingZero (value: number): string | number {
  return value < 10 ? `0${value}` : value
}

export function localeDateFormat (dateValue: string | number, time = true, applyTimezone = true): string {
  const date = new Date(dateValue)

  if (applyTimezone) {
    const timezoneOffset = new Date().getTimezoneOffset()
    date.setMinutes(date.getMinutes() - timezoneOffset) // часовой пояс
  }

  const dateFormat = [
    toLeadingZero(date.getDate()),
    toLeadingZero(date.getMonth() + 1),
    date.getFullYear()
  ].join('.')
  const timeFormat = [
    toLeadingZero(date.getHours()),
    toLeadingZero(date.getMinutes()),
    toLeadingZero(date.getSeconds())
  ].join(':')

  return time ? dateFormat + ' ' + timeFormat : dateFormat
}

export function dateFromDDMMYYY (dateString: string, splitter = '.'): Date | null {
  const dateParts = dateString.split(splitter)
  const day = +dateParts[0]
  const month = +dateParts[1]
  const year = +dateParts[2]
  const date = new Date(year, (month - 1), day)
  return (date && date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year) ? date : null
}

export function toRequestDateFormat (date: string | Date): string {
  return moment(date).format(dateTimeDefaultFormat)
}

export function toRequestDateTimeFormat (date: string | Date, format = 'DD.MM.YYYY hh:mm'): string | null {
  const m = moment(date, format)
  return m.isValid() ? moment(date, format).format(dateTimeDefaultFormat) : null
}

export const toDateFormat = (date: string | Date, format: string | null) => moment(date).format(format ?? dateDefaultFormat)
export const toTimeFormat = (date: string | Date, format: string | null) => moment(date).format(format ?? timeDefaultFormat)

export function isHHMMTime (time: string): boolean {
  const [hour, minutes] = time.split(':')
  const isValidHour = !!hour && +hour >= 0 && +hour <= 23
  const isValidMinutes = !!minutes && +minutes >= 0 && +minutes <= 59
  return isValidHour && isValidMinutes
}

export function isDateFromDDMMYYYHHMM (dateTimeString: string) {
  const parts = dateTimeString.split(' ')
  if (parts.length !== 2) return false
  const isDate = dateFromDDMMYYY(parts[0], '.') !== null
  const isTime = isHHMMTime(parts[1])
  return isDate && isTime
}

export function parseStringToTimeString (time: string): string {
  let [hours, minutes] = time.split(':')
  if (!minutes) {
    if (time.length === 4) {
      hours = time.substring(0, 2)
      minutes = time.substring(2, 4)
    } else if (time.length === 3) {
      hours = time.substring(0, 2)
      minutes = time.substring(2).padEnd(2, '0')
    } else {
      minutes = '0'
    }
  }
  const hourString = `${(+hours || 0).toString().padStart(2, '0')}`
  const minuteString = `${(+minutes || 0).toString().padStart(2, '0')}`
  const result = `${hourString}:${minuteString}`
  return result
}
export default localeDateFormat

/**
* Добавить дни к дате, автоматически увеличивает месяц и год
* @param date Дата в строке гггг-мм-дд
* @param days число дней, отрицательное чтобы отнять
*/
export function AddDaysToDate (dateString: string, days: number): string {
  const date = new Date(dateString)
  date.setDate(date.getDate() + days)
  return toDateFormat(date, null)
}

/**
* Добавить месяц к дате, автоматически увеличивает месяц и год
* @param date Дата в строке гггг-мм-дд
* @param days число дней, отрицательное чтобы отнять
*/
export function addMonths (dateString: string, months: number) {
  const date = new Date(dateString)
  const d = date.getDate()
  date.setMonth(date.getMonth() + +months)
  if (date.getDate() !== d) {
    date.setDate(0)
  }
  return toDateFormat(date, null)
}
