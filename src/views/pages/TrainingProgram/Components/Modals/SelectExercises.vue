<template>
  <div>
    <v-list
      subheader
      two-line
      flat
    >
      <v-subheader>Выбор упражнений</v-subheader>

      <v-list-item-group
        v-model="selectedItems"
        multiple
      >
        <v-list-item v-for="item in exercises">
          <template v-slot:default="{ active, }">
            <v-list-item-action>
              <v-checkbox
                :input-value="active"
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
    </v-list>
    <Loader :value="loading" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Watch } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import { mixins } from 'vue-class-component';
import Loader from '@/components/Loader.vue';
import { TExercise } from '@/controllers/ExerciseController';

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
export default class SelectExercises extends mixins(Global) {
  @Prop(Boolean) loading!: boolean;
  @Prop(Array) exercises!: TExercise[];
  @PropSync('selected') selectedExercise!: TExercise[] | null;

  get selectedItems() {
    let selecteds: number[] = [];

    this.exercises.forEach((e, inx) => {
      if (this.selectedExercise?.some(z => z.id === e.id)) {
        selecteds.push(inx);
      }
    });

    return selecteds;
  }

  set selectedItems(values: number[]) {
    this.selectedExercise = values?.map(e => this.exercises[e]) ?? [];
  }
}
</script>
