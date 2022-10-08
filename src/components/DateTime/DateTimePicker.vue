<template>
  <v-container>
    <v-row>
      <v-col>
        <v-menu
          v-model="showPicker "
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFormatted"
              :label="dateLabel"
              :hint="$localize('dateHint','validation')"
              persistent-hint
              :rules="[rules.date]"
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              @blur="date = parseDate(dateFormatted)"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="visualDate"
            no-title
            @input="showPicker = false; date = visualDate"
          />
        </v-menu>
      </v-col>

      <v-col>
        <TimeInput
          :time.sync="timeFormatted"
          :disabled="!dateFormatted"
          :label="timeLabel"
          @update="updateLocalDatetime"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, PropSync } from 'vue-property-decorator'
import { parseStringToTimeString, isHHMMTime, toRequestDateTimeFormat, dateFromDDMMYYY } from '@/utils/dateHelper'
import TimeInput from '@/components/DateTime/TimeInput.vue'
import Global from '@/mixins/GlobalMixin'
import { mixins } from 'vue-class-component'

const monthFormatLength = 2
const dayFormatLength = 2

@Component({
  components: {
    TimeInput
  }
})

export default class DateTimePicker extends mixins(Global) {
  @Prop({ type: String, default: 'Дата' }) readonly dateLabel!:string;
  @Prop({ type: String, default: 'Время' }) readonly timeLabel!:string;
  @Prop({ type: Boolean, default: false }) readonly endOfDay!:boolean;
  @PropSync('selectedDateTime') localDateTime!: string;
  showPicker = false;
  date = '';
  visualDate = ''
  dateFormatted = '';
  timeFormatted = '';

  get defaultTime () {
    return this.endOfDay ? '23:59' : '00:00'
  }

  @Watch('endOfDay', { immediate: true })
  setTime () {
    this.timeFormatted = this.defaultTime
  }

  parentSet (dateTimeString:string) {
    const [startDate, startTime] = dateTimeString.split('T')
    this.date = startDate
    this.timeFormatted = this.defaultTime
    this.parseTime(startTime)
  }

  setDateTime () { this.parentSet(this.localDateTime) }

  parseTime (time: string) {
    if (!time) return
    this.timeFormatted = parseStringToTimeString(time) || this.defaultTime
    this.updateLocalDatetime()
  }

  @Watch('date')
  updateStartDateTime (date:string) {
    this.dateFormatted = this.formatDate(date) || ''
  }

  @Watch('dateFormatted')
  updateLocalDatetime () {
    const dateTime = `${this.dateFormatted} ${this.timeFormatted}`
    const requestDateTIme = toRequestDateTimeFormat(dateTime)
    this.localDateTime = requestDateTIme || ''
    const parsedDate = this.parseDate(this.dateFormatted)
    if (parsedDate) { this.visualDate = parsedDate }
  }

  formatDate (date:string) {
    if (!date) return null
    const [year, month, day] = date.split('-')
    return `${day.padStart(dayFormatLength, '0')}.${month.padStart(monthFormatLength, '0')}.${year}`
  }

  parseDate (date: string):string|null {
    if (!date) return null
    const split = date.split('.')
    if (split.filter(e => e).length < 3) return null
    const [day, month, year] = split
    if (dateFromDDMMYYY(date) != null) {
      return `${year}-${month.padStart(monthFormatLength, '0')}-${day.padStart(dayFormatLength, '0')}`
    } else {
      return ''
    }
  }

  clear () {
    this.dateFormatted = ''
    this.date = ''
    this.timeFormatted = this.defaultTime
    this.localDateTime = ''
  }

  validate (): boolean {
    return isHHMMTime(this.timeFormatted) && (!this.dateFormatted || dateFromDDMMYYY(this.dateFormatted) !== null)
  }
}
</script>

<style>

</style>
