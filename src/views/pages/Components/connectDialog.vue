<template>
    <div>
            <v-snackbar
            v-model="snackbar"
            >
            {{ textError }}
            <template v-slot:action="{ attrs }">
                <v-btn
                color="pink"
                text
                v-bind="attrs"
                @click="snackbar = false"
                >
                Закрыть
                </v-btn>
            </template>
            </v-snackbar>
        <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
        >
            <template v-slot:activator="{ on, attrs }">
            <v-btn
            color="darkblue"
            text
            v-bind="attrs"
            v-on="on"
            >
            Записаться
            </v-btn>
        </template>

            <v-card>
            <v-card-title>
            <span class="text-h5">Форма записи</span>
            </v-card-title>
            <v-card-text>
                <v-form
                    ref="form"
                    lazy-validation
                >
                    <v-container>
                        <v-row>
                        <v-col
                            cols="12"
                            sm="8"
                            md="6"
                        >
                            <inline-text-field
                                label="Телефон"
                                :value.sync="phone"
                                :rules="[rules.phone]"
                            />
                        </v-col>
                        <v-col
                            cols="12"
                            sm="8"
                            md="6"
                        >
                            <inline-text-field
                                label="Почта"
                                :value.sync="email"
                                :rules="[rules.email]"
                            />
                        </v-col>
                        <v-col cols="12">
                            <inline-text-field
                                label="Телеграм"
                                :value.sync="tlgrm"
                            />
                        </v-col>
                        <v-col cols="12">
                            <inline-text-field
                                label="VK Id"
                                :value.sync="vkId"
                            />
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <inline-text-field
                                label="Имя*"
                                :value.sync="name"
                                :rules="[rules.required]"
                            />
                        </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
            >
                Отмена
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="sendData"
            >
                Записаться
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
</template>
<script lang="ts">
import Global from '@/mixins/GlobalMixin'
import { Component, Ref } from 'vue-property-decorator'
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue'
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue'
import InlineTextField from '@/components/InlineTextField.vue'
import { TVuetifyOptionsList } from '@/types/globals'

@Component({
  components: {
    InlineAutocompleteField,
    InlineRadioButtonsField,
    InlineTextField
  }
})

export default class connectDialog extends Global {
    @Ref('form') readonly form!: any;

    phone: string | null = '';
    email: string | null = '';
    tlgrm: string | null = '';
    vkId: string | null = '';
    name: string | null = '';

    dialog = false;

    snackbar = false;
    textError = `Для отправки формы необходимо заполнить одно из полей.
    (Телефон, Email, Телеграм, VK ID)`;

    sendData () {
      if (!this.form.validate()) {
        return
      }
      if (
            this.phone?.length === 0 ||
            this.email?.length === 0 ||
            this.tlgrm?.length === 0 ||
            this.vkId?.length === 0
      ) {
        this.snackbar = true
        return
      }

      this.dialog = false
    }
}
</script>
