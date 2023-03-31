<template>
  <div>
    <fieldset
      class="fieldset"
      aria-hidden="true"
    >
      <legend style="width: 86.25px;text-align: -webkit-center;"><span>фильтры</span></legend>
      <div class="filterBlock pa-1 pb-4">
        <DateTimeFilter
          ref="dateTime"
          :chip-text="$localize('period', 'filters').toUpperCase()"
          :menu-header-text="$localize('selectPeriod', 'filters')"
          :start-date-time.sync="fromDateTime"
          :end-date-time.sync="toDateTime"
          @change="() => { filterModel = {...filterModel, period: [fromDateTime,toDateTime]} }"
        />
        <filter-item
          :menu-model="false"
          :count="+!!filterModel.FIO"
          min-width="480"
          :chip-text="$localize('userGuide.thName', 'settings')"
          :menu-header-text="$localize('userGuide.thName', 'settings')"
          @apply="() => { filterModel = {...filterModel, FIO} }"
          @cancel="() => { FIO = filterModel.FIO || null }"
          @clear="() => { FIO = null; filterModel = {...filterModel, FIO: null} }"
        >
          <v-text-field
            v-model="FIO"
            :placeholder="$localize('userGuide.thName', 'settings')"
          />
        </filter-item>
        <filter-item
          :menu-model="false"
          :count="+!!(filterModel.isCertificateExpired!==null)"
          min-width="480"
          :chip-text="$localize('userGuide.isCertificateExpired', 'settings').toUpperCase()"
          :menu-header-text="$localize('userGuide.isCertificateExpired', 'settings')"
          @apply="() => { filterModel = {...filterModel, isCertificateExpired } }"
          @cancel="() => { isCertificateExpired = filterModel.isCertificateExpired || null }"
          @clear="() => { isCertificateExpired = null; filterModel = {...filterModel, isCertificateExpired: null} }"
        >
          <v-select
            v-model="isCertificateExpired"
            :items="statusList"
            :placeholder="$localize('userGuide.isCertificateExpired', 'settings')"
          />
        </filter-item>
        <filter-item
          v-if="departments"
          :menu-model="false"
          :count="+!!filterModel.department"
          min-width="480"
          :chip-text="$localize('userGuide.department', 'settings').toUpperCase()"
          :menu-header-text="$localize('userGuide.department', 'settings')"
          @apply="() => { filterModel = {...filterModel, department} }"
          @cancel="() => { department = filterModel.department || null }"
          @clear="() => { department = null; filterModel = {...filterModel, department: null} }"
        >
          <v-select
            v-model="department"
            :items="departmentsList"
            :placeholder="$localize('userGuide.department', 'settings')"
          />
        </filter-item>
        <filter-item
          :menu-model="false"
          :count="+(filterModel.isArchive !== null)"
          min-width="480"
          :chip-text="$localize('userGuide.active', 'settings').toUpperCase()"
          :menu-header-text="$localize('userGuide.active', 'settings')"
          @apply="() => filterModel = {...filterModel, isArchive }"
          @cancel="() => { isArchive = filterModel.isArchive || null }"
          @clear="() => { isArchive = null; filterModel = {...filterModel, isArchive: null } }"
        >
          <v-select
            v-model="isArchive"
            :items="archiveTypeList"
            :placeholder="$localize('userGuide.active', 'settings')"
          />
        </filter-item>

        <filter-item
          :menu-model="false"
          :count="+(filterModel.isBlocked !== null)"
          min-width="480"
          :chip-text="$localize('userGuide.status', 'settings').toUpperCase()"
          :menu-header-text="$localize('userGuide.status', 'settings')"
          @apply="() => filterModel = {...filterModel, isBlocked }"
          @cancel="() => { isBlocked = filterModel.isBlocked }"
          @clear="() => { isBlocked = null; filterModel = {...filterModel, isBlocked: null } }"
        >
          <v-select
            v-model="isBlocked"
            :items="isBlockedSelectList"
            :placeholder="$localize('userGuide.status', 'settings')"
          />
        </filter-item>

        <filter-item
          :menu-model="false"
          :count="+!!(filterModel.roles.length)"
          min-width="480"
          :chip-text="$localize('userGuide.role', 'settings').toUpperCase()"
          :menu-header-text="$localize('userGuide.role', 'settings')"
          @apply="() => filterModel = {...filterModel, roles }"
          @cancel="() => { roles = filterModel.roles }"
          @clear="() => { roles = []; filterModel = {...filterModel, roles: [] } }"
        >
          <v-select
            v-model="roles"
            multiple
            :items="rolesSelectList"
            :placeholder="$localize('userGuide.role', 'settings')"
          />
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
import { Component, Ref } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import FilterItem from '@/components/FilterItem.vue';
import Helper from '@/mixins/Helper';
import { mixins } from 'vue-class-component';
import DateTimeFilter from '@/components/filters/DateTimeFilter.vue';
import UserController, { TUserGuideFilterModel, filterName } from '@/controllers/UserController';
import { TDepartment } from '@/api/models/Organizations';
import { HumanReadableRole, Role } from '@/api/models/User';

