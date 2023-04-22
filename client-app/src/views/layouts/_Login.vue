<template>
  <v-dialog
    v-model="isOpen"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title class="login-header">
        <v-icon color="white" class="mr-2">mdi-login</v-icon>
        <span class="headline">Авторизация</span>
        <v-spacer />
        <v-icon
          color="white"
          class="mr-2"
          @click="isOpen = false"
        >
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-container class="pb-0 pt-7">
          <v-form>
            <v-row>
              <div class="pt-7">
                <v-icon>mdi-account</v-icon>
              </div>
              <v-col class="py-0 pt-2">
                <v-text-field
                  name="username"
                  label="Имя пользователя"
                  filled
                />
              </v-col>
            </v-row>
            <v-row>
              <div class="pt-7">
                <v-icon>mdi-key-variant</v-icon>
              </div>
              <v-col class="py-0 pt-2">
                <v-text-field
                  name="password"
                  label="Пароль"
                  type="password"
                  filled
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="px-10 pb-7">
        <v-spacer />
        <v-btn
          color="blue darken-1"
          outlined
          large
          @click="isOpen = false"
        >
          Войти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';

@Component
export default class Login extends Vue {
  @State readonly isLoginModal!: boolean;
  @Mutation('setLoginModalState') setLoginModalState!: (newState: boolean) => void;

  get isOpen(): boolean {
    return this.isLoginModal;
  }

  set isOpen(value: boolean) {
    this.setLoginModalState(value);
  }
}
</script>

<style lang="scss">
.login-header {
  background-color: var(--v-primary-base);
  color: white;
}
</style>
