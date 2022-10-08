import { Vue, Component } from 'vue-property-decorator'
import { isINN, isOGRN, isOGRNIP, isPassword } from '@/utils/helpers'
import { dateFromDDMMYYY } from '@/utils/dateHelper'

export type TRuleFunction = (value: any) => true | string | TRuleFunction;

export type TRules = { [key: string]: TRuleFunction };

@Component
export default class Validation extends Vue {
  rules: TRules = {
    required: (value: string[] | string | { [key: string]: any }): true | string => {
      return (Array.isArray(value) ? !!value.length : !!value?.toString().trim()) ||
        this.$localize('required', 'validation')
    },

    id: (value: string): true | string => !value || !!~value?.search(/^[0-9]+-[a-zA-Z0-9]+$/) ||
      this.$localize('id', 'validation'),

    number: (value: string): true | string => !value || !!~value?.search(/^[0-9]+$/) ||
      this.$localize('number', 'validation'),

    phone: (value: string): true | string => {
      return !value || !!~value.search(/^\+7 ?\([0-9]{3}\) ?[0-9]{3}-[0-9]{2}-[0-9]{2}$/) ||
        this.$localize('phone', 'validation')
    },

    email: (value: string): true | string => {
      return !value || !!~value?.search(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/) ||
        this.$localize('email', 'validation')
    },

    date: (value: string): true | string => !value || !!dateFromDDMMYYY(value) || this.$localize('date', 'validation'),

    minLength: (minValue: number) => {
      return (value: string): true | string => (!value?.trim() || !minValue) || value.length >= minValue ||
        this.$localize('minLength', 'validation').replace('$', minValue.toString())
    },

    maxLength: (maxValue: number) => {
      return (value: string): true | string => (!value?.trim() || !maxValue) || value.length <= maxValue ||
        this.$localize('maxLength', 'validation').replace('$', maxValue.toString())
    },

    longWord: (value: string): true | string => {
      const longWord = !!value?.trim() && value.split(' ').find(val => val.length > 50)
      return !longWord ||
        this.$localize('longWord', 'validation')
          .replace('$', longWord.substring(0, 50).concat('...'))
    },

    isEgrulIdentificator (value: string): true | string {
      return !isINN(value) && !isOGRN(value) ? 'Неверный ввод! Введите корректный ИННЮЛ или ОГРН!' : true
    },

    isEgripIdentificator (value: string): true | string {
      return !isINN(value) && !isOGRNIP(value) ? 'Неверный ввод! Введите корректный ИНН или ОГРНИП!' : true
    },

    isINN (value: string): true | string {
      return !value || isINN(value) ? true : 'Неверный ввод! Введите корректный ИНН!'
    },

    isOrgINN (value: string): true | string {
      const res = /([^0^\D]\d|\d[^0^\D])\d{8}/.test(value)
      return !value || res || 'Неверный ввод! Введите корректный ИНН!'
    },

    isFizINN (value: string): true | string {
      const res = /([^0^\D]\d|\d[^0^\D])\d{10}/.test(value)
      return !value || res || 'Неверный ввод! Введите корректный ИНН!'
    },

    isOGRN (value: string): true | string {
      return !value || isOGRN(value) ? true : 'Неверный ввод! Введите корректный ОГРН!'
    },

    isConclusionNumber (value: string): true | string {
      const res = /^[0-9]{1}[0-9]?-[0-9]-[0-9]-([0-9]-)?[0-9]{4}-[0-9]{2}$/.test(value)
      return !value || res || 'Не соответствует формату номера заключения!'
    },

    isCadastralNumber (value: string): true | string {
      const res = /^\d+:\d+:\d+:\d+$/.test(value)
      return !value || res || 'Не соответствует формату кадастрового номера!'
    },

    isbudgetProcessOrgCode (value: string): true | string {
      const res = /\d{8}$/.test(value)
      return !value || res || 'Не соответствует формату организации в реестре участников бюджетного процесса!'
    },

    isKpp (value: string): true | string {
      // TODO: исправить в дальнейшем регулярку
      // const res = /([^0^\D]\d|\d[^0^\D])\d{2}[A-Z0-9] {2}\d{3}/.test(value);
      const res = /\d{9}$/.test(value)
      return !value || res || 'Не соответствует формату организации в реестре участников бюджетного процесса!'
    },

    isOktmo (value: string): true | string {
      const res = /^((\d){8}|(\d){11})$/.test(value)
      return !value || res || 'Не соответствует формату кода ОКТМО!'
    },

    isKbk (value: string): true | string {
      const res = /^[0-9a-zA-Zа-яА-Я]{20}$/.test(value)
      return value === '0' || res || 'Не соответствует формату КБК!'
    },

    isBik (value: string): true | string {
      const res = /\d{9}$/.test(value)
      return value === '0' || res || 'Не соответствует формату БИК!'
    },

    isBankAccount (value: string): true | string {
      const res = /\d{20}$/.test(value)
      return value === '0' || res || 'Не соответствует формату банковского счета!'
    },

    isUrn (value: string): true | string {
      const res = /^[0-9a-fA-F]{6}$/.test(value)
      return value === '0' || res || 'Не соответствует формату УРН!'
    },

    isOrgName (value: string): true | string {
      const res = /\S+[\S\s]\S+/.test(value)
      return value === '0' || res || 'Не соответствует формату!'
    },

    unique: (isUnique: boolean) => (): true | string => isUnique || this.$localize('unique', 'validation'),

    notZero (value: string): true | string {
      const res = /^[1-9][0-9]*$/.test(value)
      return res || 'Значение должно быть больше 0'
    }

  }
}

const validation = new Validation()
export {
  validation
}
