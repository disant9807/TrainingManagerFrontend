<template>
  <v-card>
    <v-card-title class="text-h5">
      <v-icon color="white" large class="mr-2">mdi-cog-outline</v-icon>
      Настройки
    </v-card-title>
    <v-card-text>
      <v-row class="pa-5">
        <v-col>
          <v-list class="mb-5" flat>
            <v-subheader class="mb-4">
              <span class="text-h6">Справочники</span>
            </v-subheader>
            <v-list-item
              v-for="(item, i) in spravochniki"
              :key="i"
              link
              :to="{ name: item.pathName }"
            >
              <v-list-item-icon>
                <v-icon>mdi-chevron-right</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {
  spravochniki = [
    { text: 'Единицы измерения', pathName: 'Units' },
    { text: 'Показатели', pathName: 'CategoryOfBody' },
    { text: 'Пользователи', pathName: 'UserGuide' },
  ]
}
</script>

<style lang="scss" scoped>
.v-list-item__title {
  color: var(--v-primary-base);
}
.v-card__title {
  background-color: #0f5987;
  color: white;
}
.v-subheader {
  height: fit-content;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
