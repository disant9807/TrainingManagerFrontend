<template>
  <v-data-table
    :loading="loading"
    loading-text="Загрузка физиологических частей"
    :headers="headers"
    :items="categoryOfBodies"
    :page.sync="page"
    :items-per-page="10"
    multi-sort
    class="user-table mx-3 my-4"
  >
    <!-- eslint-disable vue/no-unused-vars -->
    <template
      v-for="header in headers"
      v-slot:[`header.${header.value}`]="{ header }"
    >
      <v-tooltip
        :key="header.value"
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
          > {{ header.text }} </span>
        </template>
        {{ header.text }}
      </v-tooltip>
    </template>
    <template
      v-if="!!categoryOfBodies"
      v-slot:body="{ items }"
    >
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="item.id"
        >
          <td> {{ index + 1 }}</td>
          <td> {{ item.name }} </td>
          <td> {{ item.shortName }} </td>
          <td> {{ item.code }} </td>
          <td> {{ item.decsription }} </td>
          <td style="white-space: nowrap;">
            <v-icon
              small
              color="darkblue"
              class="mr-2"
              @click="$emit('edit', item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              v-if="!item.archive"
              small
              color="darkblue"
              class="mr-2"
              @click="$emit('delete', item)"
            >
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import Helper from '@/mixins/Helper';
import { mixins } from 'vue-class-component';
import { toDateFormat } from '@/utils/dateHelper';
import { TCategoryOfBody } from '@/controllers/CategoryOfBodyController';

@Component
export default class CategoryOfBodyTable extends mixins(Global, Helper) {
  @Prop(Array) categoryOfBodies!: TCategoryOfBody[];
  @Prop(Boolean) loading!: boolean;

  page = 1;
  headers = [
    { text: '№', value: 'index', sortable: false },
    { text: 'Нименование', value: 'name' },
    { text: 'Краткое наименование', value: 'shortName' },
    { text: 'Код', value: 'value' },
    { text: 'Описание', value: 'decsription' },
    { text: '', value: 'action', sortable: false }
  ]
}

</script>

<style scope lang="scss">
.user-table {
  table {
    min-width: 900px!important;
    tr {
      th {
          min-width: 80px;
          max-width: 100px;
          overflow: hidden;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:last-child {
            min-width: 100px;
          }
      }
    }
  }
}
</style>
