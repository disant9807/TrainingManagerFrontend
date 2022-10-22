<template>
  <container>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-row>
        <v-col cols="6">
          <inline-text-field
            label="Вес"
            :value.sync="weight"
            :rules="[rules.required, rules.number]"
          />
          <InlineAutocompleteField
            v-if="finish === `down`"
            label="Интенсивность похудения"
            :items="minusValueList"
            :value.sync="minusValue"
            :rules="[rules.required]"
          />
          <InlineAutocompleteField
            v-if="finish === `up`"
            label="Интенсивность тренировок"
            :items="plusValueList"
            :value.sync="plusValue"
            :rules="[rules.required]"
          />
          <InlineAutocompleteField
            label="Цель"
            :items="finishList"
            :value.sync="finish"
            :rules="[rules.required]"
          />
        </v-col>
        <v-col cols="6">
          <inline-text-field
            label="Рост"
            :value.sync="height"
            :rules="[rules.required, rules.number]"
          />
          <inline-text-field
            label="Ваш возраст"
            :value.sync="age"
            :rules="[rules.required, rules.number]"
          />
          <inline-radio-buttons-field
            :objects="sex"
            :selected.sync="isSexMan"
          />
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col cols="12">
          <div class="text-h6 font-weight-bold text-center">График изменения массы по неделям</div>
          <v-sheet
            class="v-sheet--offset mt-6 ml-auto rounded-lg"
            color="cyan"
            elevation="12"
          >
            <v-sparkline
              :show-labels="true"
              :labels="labels"
              :value="value"
              color="white"
              line-width="2"
              padding="16"
              label-size="5"
              smooth="8"
            />
          </v-sheet>
        </v-col>
      </v-row>
    </v-form>
  </container>
</template>
<script lang="ts">
import Global from '@/mixins/GlobalMixin';
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineTextField from '@/components/InlineTextField.vue';
import { TVuetifyOptionsList } from '@/types/globals';

@Component({
  components: {
  InlineAutocompleteField,
  InlineRadioButtonsField,
  InlineTextField
  }
  })

export default class weightLossMng extends Global {
     @Ref('form') readonly form!: any;

    weight: string | null | number = '80';
    height: string | null | number = '175';
    age: string | null | number = '25';
    isSexMan: boolean | null = true;
    finish: string | null = 'down';
    minusValue: string | null = 'medium';
    plusValue: string | null = 'medium';

    get sex() {
      return [
        { value: true, text: 'Мужской' },
        { value: false, text: 'Женский' }
      ];
    }

    get finishList(): TVuetifyOptionsList[] {
      return [
        {
          text: 'Снижение веса',
          value: 'down'
        },
        {
          text: 'Набор массы',
          value: 'up'
        }
      ];
    }

    get minusValueList(): TVuetifyOptionsList[] {
      return [
        {
          text: 'Средняя',
          value: 'medium'
        },
        {
          text: 'Сильная',
          value: 'hard'
        }
      ];
    }

    get plusValueList(): TVuetifyOptionsList[] {
      return [
        {
          text: 'Средняя',
          value: 'medium'
        },
        {
          text: 'Сильная',
          value: 'hard'
        }
      ];
    }

    async mounted() {
      this.generateGraf();
    }

    @Watch('weight')
    @Watch('height')
    @Watch('age')
    @Watch('isSexMan')
    @Watch('finish')
    @Watch('minusValue')
    @Watch('plusValue')
    generateGraf() {
      if (!this.form.validate()) {
        return;
      }

      if (this.finish === 'down') {
        this.generateGrafMinus();
      } else if (this.finish === 'up') {
        this.generateGrafPlus();
      }
    }

    generateGrafMinus() {
      const calloreisNormalize = this.isSexMan
        ? 10 * (this.weight as number ?? 0) + 6.25 * (this.height as number ?? 0) - 5 * (this.age as number ?? 0) + 5
        : 10 * (this.weight as number ?? 0) + 6.25 * (this.height as number ?? 0) - 5 * (this.age as number ?? 0) - 161;

      const minusCall = calloreisNormalize - calloreisNormalize * (this.minusValue === 'hard' ? 0.7 : 0.9);

      const minusCallWeek = minusCall * 7;
      const gramms = minusCallWeek * 1000 / 3500;

      this.value = this.labels.map((item, index) => {
        return ((this.weight as number ?? 0) - (gramms / 1000) * (index + 1)) - Math.pow((index + 1) * 2, 1 / 2) * (-0.2);
      });

      this.labels = this.value.map(item => {
        return `${item.toFixed(2)} кг`;
      });
    }

    generateGrafPlus() {
      let speedUp = 500;
      if ((this.age ?? 0) < 15) speedUp = this.plusValue === 'medium' ? 100 : 200;
      else if ((this.age ?? 0) >= 15 && (this.age ?? 0) < 25) speedUp = this.plusValue === 'medium' ? 500 : 600;
      else if ((this.age ?? 0) >= 25 && (this.age ?? 0) < 35) speedUp = this.plusValue === 'medium' ? 400 : 500;
      else if ((this.age ?? 0) >= 35 && (this.age ?? 0) < 50) speedUp = this.plusValue === 'medium' ? 300 : 400;
      else if ((this.age ?? 0) >= 50) speedUp = this.plusValue === 'medium' ? 200 : 350;

      this.value = this.labels.map((item, index) => {
        return 1 * (this.weight as number ?? 0) + ((speedUp / 1000) * (index + 1)) + Math.pow((index + 1), 1 / 2) / (0.7) - 1.5;
      });

      this.labels = this.value.map(item => {
        return `${item.toFixed(2)} кг`;
      });
    }

    clearGraf() {
      this.value = [
        80,
        80,
        80,
        80,
        80,
        80,
        80,
        80
      ];
    }

    labels = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8'
    ];

    value = [
      80,
      80,
      80,
      80,
      80,
      80,
      80,
      80
    ];
}

</script>
