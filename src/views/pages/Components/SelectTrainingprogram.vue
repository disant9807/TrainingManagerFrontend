<template>
  <div>
    <v-list
      subheader
      two-line
      flat
    >
      <v-subheader>Выбор Тренировочных программ</v-subheader>

      <v-list-item-group
        v-if="trainingPrograms"
        v-model="selectedItems"
        :multiple="multiple"
      >
        <v-list-item v-for="item in trainingPrograms">
          <template v-slot:default="{ active, }">
            <v-list-item-action>
              <v-checkbox
                :input-value="selectedTrainingPrograms?.some(e => e.id === item.id)"
                color="primary"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title v-if="item.shortName">{{ item.shortName }}</v-list-item-title>
              <v-list-item-title v-else="item.name">{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
      <v-list-item v-else>
        <v-list-item-content>
          <v-list-item-title>Список упражнений пусть пуст</v-list-item-title>
          <v-list-item-subtitle>Нажмите кнопку "Добавить" для добавления упражнения в справочник упражнений</v-list-item-subtitle>
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
import { TTrainingProgram } from '@/controllers/TrainingProgramController';

export type userOrg = {
  title: boolean,
  id: string,
  name: string,
  email: string,
  isArchive: boolean
}

@Component({
  components: {
  Loader
  }
})
export default class SelectTrainingProgram extends mixins(Global) {
  @Prop(Boolean) loading!: boolean;
  @Prop(Array) trainingPrograms!: TTrainingProgram[] | null;
  @PropSync('selected') selectedTrainingPrograms!: TTrainingProgram[] | null;
  @Prop({
    type: Boolean,
    default: true
  }) readonly multiple!: boolean;

  get selectedItems() {
    let selecteds: number[] = [];

    this.trainingPrograms?.forEach((e, inx) => {
      if (this.selectedTrainingPrograms?.some(z => z.id === e.id)) {
        selecteds.push(inx);
      }
    });

    return selecteds;
  }

  set selectedItems(values: number[] | number) {
    if (this.trainingPrograms !== null && values instanceof Array) {
      this.selectedTrainingPrograms = (values as number[])
        .map(e => (this.trainingPrograms as TTrainingProgram[])[e]) ?? [];
    } else if (this.trainingPrograms !== null) {
      this.selectedTrainingPrograms = [(this.trainingPrograms as TTrainingProgram[])[values as number]];
    }
  }
}
</script>
