<template>
  <div class="text-center pa-1">
    <v-text-field
      v-model="kwds"
      name="searchfield"
      label="Введите любое слово"
      outlined
      clearable
      class="ma-3 search-field"
      hide-details
      @keydown="onKeydown"
    >
      <template #append-outer>
        <v-btn
          color="primary"
          outlined
          fab
          small
          style="align-self: center"
          class="ml-3"
          @click="apply('kwds')"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <fieldset class="fieldset" aria-hidden="true">
      <legend style="width: 86.25px;text-align: -webkit-center;"><span>фильтры</span></legend>
      <div class="filterBlock pa-1 pb-4">
        <DateTimeFilter
          ref="dateTime"
          chip-text="ПЕРИОД"
          menu-header-text="Выбор периода"
          :start-date-time.sync="fromDateTime"
          :end-date-time.sync="toDateTime"
          :count="filterModel.period.filter(d => d).length"
          @change="apply('period')"
        />

        <filter-item
          :menu-model="isSource"
          :count="+!!filterModel.source"
          chip-text="ЕПГУ/МЕЖВЕД"
          menu-header-text="Источник запроса (ЕПГУ/Межвед)"
          @apply="apply('source')"
          @cancel="cancel('source')"
          @clear="clear('source')"
        >
          <v-radio-group
            v-model="source"
            column
          >
            <v-radio
              label="ЕПГУ"
              value="Epgu"
            />
            <v-radio
              label="Межведомственное взаимодействие"
              value="InterAuthority"
            />
          </v-radio-group>
        </filter-item>

        <filter-item
          :menu-model="isTypeCodes"
          :count="typeCodesCount"
          chip-text="ВИД ЗАПРОСА"
          menu-header-text="Вид запроса"
          @apply="apply('typeCodes')"
          @cancel="cancel('typeCodes')"
          @clear="clear('typeCodes')"
        >
          <div>
            <h2 class="title mb-2">
              Вид запроса
            </h2>
            <v-list dense height="350px" class="list">
              <v-list-item-group
                v-model="typeCodes"
                multiple
                active-class=""
              >
                <v-list-item
                  v-for="(item, i) in Object.entries(requestTypes)"
                  :key="`list-item-${i}`"
                  :value="item[0]"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox
                        :key="`checkbox_${i}`"
                        color="primary"
                        :input-value="active"
                      />
                    </v-list-item-action>
                    <v-list-item-title class="secondary--text" v-text="item[1]" />
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </filter-item>

        <filter-item
          :menu-model="isStatus"
          :count="statusesCount"
          chip-text="СТАТУС"
          menu-header-text="Статус"
          @apply="apply('statuses')"
          @cancel="cancel('statuses')"
          @clear="clear('statuses')"
        >
          <v-list dense height="350px" class="list">
            <v-list-item-group
              v-model="statuses"
              multiple
              active-class=""
            >
              <v-list-item
                v-for="(item, i) in Object.entries(requestStatuses)"
                :key="`list-item-${i}`"
                :value="item[0]"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox
                      :key="`checkbox_${i}`"
                      color="primary"
                      :input-value="active"
                    />
                  </v-list-item-action>
                  <v-list-item-title class="secondary--text" v-text="item[1]" />
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </filter-item>
      </div>
      <v-btn
        fab
        x-small
        class="secondary lighten-4 filterClose"
        outlined
        @click="clearFilters"
      >
        <v-icon class="white--text">mdi-close</v-icon>
      </v-btn>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Helper from '@/mixins/Helper'
import DateTimeFilter from '@/components/filters/DateTimeFilter.vue'
import FilterItem from './FilterItem.vue'
import { Mutation, State } from 'vuex-class'
import { TExerciseFilterViewModel } from '@/controllers/Exercise'

type TFilterType = 'period' | 'typeCodes' | 'source' | 'applicant' | 'reqNum' | 'statuses' | 'kwds';

export type TIncomingRouteName = 'New' | 'Handled' | 'Saved';

@Component({
  components: {
    FilterItem,
    DateTimeFilter
  }
})
export default class Filters extends mixins(Helper) {
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;
  @Ref() readonly dateTimeRef!: DateTimeFilter;
  routeName = 'New';

  get filterModel (): TExerciseFilterViewModel {
    return this.filters.incoming[this.routeName]
  }

  set filterModel (value: TExerciseFilterViewModel) {
    this.setFilters({ name: 'incoming', status: this.routeName, value })
    this.$emit('change')
  }

  get loadingModel () {
    return this.loading.incoming
  }

  get isListLoading () {
    return this.loadingModel.list
  }

  set isListLoading (value: boolean) {
    this.setLoading({ category: 'incoming', name: 'list', value })
  }

  created (): void {
    [this.fromDateTime, this.toDateTime] = this.filterModel.period || []
    this.source = this.filterModel.source || ''
    this.typeCodes = this.filterModel.typeCodes || []
    this.kwds = this.filterModel.kwds || ''
    this.applicant = this.filterModel.applicant || ''
    this.reqNum = this.filterModel.reqNum || ''
    this.statuses = this.filterModel.statuses || []
  }

  fromDateTime = '';
  toDateTime = '';

  isPeriod = false;
  period: string[] = [];
  datePickerTabs = '';

  isTypeCodes = false;
  typeCodes = [];

  kwds = '';

  isSource = false;
  source = '';

  isApplicant = false;
  applicant = '';

  isReqNum = false;
  reqNum = '';

