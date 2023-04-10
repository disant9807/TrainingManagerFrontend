<template>
  <v-btn
    text
    class="mr-2"
    :color="color"
    :disabled="disabled"
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
export default class ControlButton extends Vue {
  @Prop({ type: String, default: '' }) readonly text!: string;
  @Prop({ type: String, default: '' }) readonly icon!: string;
  @Prop({ type: String, default: 'darkblue' }) readonly color!: string;
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;

  click(): void {
    this.$emit('onClick');
  }
}
</script>
