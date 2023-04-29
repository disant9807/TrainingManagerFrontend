<template>
  <section>
    <v-card>
      <v-card class="pb-5">
        <v-card-title v-if="!isEdit" class="darkblue white--text">
          Добавление замера
        </v-card-title>
        <v-card-title v-else class="darkblue white--text">
          Редактирование замера
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              lazy-validation
            >
              <v-row>
                <v-col class="col-7">
                  <SizeSubAddEdit
                    :size-items.sync="view.sizeItems"
                  />
                </v-col>
                <v-col class="col-5">
                  <div class="d-flex justify-end">
                    <v-btn
                      class="error mb-1"
                      @click="onClickArchive"
                      small
                    >
                      <v-icon class="mr-1">mdi-trash-can</v-icon>
                      Удалить замер
                    </v-btn>
                  </div>
                  <InlineTextField
                    label="Название замера"
                    :value.sync="view.name"
                    :rules="[rules.required]"
                  />
                  <InlineDateField
                    label="Дата Создания"
                    :value.sync="view.createdDate"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="primary"
            @click="save"
          >
            Сохранить
          </v-btn>
          <v-btn
            class="error"
            @click="cancel"
          >
            Отмена
          </v-btn>
          <v-btn
            class="primary"
            @click="$router.back()"
          >
            Назад
          </v-btn>
        </v-card-actions>
        <Loader :value="isLoading" />
      </v-card>
    </v-card>
    <SizeDelete
      :size-delete-state.sync="sizeDeleteState"
      :request="view"
      @refresh="cancel"
    />
  </section>
</template>
<script lang="ts">
import { Component, Prop, Ref, Watch } from 'vue-property-decorator';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineDateField from '@/components/InlineDateField.vue';
import Global from '@/mixins/GlobalMixin';
import SizeController, { TSize } from '@/controllers/SizeController';
import Loader from '@/components/Loader.vue';
import SizeSubAddEdit from './Components/SizeSubAddEdit.vue';
import SizeDelete from './SizeDelete.vue';
import { Mutation, State } from 'vuex-class';
import { TUser } from '@/controllers/UserController';

@Component({
  components: {
  InlineTextField,
  InlineDateField,
  Loader,
  SizeSubAddEdit,
  SizeDelete
  }
  })
export default class TrainingAddEdit extends Global {
  @State readonly user!: TUser;
  @Ref('form') readonly form!: any;

  sizeDeleteState = false;
  isEdit = false;
  editId: string | null = null;
  view: TSize = new TSize();

  isLoading = false;

  mounted() {
    if (this.$route.name === 'SizeEdit' && this.$route.params) {
      this.isEdit = true;
      this.editId = this.$route.params?.id;
      this.InitViewEdit();
    } else {
      this.view.name = 'Новый замер';
      this.view.createdDate = new Date().toDateString();
    }
  }

  async onClickArchive() {
    this.sizeDeleteState = true;
  }

  async InitViewEdit() {
    try {
      this.isLoading = true;
      if (this.editId) {
        const size = await SizeController.GetSizeById(this.editId);
        this.view = size;
      }
      else throw new Error('Ошибка, не удалось загрузить замер');
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  async save() {
    if (!this.form.validate()) {
      this.showInfo('Необходимо заполнить обязательные поля!');
      return;
    }

    try {
      this.isLoading = true;
      if (!this.isEdit) {
        this.view.userId = this.user.id;
        const sizeId = await SizeController.CreateSize(this.view);
        this.showSuccess(`Замер ${this.view.name} успешно добавлен с идентификатором ${sizeId}`);
      } else if (this.isEdit && this.editId) {
        const sizeId = await SizeController.UpdateSize(this.editId, this.view);
        this.showSuccess(`Замер ${this.view.name} с идентификатором ${sizeId} успешно обновлена!`);
      }
      this.goToSizes();
    } catch (err) {
      this.showError(`Ошибка. Не удалось добавить/обновить замер ${this.view.name}`);
    } finally {
      this.isLoading = false;
    }
  }

  private goToSizes() {
    this.$router.push({ name: 'Size' });
  }

  cancel() {
    this.goToSizes();
  }
}

</script>
