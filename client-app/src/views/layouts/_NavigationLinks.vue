<template>
  <v-list dense>
    <template v-if="isDrawerMini">
      <v-list-item
        v-for="item in itemsMini"
        :key="item.id"
        class="nav-item nav-item--mini"
        link
        exact
        color="darkbluetext"
        :to="{ name: item.pathName }"
      >
        <v-list-item-content class="justify-center px-2">
          <v-icon color="darkbluelinks" x-large>{{ item.icon }}</v-icon>
          <div class="text-center">{{ item.title }}</div>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-else>
      <v-list-item
        v-for="item in items"
        :key="item.id"
        class="nav-item"
        link
        color="darkbluetext"
        :to="{ name: item.pathName }"
      >
        <v-list-item-icon>
          <v-icon color="darkbluelinks">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title :class="{'huge': item.isHuge}">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

type TMenuItem = {
  id: number;
  title: string;
  isHuge?: boolean;
  icon?: string;
  pathName: string;
}

const COUNTERS_UPDATE_COOLDOWN = 60; // секунд

@Component
export default class NavigationLinks extends Vue {
  @Prop({ type: Boolean }) readonly isDrawerMini!: boolean;

  fgisdoCount = 0

  items: TMenuItem[] = [
    { id: 1, title: 'Тренировки', isHuge: true, icon: 'mdi-weight-lifter', pathName: 'Training' },
    { id: 2, title: 'Упражнения', isHuge: true, icon: 'mdi-dumbbell', pathName: 'Exercise' },
    { id: 3, title: 'Тренировочные программы', isHuge: true, icon: 'mdi-book', pathName: 'TrainingProgram' },
    { id: 4, title: 'Цели', isHuge: true, icon: 'mdi-flag-checkered', pathName: 'Goal' },
    { id: 5, title: 'Замеры', isHuge: true, icon: 'mdi-ruler', pathName: 'Size' },
    { id: 6, title: 'Статистика', isHuge: true, icon: 'mdi-chart-bell-curve-cumulative', pathName: 'Statistics'},
    { id: 7, title: 'Настройки', isHuge: true, icon: 'mdi-cog-outline', pathName: 'Settings' },
    // { id: 6, title: 'Статистика', isHuge: true, icon: 'mdi-cloud-download', pathName: 'Exercise' }
  ];

  interval: any;

  get itemsMini(): TMenuItem[] {
    return this.items.filter((value: TMenuItem) => value.isHuge);
  }


  @Watch('$route')
  async onRouteChanged(): Promise<void> {
    // await this.updateCounters();
  }

  async created(): Promise<void> {
    // await this.updateCounters();
    this.interval = setInterval(async () => {
      // await this.updateCounters();
    }, COUNTERS_UPDATE_COOLDOWN * 1000);
  }

  async destroy(): Promise<void> {
    clearInterval(this.interval);
  }
}
</script>

<style lang="scss" scoped>
.nav-item {
  .v-list-item__title {
    font-size: 14px !important;
    font-weight: 400 !important;
    color: var(--v-darkbluetext-base);
    white-space: inherit;
    display: flex;
    &.huge {
      font-size: 16px !important;
      font-weight: 700 !important;
      color: var(--v-darkbluelinks-base);
    }
  }
  &.nav-item--mini {
    padding: 0;
    i:hover {
      color: var(--v-menuAccent-base) !important;
    }
    .v-list-item__content {
      font-size: 8px;
      font-weight: bold;
      color: var(--v-menuAccent-base);
    }
  }
}

.value {
  color: white;
}

hr {
  border: none;
  margin: 20px;
  border-top: 1px solid var(--v-menuAccent-base);
  opacity: 0.2;
}
</style>
