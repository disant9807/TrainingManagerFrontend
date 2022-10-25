<template>
  <v-btn
    :color="buttonData.color"
    :type="buttonData.type"

    :width="buttonData.maxHeight"
    :min-width="buttonData.minWidth"
    :max-width="buttonData.maxWidth"
    :height="buttonData.height"
    :min-height="buttonData.width"
    :max-height="buttonData.minHeight"

    :icon="buttonData.isIcon"
    :text="buttonData.isText"
    :depressed="buttonData.isDepressed"
    :elevation="buttonData.isElevation"
    :fab="buttonData.isFab"
    :fixed="buttonData.isFixed"
    :absolute="buttonData.isAbsolute"
    :outlined="buttonData.isOutlined"
    :rounded="buttonData.isRounded"
    :shaped="buttonData.isShaped"
    :tile="buttonData.isTile"
    :ripple="buttonData.ripple"
    :retain-focus-on-click="buttonData.isRetainFocusOnClick"
    :block="buttonData.isBlock"

    :link="buttonData.link"
    :exact="buttonData.exact"
    :href="buttonData.href"
    :replace="buttonData.isReplace"
    :target="buttonData.target"
    :to="buttonData.to"
    v-bind="{
      [buttonData.size]: true,
      [buttonData.alignTo]: true
    }"

    @click="buttonData.onClick"
  >
    <slot>
      <v-icon
        v-if="buttonData.icon"
        :color="buttonData.icon.color"
        class="mr-2"
      >
        {{ buttonData.icon.name }}
      </v-icon>
      {{ buttonData.label }}
    </slot>
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export type TButton = {
  label: string,
  color?: string,
  type?: string,
  minHeight?: string,
  maxHeight?: string,
  height?: string,
  width?: string,
  minWidth?: string,
  maxWidth?: string,
  size?: 'x-small' | 'small' | 'large' | 'x-large' | '',
  icon?: {
    name: string,
    color?: string,
  },

  isIcon?: boolean,
  isText?: boolean,
  isDepressed?: boolean,
  isElevation?: boolean,
  isFab?: boolean,
  isFixed?: boolean,
  isAbsolute?: boolean,
  alignTo?: 'left' | 'top' | 'bottom' | 'right',
  isOutlined?: boolean,
  isRounded?: boolean,
  isShaped?: boolean,
  isTile?: boolean,
  ripple?: boolean | Record<string, any>,
  isRetainFocusOnClick?: boolean,
  isBlock?: boolean,

  isLink?: boolean,
  isExact?: boolean,
  isReplace?: boolean,
  target?: string,
  href?: string | Record<string, any>,
  to?: string | Record<string, any>,

  onClick?: (e: any) => void,
}

@Component
export default class CustomButton extends Vue {
  @Prop({
    type: Object,
    default: {
      label: '',
      color: '',
      type: 'button',

      isIcon: false,
      isText: false,
      isDepressed: false,
      isElevation: false,
      isFab: false,
      isFixed: false,
      isAbsolute: false,
      isOutlined: false,
      isRounded: false,
      isShaped: false,
      isTile: false,
      isRipple: false,
      isRetainFocusOnClick: false,
      isBlock: false,

      isLink: false,
      isExact: false,
      isReplace: false,
    }
  }) readonly buttonData!: TButton;
}
</script>
