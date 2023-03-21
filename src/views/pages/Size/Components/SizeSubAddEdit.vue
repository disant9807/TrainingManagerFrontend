<template>
  <v-row>
    <v-col>
      <InlineTextField
        label="Часть тела*"
        :value.sync="view.name"
        :rules="[rules.required]"
      />
      <InlineTextField
        label="Измерение*"
        :value.sync="view.shortName"
        :rules="[rules.required]"
      />
      <InlineTextField
        label="Единица измерения"
        :value.sync="view.shortName"
        :rules="[rules.required]"
      />
    </v-col>
    <v-col>
      <InlineTextField
        label="В разработке, Фото"
        :value.sync="view.description"
      />
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Prop, Ref, Watch } from 'vue-property-decorator';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineCheckField from '@/components/InlineCheckField.vue';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import Global from '@/mixins/GlobalMixin';
import ExerciseController, { TExercise, HardSkill } from '@/controllers/ExerciseController';
import { Mutation, State } from 'vuex-class';
import Loader from '@/components/Loader.vue';

@Component({
  components: {
  InlineTextField,
  InlineAutocompleteField,
  InlineCheckField,
  InlineRadioButtonsField,
  InlineSliderField,
  Loader
  }
  })
export default class SizeSubAddEdit extends Global {

}

</script>
