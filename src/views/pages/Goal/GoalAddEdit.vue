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
                <v-col>
                  <InlineTextField
                    label="Название цели"
                    :value.sync="view.name"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col>
                  <InlineTextField
                    label="Описание"
                    :value.sync="view.description"
                  />
                </v-col>
                <v-col>
                  <InlineDateField
                    label="Дата достижения"
                    :value.sync="view.completionDate"
                  />
                </v-col>
              </v-row>
              <v-sheet
                class="mt-3 py-3"
                color="white"
                elevation="1"
                rounded
              >
                <SubGoalAddEdit
                  :size-items.sync="view.subGoals"
                />
              </v-sheet>
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

@Component({
  components: {
  InlineTextField,
  InlineDateField,
  Loader,
  SubGoalAddEdit
  }
  })
export default class TrainingAddEdit extends Global {
  @Ref('form') readonly form!: any;

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

  async InitViewEdit() {
    try {
      this.isLoading = true;
      if (this.editId) {
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

  private goToGoals() {
    this.$router.push({ name: 'Goal' });
  }

  cancel() {
    this.goToGoals();
  }
}

</script>
