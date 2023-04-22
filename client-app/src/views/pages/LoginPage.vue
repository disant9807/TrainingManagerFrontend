<template>
  <v-layout row wrap fill-height align-center class="layoutEmpty">
    <v-row no-gutters>
      <v-col md="10" class="loginColumn">
        <LoginBlock @logged="forward" />
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import LoginBlock from '@/views/layouts/EmptyLayout/_LoginBlock.vue';

@Component({ components: { LoginBlock } })
export default class LoginPage extends Vue {
  forward() {
    if (this.$route.params.nextUrl) {
      this.$router.push({ path: this.$route.params.nextUrl }, undefined, (e) => {
        // Для устранения ошибки: Redirected when going from "/login" to "/" via a navigation guard.
      });
    } else {
      this.$router.push({ name: 'Home' }, undefined, (e) => {
        // Для устранения ошибки: Redirected when going from "/login" to "/" via a navigation guard.
      });
    }
  }
}
</script>

<style lang="scss">
.layoutEmpty {
  display: inline-flex!important;
  max-width: 800px !important;
  min-width: 600px !important;
}
.loginColumn {
  display: inline-block;
  margin: 0 auto; 
  max-width: 470px;
}
</style>
