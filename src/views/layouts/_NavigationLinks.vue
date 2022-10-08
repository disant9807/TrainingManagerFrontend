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
            <div v-if="item.id === 1" class="ml-2 d-flex">(<div class="value">{{ incomeCount.new+incomeCount.handled+incomeCount.saved }}</div>)</div>
            <div v-if="item.id === 2" class="ml-2 d-flex">(<div class="value">{{ incomeCount.new }}</div>)</div>
            <div v-else-if="item.id === 3" class="ml-2 d-flex">(<div class="value">{{ incomeCount.handled }}</div>)</div>
            <div v-else-if="item.id === 4" class="ml-2 d-flex">(<div class="value">{{ outcomeCount.sent+outcomeCount.answered+outcomeCount.created }}</div>)</div>
            <div v-else-if="item.id === 5" class="ml-2 d-flex">(<div class="value">{{ outcomeCount.sent }}</div>)</div>
            <div v-else-if="item.id === 6" class="ml-2 d-flex">(<div class="value">{{ outcomeCount.answered }}</div>)</div>
            <div v-else></div>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- <hr>
      <v-list-item
        class="nav-item"
        link
        color="darkbluetext"
        :to="{ name: 'Development' }"
      >
        <v-list-item-icon>
          <v-icon color="darkbluelinks">mdi-wrench</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="huge">
            РАЗРАБОТКА
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
    </template>
  </v-list>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

type TMenuItem = {
  id: number;
  title: string;
  isHuge?: boolean;
  icon?: string;
  pathName: string;
}

const COUNTERS_UPDATE_COOLDOWN = 60 // секунд

@Component
export default class NavigationLinks extends Vue {
  @Prop({ type: Boolean }) readonly isDrawerMini!: boolean;

  incomeCount = {
    new: 0,
    handled: 0,
    saved: 0
  };

  outcomeCount = {
    sent: 0,
    created: 0,
    answered: 0
  }

  gisGmpCount = {
    requestedNotApproved: 0,
    requestApproved: 0,
    payed: 0,
    archived: 0,
    saved: 0
  }

  fgisdoCount = 0

  items: TMenuItem[] = [
    // { id: 1, title: 'Тренировки', isHuge: true, icon: 'mdi-weight-lifter', pathName: 'Exercise' },
    { id: 2, title: 'Упражнения', isHuge: true, icon: 'mdi-dumbbell', pathName: 'Exercise' }
    // { id: 3, title: 'Тренировочные программы', isHuge: true, icon: 'mdi-book-open', pathName: 'Exercise' },
    // { id: 4, title: 'Цели', isHuge: true, icon: 'mdi-cloud-download', pathName: 'Exercise' },
    // { id: 5, title: 'Замеры', isHuge: true, icon: 'mdi-cloud-upload', pathName: 'Exercise' },
    // { id: 6, title: 'Статистика', isHuge: true, icon: 'mdi-cloud-download', pathName: 'Exercise' }
  ];

  interval: any;

  get itemsMini (): TMenuItem[] {
    return this.items.filter((value: TMenuItem) => value.isHuge)
  }

  /*
  async updateCounters(): Promise<void> {
    await Promise.all([
      this.setCount(this.incomeCount, 'handled', () => this.$api.getNewIncomingCountServices('Handled')),
      this.setCount(this.incomeCount, 'new', () => this.$api.getNewIncomingCountServices('New')),
      this.setCount(this.incomeCount, 'saved', () => this.$api.getNewIncomingCountServices('Saved')),
      this.setCount(this.outcomeCount, 'created', () => this.$api.getSavedRequestsCountServices('Created')),
      this.setCount(this.outcomeCount, 'sent', () => this.$api.getSavedRequestsCountServices('Sent')),
      this.setCount(this.outcomeCount, 'answered', () => this.$api.getSavedRequestsCountServices('Answered')),
      this.setCount(this.gisGmpCount, 'requestedNotApproved', () => this.$gisgmpapi.getGisgmpCount('RequestedNotApproved')),
      this.setCount(this.gisGmpCount, 'requestApproved', () => this.$gisgmpapi.getGisgmpCount('RequestApproved')),
      this.setCount(this.gisGmpCount, 'payed', () => this.$gisgmpapi.getGisgmpCount('Payed')),
      this.setCount(this.gisGmpCount, 'saved', () => this.$gisgmpapi.getGisgmpCountSaved()),
      this.setCount(this, 'fgisdoCount', () => this.$api.getFgisdoCount()),
      this.setCount(this.gisGmpCount, 'archived', () => this.$gisgmpapi.getGisgmpCountArchived()),
    ]);
  }
  */

  async setCount (object:any, propName: string, callback: () => Promise<any>): Promise<void> {
    const response = await callback()
    if (Array.isArray(response)) {
      const sum = response
        .filter(r => r.success)
        .reduce((acc, cur) => acc + cur.data, 0)
      this.$set(object, propName, sum)
    } else {
      if (response.success) {
        this.$set(object, propName, response.data)
      } else {
        this.$set(object, propName, 0)
      }
    }
  }

  @Watch('$route')
  async onRouteChanged (): Promise<void> {
    // await this.updateCounters();
  }

  async created (): Promise<void> {
    // await this.updateCounters();
    this.interval = setInterval(async () => {
      // await this.updateCounters();
    }, COUNTERS_UPDATE_COOLDOWN * 1000)
  }

  async destroy (): Promise<void> {
    clearInterval(this.interval)
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
