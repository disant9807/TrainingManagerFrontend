<template>
  <v-container v-if="localSize">
    <v-row class="hover">
      <v-col>Замер</v-col>
      <v-col>
        {{ localSize.name }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Дата замера</v-col>
      <v-col>
        {{ localeDateFormat(localSize.createdDate, false) }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>
        <h3>Замеры</h3>
        <v-list class="mt-1">
          <template v-if="items.length > 0">
            <v-container
              v-for="item, index in items"
              :key="index"
            >
              <v-row dense>
                <v-col>
                  <v-card>
                    <v-card-title class="text-h5">
                      Замер: {{ item.bodyCode }}
                    </v-card-title>
                    <v-card-subtitle>{{ item.bodyCode }} имеет размер {{ item.value }} {{ item.codeUnitsOfMeasurement }}</v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title>Список замеров пуст</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Helper from '@/mixins/Helper';
import { Component, Prop, Watch, Model } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { TSize, TSizeItem } from '@/controllers/SizeController';

@Component
export default class SizeInfo
 extends mixins(Helper) {
  @Prop({
    type: Object,
    default: null
  }) readonly request!: TSize | null;

  get localSize(): TSize | null | undefined {
    return this.request;
  }

  get items(): TSizeItem[] | [] {
    return this.localSize?.sizeItems ?? [];
  }
}
</script>
<style lang="scss" scoped>
.hover:hover {
  background-color: #e2eff7;
}
</style>
