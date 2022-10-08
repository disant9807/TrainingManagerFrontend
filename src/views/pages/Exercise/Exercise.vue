<template>
  <div class="pa-0">
    <v-card class="left-main-container">
      <v-card-title class="darkblue pl-5 py-0">
        <v-icon
          dark
          size="32"
          class="mr-4"
        >
          mdi-playlist-check
        </v-icon>
        <v-subheader class="white--text font-weight-light headerWrap">
          <div class="header">Упражнения</div>
        </v-subheader>
        <v-spacer />
        <v-btn
          color="white"
          outlined
        >Добавить</v-btn>
      </v-card-title>
      <filters
        :route-name="reqState"
        @change="filtersChange"
      />
      <Sorter
        :order.sync="order"
        @change="filtersChange"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Helper from '@/mixins/Helper'
import Global from '@/mixins/GlobalMixin'

import Filters from '../Components/Filters.vue'
import Sorter from '../Components/Sorter.vue'

import { TOrder } from '@/types/globals'

export type TExerciseRouteName = 'New' | 'Handled' | 'Saved';

@Component({
  components: {
    Filters,
    Sorter
  }
})
export default class Exercise extends mixins(Helper, Global) {
  order: TOrder = 'Desc';

  async filtersChange (): Promise<void> {
    /*
    this.isListLoading = true;
    const response = await IncomingController.getRequests(this.filtersModel, this.order);

    if (response.success) {
      this.$set(this.incomings, 'list', response?.data || []);
      this.$set(this.incomings, 'selectedItem', 0);
      this.$set(this.incomings, 'selectedRequest', null);

      await this.onSelectRequest(this.incomings.selectedItem);
    }
    */
  }

  get reqState ():TExerciseRouteName {
    return this.$route.name as string as TExerciseRouteName
  }
}
</script>

<style lang="scss">

</style>
