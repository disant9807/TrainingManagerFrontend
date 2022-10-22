<template>
  <div class="pa-0">
    <v-container class="main-container" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import weightLossMng from '@/views/pages/Components/weightLossMng.vue';
import connectDialog from '@/views/pages/Components/connectDialog.vue';

@Component({
  components: {
  weightLossMng,
  connectDialog
  }
  })
export default class mainPage extends Vue {

}
</script>

<style lang="scss">
@import '~vuetify/src/styles/main.sass';

 .v-divider--vertical {
     border-width: 2px !important;
 }
 .theme--dark.v-divider {
     border-color: black;
 }
 .header {
  font-size: 19px;
  font-weight: 700;
}
.plan {
    position: relative;
    &-content {
        position: relative;
    }
    &-title {
        width: 100%;
        height: 150px;
    }
    &-bg {
        background-color: white;
        top: 25px;
        position: absolute;
        height: 300vh;
        width: 100%;
        max-width: 800px;
        left: calc((100% - 800px)/2);
    }
}
</style>
