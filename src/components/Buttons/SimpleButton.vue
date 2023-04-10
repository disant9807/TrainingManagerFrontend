<template>
  <v-btn
    class="mr-2"
    tile
    small
    depressed
    :color="color"
    :disabled="disabled"
    :class="classes"
    @click="click"
  >
    <v-icon class="mr-2">
      {{ `mdi-${icon}` }}
    </v-icon>
    {{ text }}
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SimpleButton extends Vue {
  @Prop({ type: String, default: '' }) readonly text!: string;
  @Prop({ type: String, default: '' }) readonly icon!: string;
  @Prop({ type: String, default: '' }) readonly color!: string;
  @Prop({ type: String, default: '' }) readonly classes!: string;
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;

  click(): void {
    this.$emit('onClick');
  }
}
</script>
