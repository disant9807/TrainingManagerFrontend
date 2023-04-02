<template>
  <div>
    <v-list
      subheader
      two-line
      flat
    >
      <v-subheader>Группы мышц</v-subheader>

      <v-list-item-group
        v-if="CategoryOfBodies"
        v-model="selectedItems"
        :multiple="multiple"
      >
        <v-list-item v-for="item in CategoryOfBodies">
          <template v-slot:default="{ active, }">
            <v-list-item-action>
              <v-checkbox
                :input-value="selectedCategoryOfBody?.some(e => e.code === item.code)"
                color="primary"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title v-if="item.shortName">{{ item.shortName }}</v-list-item-title>
              <v-list-item-title v-else="item.name">{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.decsription }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
      <v-list-item v-else>
        <v-list-item-content>
          <v-list-item-title>Список мышечных групп пуст</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <Loader :value="loading" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Watch } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import { mixins } from 'vue-class-component';
import Loader from '@/components/Loader.vue';
import { TCategoryOfBody } from '@/controllers/CategoryOfBodyController';

@Component({
  components: {
  Loader
  }
})
export default class SelectCategoryOfBody extends mixins(Global) {
  @Prop(Boolean) loading!: boolean;
  @Prop(Array) CategoryOfBodies!: TCategoryOfBody[] | null;
  @PropSync('selected') selectedCategoryOfBody!: TCategoryOfBody[] | null;
  @Prop({
    type: Boolean,
    default: true
  }) readonly multiple!: boolean;

  get selectedItems() {
    let selecteds: number[] = [];

    this.CategoryOfBodies?.forEach((e, inx) => {
      if (this.selectedCategoryOfBody?.some(z => z.code === e.code)) {
        selecteds.push(inx);
      }
    });

    return selecteds;
  }

  set selectedItems(values: number[] | number) {
    if (this.CategoryOfBodies !== null && values instanceof Array) {
      this.selectedCategoryOfBody = (values as number[])
        .map(e => (this.CategoryOfBodies as TCategoryOfBody[])[e]) ?? [];
    } else if (this.CategoryOfBodies !== null) {
      this.selectedCategoryOfBody = [(this.CategoryOfBodies as TCategoryOfBody[])[values as number]];
    }
  }
}
</script>
