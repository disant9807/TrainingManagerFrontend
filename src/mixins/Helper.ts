import { Vue, Component } from 'vue-property-decorator'
import { isINN, isOGRN, capitalize } from '@/utils/helpers'

@Component
export default class Helper extends Vue {
  noValue = '-';
  contentTypes: { [key: string]: string } = {
    pdf: 'application/pdf',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  capitalize (value: string): string {
    return capitalize(value)
  }

  isINN (value: string): boolean {
    return isINN(value)
  }

  isOGRN (value: string): boolean {
    return isOGRN(value)
  }

  sortDates (dates: string[], descending = false): string[] {
    return Array.from(dates).sort((a, b) => {
      return descending
        ? Date.parse(b) - Date.parse(a)
        : Date.parse(a) - Date.parse(b)
    })
  }

  localeDateFormat (dateValue: string | number, time = true, applyTimezone = true): string {
    const date = new Date(dateValue)

    if (applyTimezone) {
      const timezoneOffset = new Date().getTimezoneOffset()
      date.setMinutes(date.getMinutes() - timezoneOffset) // часовой пояс
    }

    const dateFormat = [
      this.toLeadingZero(date.getDate()),
      this.toLeadingZero(date.getMonth() + 1),
      date.getFullYear()
    ].join('.')
    const timeFormat = [
      this.toLeadingZero(date.getHours()),
      this.toLeadingZero(date.getMinutes()),
      this.toLeadingZero(date.getSeconds())
    ].join(':')

    return time ? dateFormat + ' ' + timeFormat : dateFormat
  }

  toLeadingZero (value: number): string | number {
    return value < 10 ? `0${value}` : value
  }
}