  isStatus = false;
  statuses: string[] = [];

  get requestTypes (): any {
    if (this.source === 'Epgu') return this.epguRequests
    else if (this.source === 'InterAuthority') return this.iaRequests
    else return { ...this.epguRequests, ...this.iaRequests }
  }

  epguRequests = {
    EpguAppToGetLicenseInitial: 'Предоставление лицензии',
    EpguAppToGetLicenseAnnulment: 'Прекращение лицензии',
    EpguAppToChangeLicense: 'Внесение изменений в реестр лицензий',
    EpguLicensingInfo: 'Выдача выписки из реестра'
  };

  iaRequests = {
    LicenseCoordination: 'Согласование проекта НДС',
    EpguLicensingInfo: 'Предоставление сведений из реестра лицензий'
  };

  requestStatuses = {
    GOT_FROM_DECLARANT: 'Принято от заявителя',
    SENT_TO_SEDD: 'Отправлено в ведомство',
    ERROR_PROCESSING_RESULT: 'Ошибка обработки результата',
    COMPLETED: 'Услуга оказана',
    REJECTED: 'Отказано в предоставлении услуги',
    ACCEPTED_BY_USER_IN_SEDD: 'Заявление принято к рассмотрению',
    INTERMIDIATE_RESULT: 'Промежуточные результаты от ведомства',
    CANCEL_IN_PROGRESS: 'Заявление отменяется',
    CANCELED: 'Заявление отменено',
    UNPROVED_CANCEL: 'Не удалось отменить заявление',
    WAITING_ADDITIONAL_INFO: 'Ожидание дополнительной информации от пользователя',
    REQUEST_NEED_CORRECTION: 'Требуется корректировка заявления'
  };

  get typeCodesCount (): number {
    return this.filterModel?.typeCodes?.length ?? 0
  }

  get statusesCount () {
    return this.filterModel.statuses?.length ?? 0
  }

  clearFilters (): void {
    this.typeCodes = []
    this.period = []
    this.kwds = ''
    this.source = ''
    this.applicant = ''
    this.reqNum = ''
    this.statuses = []
    this.fromDateTime = this.toDateTime = ''

    this.filterModel = {
      state: '',
      typeCodes: '',
      period: [],
      kwds: '',
      source: '',
      applicant: '',
      reqNum: '',
      statuses: []
    }

    this.$emit('change')
  }

  apply (filter: TFilterType): void {
    this.isListLoading = true
    switch (filter) {
      case 'typeCodes':
        this.filterModel = { ...this.filterModel }
        break

      case 'period':
        this.filterModel = { ...this.filterModel, period: [this.fromDateTime, this.toDateTime] }
        break

      case 'kwds':
        this.filterModel = { ...this.filterModel, kwds: this.kwds }
        break

      case 'source':
        this.filterModel = { ...this.filterModel }
        break

      case 'applicant':
        this.filterModel = { ...this.filterModel, applicant: this.applicant }
        break

      case 'reqNum':
        this.filterModel = { ...this.filterModel, reqNum: this.reqNum }
        break

      case 'statuses':
        this.filterModel = { ...this.filterModel, statuses: this.statuses }
        break

      default:
        break
    }

    this.$emit('change')
  }

  cancel (filter: TFilterType): void {
    this.isListLoading = true
    switch (filter) {
      case 'typeCodes':
        this.typeCodes = this.filterModel.typeCodes || []
        break

      case 'period':
        [this.fromDateTime, this.toDateTime] = this.filterModel.period || []
        break

      case 'kwds':
        this.kwds = this.filterModel.kwds || ''
        break

      case 'source':
        this.source = this.filterModel.source || ''
        break

      case 'applicant':
        this.applicant = this.filterModel.applicant || ''
        break

      case 'reqNum':
        this.reqNum = this.filterModel.reqNum || ''
        break

      case 'statuses':
        this.statuses = this.filterModel.statuses || []
        break

      default:
        break
    }
  }

  clear (filter: TFilterType): void {
    this.isListLoading = true
    switch (filter) {
      case 'typeCodes':
        this.typeCodes = []
        this.filterModel = { ...this.filterModel }
        break

      case 'period':
        [this.fromDateTime, this.toDateTime] = ['', '']
        this.filterModel = { ...this.filterModel, period: [] }
        break

      case 'kwds':
        this.kwds = ''
        this.filterModel = { ...this.filterModel, kwds: '' }
        break

      case 'source':
        this.source = ''
        this.filterModel = { ...this.filterModel, source: '' }
        break

      case 'applicant':
        this.applicant = ''
        this.filterModel = { ...this.filterModel, applicant: '' }
        break

      case 'reqNum':
        this.reqNum = ''
        this.filterModel = { ...this.filterModel, reqNum: '' }
        break

      case 'statuses':
        this.statuses = []
        this.filterModel = { ...this.filterModel, statuses: [] }
        break

      default:
        break
    }

    this.$emit('change')
  }

  onKeydown (e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.apply('kwds')
    }
  }
}
</script>

<style lang="scss">
.chipGroupContent {
  & .v-slide-group__content {
    flex-direction: column;
  }
}
.list {
  overflow-y: auto;
}
.export-button {
  background-color: #c3c3c3;
  margin-top: 20px;
}
.search-field {
  display: flex;
  .v-input__append-outer {
    margin: 0 !important;
    padding: 0 !important;
    height: 100%;
    display: flex;
    justify-content: center;
    align-self: center;
    width: 50px;
  }
}
</style>
