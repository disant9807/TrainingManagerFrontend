<template>
  <v-card>
    <v-card-title class="login-header">
      <v-icon color="white" class="mr-2">mdi-login</v-icon>
      <span class="headline">Авторизация</span>
      <v-spacer />
    </v-card-title>
    <v-card-text class="pb-0">
      <v-container class="pb-0 pt-7">
        <v-row v-if="errorMessage" class="pl-9">
          <span style="color:red">{{ errorMessage }}</span>
        </v-row>

        <v-form>
          <v-row>
            <div class="pt-7">
              <v-icon>mdi-account</v-icon>
            </div>
            <v-col class="py-0 pt-2">
              <v-text-field
                v-model="username"
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
                v-model="password"
                name="password"
                label="Пароль"
                type="password"
                filled
                @keydown="onKeyDown"
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
        @click="doLogin"
      >
        Войти
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Global from '@/mixins/GlobalMixin'
import AuthController from '@/controllers/Auth'
import { mixins } from 'vue-class-component'
import { TUser } from '@/controllers/models/User'
import UserController from '@/controllers/UserController'
import { Mutation, State } from 'vuex-class'

@Component
export default class Login extends mixins(Global) {
  @Mutation('setCurrentUser') setUser!: (user: any) => void;
  @State(state => state.user) user!: TUser;
  username = '';
  password = '';
  errorMessage:string|null = null;
  // certs:Certificate[] = [];

  async doLogin () {
    const response = await AuthController.login(this.username, this.password)
    if (response.error) {
      // this.errorMessage = this.$localize('errorMessage', 'auth');
      setTimeout(() => this.errorMessage = null, 2000)
      return
    }
    const currentUser = await UserController.getUserById(this.username)
    if (this.isAny(currentUser.roles)) {
      this.setUser(currentUser)
      this.$emit('logged')
      return
    }
    // this.errorMessage = this.$localize('rightsError', 'messages');
    setTimeout(() => this.errorMessage = null, 3000)
  }

  onKeyDown (e: KeyboardEvent) {
    if (e.code === 'Enter') this.doLogin()
  }
}
</script>

<style lang="scss">
.login-header {
  background-color: var(--v-darkblue-base);
  color: white;
}
</style>
