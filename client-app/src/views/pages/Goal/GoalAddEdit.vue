<template>
  <section>
    <v-card>
      <v-card class="pb-5">
        <v-card-title v-if="!isEdit" class="darkblue white--text">
          Добавление цели
        </v-card-title>
        <v-card-title v-else class="darkblue white--text">
          Редактирование цели
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              lazy-validation
            >
              <v-row>
                <v-col class="col-5">
                  <SubGoalAddEdit
                    :sub-goals.sync="view.subGoals"
                  />
                </v-col>
                <v-col class="col-7 ">
                  <div class="d-flex justify-end">
                    <v-btn
                      class="error mb-1"
                      @click="onClickArchive"
                      small
                    >
                      <v-icon class="mr-1">mdi-trash-can</v-icon>
                      Удалить цель
                    </v-btn>
                  </div>
                  <InlineTextField
                    label="Название цели"
                    :value.sync="view.name"
                    :rules="[rules.required]"
                  />
                  <InlineTextareaField
                    label="Описание"
                    :value.sync="view.description"
                  />
                  <InlineDateField
                    label="Дата достижения"
                    :value.sync="view.completionDate"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="px-6">
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
    <GoalDelete
      :goal-delete-state.sync="goalDeleteState"
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
import GoalController, { TGoal } from '@/controllers/GoalController';
import Loader from '@/components/Loader.vue';
import SubGoalAddEdit from './Components/SubGoalAddEdit.vue';
import GoalDelete from './GoalDelete.vue';
import { TUser } from '@/controllers/UserController';
import { Mutation, State } from 'vuex-class';
import InlineTextareaField from '@/components/InlineTextareaField.vue';

@Component({
  components: {
  InlineTextareaField,
  InlineTextField,
  InlineDateField,
  Loader,
  SubGoalAddEdit,
  GoalDelete
  }
  })
export default class GoalAddEdit extends Global {
  @State readonly user!: TUser;
  @Ref('form') readonly form!: any;

  goalDeleteState = false;
  isEdit = false;
  editId: string | null = null;
  view: TGoal = new TGoal();

  isLoading = false;

  mounted() {
    if (this.$route.name === 'GoalEdit' && this.$route.params) {
      this.isEdit = true;
      this.editId = this.$route.params?.id;
      this.InitViewEdit();
    }
  }

  async onClickArchive() {
    this.goalDeleteState = true;
  }

  async InitViewEdit() {
    try {
      this.isLoading = true;
      if (this.editId) {
        this.view.userId = this.user.id;
        const goal = await GoalController.GetGoalById(this.editId);
        this.view = goal;
      }
      else throw new Error('Ошибка, не удалось загрузить цель');
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
        this.view
        const goalId = await GoalController.CreateGoal(this.view);
        this.showSuccess(`Цель ${this.view.name} успешно добавлен с идентификатором ${goalId}`);
      } else if (this.isEdit && this.editId) {
        const goalId = await GoalController.UpdateGoal(this.editId, this.view);
        this.showSuccess(`Цель ${this.view.name} с идентификатором ${goalId} успешно обновлена!`);
      }
      this.goToGoals();
    } catch (err) {
      this.showError(`Ошибка. Не удалось добавить/обновить цель ${this.view.name}`);
    } finally {
      this.isLoading = false;
    }
  }

  /*
  async archive() {
    try {
      this.isLoading = true;
      await GoalController.ArchiveGoal(this.view.id, true);
      this.showSuccess(`Цель ${this.view.name} успешно удалена`);
      this.goToGoals();
    } catch (err) {
      this.showError(`Не удалось удалить цель ${this.view.name}`);
    } finally {
      this.isLoading = false;
    }
  }
  */

  private goToGoals() {
    this.$router.push({ name: 'Goal' });
  }

  cancel() {
    this.goToGoals();
  }
}

</script>
