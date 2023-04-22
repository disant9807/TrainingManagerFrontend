<template>
  <v-app>
    <v-app-bar
      app
      dark
      clipped-left
      color="#005987"
      flat
    >
      <v-app-bar-title>Менеджер тренировок</v-app-bar-title>
      <v-spacer />
      <v-btn color="white" outlined @click="logout">
        <v-icon class="mr-3">mdi-account</v-icon>
        Выйти
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      :mini-variant="isMini"
      mini-variant-width="72"
      app
      color="darkblue"
      class="navmenu"
      :class="{'open': !isMini}"
      clipped
      tag="aside"
      disable-resize-watcher
      disable-route-watcher
      mobile-breakpoint="0"
    >
      <div :class="{'toggler': true, 'open': !isMini}">
        <v-btn
          color="darkblue"
          fab
          icon
          class="drawer-toggle"
          @click="isMini = !isMini"
        >
          <v-icon color="menuAccent" :class="{'open': !isMini}"> mdi-arrow-right </v-icon>
        </v-btn>
      </div>
      <navigation-links :is-drawer-mini="isMini" />
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="px-12 pt-5 pb-12">
        <Snackbar />
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import NavigationLinks from './_NavigationLinks.vue';
import Snackbar from '@/components/snackbar/SnackBar.vue';
import AuthController from '@/controllers/Auth';

@Component({
  components: { NavigationLinks, Snackbar }
  })
export default class BaseLayout extends Vue {
  @State readonly isDrawerMini!: boolean;
  @Mutation('setDrawerstate') setDrawerstate!: (newState: boolean) => void;

  currYear = new Date().getFullYear();

  get isMini(): boolean {
    return this.isDrawerMini;
  }

  set isMini(value: boolean) {
    this.setDrawerstate(value);
  }

  async logout() {
    await AuthController.logout();
    this.$router.push('/login');
  }
}
</script>

<style lang="scss">
.navmenu {
  width: 200px;
  padding-top: 30px;
  overflow: visible;
  &.open {
    padding-top: 0;
  }
}
.toggler {
  z-index: 10;
  border-radius: 50%;
  border: 3px solid var(--v-darkblue-base);
  position: fixed;
  left: 33px;
  top: 10px;
  transition: all 0.15s ease-in-out;
  &.open {
    left: 230px !important;
  }
  .drawer-toggle {
    z-index: 10;
    background: var(--v-darkblue-base);
    width: 40px !important;
    height: 40px !important;
    border: 3px solid var(--v-menuAccent-base);
    transition: all 0.15s ease-in-out;
    i {
      transition: all 0.15s ease-in-out;
      &.open {
        transform: rotate(180deg);
      }
    }
  }
}

footer * {
  a {
    text-decoration: none;
  }
  font-size: 13px;
  font-weight: 400;
  color: var(--v-menuAccent-base);
}
</style>
