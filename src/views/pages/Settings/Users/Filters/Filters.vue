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
          chip-text="Период"
          menu-header-text="Выберите период"
          :start-date-time.sync="fromDateTime"
          :end-date-time.sync="toDateTime"
          @change="() => { filterModel = {...filterModel, period: [fromDateTime,toDateTime]} }"
        />
        <filter-item
          :menu-model="false"
          :count="+!!filterModel.FIO"
          min-width="480"
          chip-text="Имя"
          menu-header-text="Имя"
          @apply="() => { filterModel = {...filterModel, FIO} }"
          @cancel="() => { FIO = filterModel.FIO || null }"
          @clear="() => { FIO = null; filterModel = {...filterModel, FIO: null} }"
        >
          <v-text-field
            v-model="FIO"
            placeholder="Имя"
          />
        </filter-item>
        <filter-item
          :menu-model="false"
          :count="+(filterModel.isArchive !== null)"
          min-width="480"
          chip-text="Архивный пользователь"
          menu-header-text="Архивный ли пользователь?"
          @apply="() => filterModel = {...filterModel, isArchive }"
          @cancel="() => { isArchive = filterModel.isArchive || null }"
          @clear="() => { isArchive = null; filterModel = {...filterModel, isArchive: null } }"
        >
          <v-select
            v-model="isArchive"
            :items="archiveTypeList"
            placeholder="Архивный ли пользователь?"
          />
        </filter-item>

        <filter-item
          :menu-model="false"
          :count="+(filterModel.isBlocked !== null)"
          min-width="480"
          chip-text="Заблокирован ли пользователь ?"
          menu-header-text="Заблокирован ли пользователь ?"
          @apply="() => filterModel = {...filterModel, isBlocked }"
          @cancel="() => { isBlocked = filterModel.isBlocked }"
          @clear="() => { isBlocked = null; filterModel = {...filterModel, isBlocked: null } }"
        >
          <v-select
            v-model="isBlocked"
            :items="isBlockedSelectList"
            placeholder="Заблокирован ли пользователь ?"
          />
        </filter-item>

        <filter-item
          :menu-model="false"
          :count="+!!(filterModel.roles.length)"
          min-width="480"
          chip-text="Роли пользователя"
          menu-header-text="Роли пользователя"
          @apply="() => filterModel = {...filterModel, roles }"
          @cancel="() => { roles = filterModel.roles }"
          @clear="() => { roles = []; filterModel = {...filterModel, roles: [] } }"
        >
          <v-select
            v-model="roles"
            multiple
            :items="rolesSelectList"
            placeholder="Роли пользователя"
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
import { HumanReadableRole, Role } from '@/controllers/UserController';

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

  get archiveTypeList() {
    return [
      { value: true, text: "В архиве" },
      { value: false, text: "Не в архиве" }
    ];
  }

  get filterModel(): TUserGuideFilterModel {
    return this.filters[filterName];
  }

  set filterModel(value: TUserGuideFilterModel) {
    this.setFilters({ name: filterName, value });
    this.$emit('change');
  }


  get isBlockedSelectList() {
    return [
      { value: true, text: "Заблокирован" },
      { value: false, text: "Разблокирован" },
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
