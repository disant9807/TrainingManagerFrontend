<template>
  <v-data-table
    :loading="loading"
    :loading-text="'загрузка'"
    :headers="headers"
    :items="users"
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
      v-if="!!users"
      v-slot:body="{ items }"
    >
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="item.id"
        >
          <td> {{ index + 1 }}</td>
          <td> {{ item.id }} </td>
          <td> {{ item.surname + ' ' + item.firstName + ' ' + item.middleName }} </td>
          <td> {{ item.email }} </td>
          <td> {{ toLocalDate(item.certificateFrom) }}</td>
          <td> {{ toLocalDate(item.certificateTo) }}</td>
          <td> {{ item.organization }} </td>
          <td> {{ item.department }} </td>
          <td> {{ toLocalDate(item.createdDatetime) }} </td>
          <td>
            <v-simple-checkbox
              v-model="item.blocked"
              disabled
            />
          </td>
          <td>
            <v-simple-checkbox
              v-model="item.archive"
              disabled
            />
          </td>
          <td>
            <v-simple-checkbox
              v-model="item.fromAD"
              disabled
            />
          </td>
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
            <v-icon
              v-else
              small
              color="darkblue"
              class="mr-2"
              @click="$emit('restore', item)"
            >
              mdi-restore
            </v-icon>
            <v-icon
              v-if="item.blocked"
              small
              color="darkblue"
              class="mr-2"
              @click="$emit('unblock', item)"
            >
              mdi-lock-open-variant
            </v-icon>
            <v-icon
              v-else
              small
              color="darkblue"
              class="mr-2"
              @click="$emit('block', item)"
            >
              mdi-lock
            </v-icon>
            <v-icon
              small
              color="darkblue"
              @click="copy(item)"
            >
              mdi-content-copy
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
import { TUser } from '@/controllers/UserController';

@Component
export default class UserGuideTable extends mixins(Global, Helper) {
  @Prop(Array) users!: TUser[];
  @Prop(Boolean) loading!: boolean;

  page = 1;
  headers = [
    { text: '№', value: 'index', sortable: false },
    { text: "Идентификатор", value: 'id' },
    { text: "Имя", value: 'firstName' },
    { text: "Почта", value: 'email' },
    { text: 'Дата создания', value: 'createdDatetime' },
    { text: 'Заблокирован', value: 'blocked', align: 'center' },
    { text: "Архивный", value: 'archive', align: 'center' },
    { text: '', value: 'action', sortable: false }
  ]

  toLocalDate(date: string | Date) {
    return toDateFormat(date, null);
  }
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
