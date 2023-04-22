<template>
  <div>
    <v-list
      subheader
      two-line
      flat
    >
      <v-subheader>Единицы измерения</v-subheader>

      <v-list-item-group
        v-if="unitsOfMeasurement"
        v-model="selectedItems"
        :multiple="multiple"
      >
        <v-list-item v-for="item in unitsOfMeasurement">
          <template v-slot:default="{ active, }">
            <v-list-item-action>
              <v-checkbox
                :input-value="selectedUnitsOfMeasurement?.some(e => e.code === item.code)"
                color="primary"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ item.value }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.code }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
      <v-list-item v-else>
        <v-list-item-content>
          <v-list-item-title>Список единиц измерения пуст</v-list-item-title>
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
import { TUnitsOfMeasurement } from '@/controllers/UnitsOfMeasurementController';

@Component({
  components: {
  Loader
  }
})
export default class SelectUnitsOfMeasurements extends mixins(Global) {
  @Prop(Boolean) loading!: boolean;
  @Prop(Array) unitsOfMeasurement!: TUnitsOfMeasurement[] | null;
  @PropSync('selected') selectedUnitsOfMeasurement!: TUnitsOfMeasurement[] | null;
  @Prop({
    type: Boolean,
    default: true
  }) readonly multiple!: boolean;

  get selectedItems() {
    let selecteds: number[] = [];

    this.unitsOfMeasurement?.forEach((e, inx) => {
      if (this.selectedUnitsOfMeasurement?.some(z => z.code === e.code)) {
        selecteds.push(inx);
      }
    });

    return selecteds;
  }

  set selectedItems(values: number[] | number) {
    if (this.unitsOfMeasurement !== null && values instanceof Array) {
      this.selectedUnitsOfMeasurement = (values as number[])
        .map(e => (this.unitsOfMeasurement as TUnitsOfMeasurement[])[e]) ?? [];
    } else if (this.unitsOfMeasurement !== null) {
      this.selectedUnitsOfMeasurement = [(this.unitsOfMeasurement as TUnitsOfMeasurement[])[values as number]];
    }
  }
}
</script>