@Component({
  components: {
    FilterItem,
    DateTimeFilter,
  }
})

export default class Filters extends mixins(Helper) {
  @State readonly filters!: any;
  @State(state => state.departmentsList) departments!: TDepartment[];
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @Ref() readonly dateTime!: DateTimeFilter
  fromDateTime = ''
  toDateTime = ''
  FIO = null;
  datePickerTabs = '';
  department = null;
  isCertificateExpired = null;
  isArchive = null;
  isBlocked = null;
  roles = [];

  // нужно передавать на бэк именно имя (в надежде что оно все таки будет)
  // на бэке нет поддержки по получению депортаментов из сединтеропа
  // в запросе конвертируются русские символы :( выглядит порнографически
  get departmentsList(): { value: string; text: string; }[] | null {
    return this.departments.map(dep => ({
      value: dep.shortTitle ?? '',
      text: dep.shortTitle ?? ''
    }));
  }

  get archiveTypeList() {
    return [
      { value: true, text: this.$localize('userGuide.archiveUserType', 'settings') },
      { value: false, text: this.$localize('userGuide.activeUserType', 'settings') }
    ];
  }

  get filterModel(): TUserGuideFilterModel {
    return this.filters[filterName];
  }

  set filterModel(value: TUserGuideFilterModel) {
    this.setFilters({ name: filterName, value });
    this.$emit('change');
  }

  get statusList(): { value: boolean | null; text: string; }[] {
    return [
      { value: true, text: this.$localize('userGuide.certificateStatus_Expired', 'settings') },
      { value: false, text: this.$localize('userGuide.certificateStatus_Available', 'settings') },
      // { value: null, text: this.$localize('userGuide.certificateStatus_NotSpecified', 'settings') }
    ];
  }

  get isBlockedSelectList() {
    return [
      { value: true, text: this.$localize('userGuide.statusBlocked', 'settings') },
      { value: false, text: this.$localize('userGuide.statusNotBlocked', 'settings') },
    ];
  }

  rolesSelectList: any[] = [];
  async rolesToSelectList() {
    const roles: string[] = await UserController.getRoles();
    this.rolesSelectList = roles.map(r => ({
      value: r, text: HumanReadableRole[r as Role] ?? r
    }));
  }

  clearFilters() {
    this.dateTime.cancel();
    this.FIO = null;
    this.department = null;
    this.filterModel = {
      FIO: null,
      period: [],
      department: null,
      isCertificateExpired: null,
      isArchive: null,
      isBlocked: null,
      roles: []
    };
  }

  setPeriod(period: string[]) {
    [this.fromDateTime, this.toDateTime] = [period[0], period[1]];
    this.filterModel = { ...this.filterModel, period: [this.fromDateTime, this.toDateTime] };
  }

  async created() {
    await this.rolesToSelectList();
  }
}

</script>
