<template>
  <modal-dialog
    :modal-data="exerciseModalView"
    :is-open="state"
    @close="onCancel"
  >
    <Loader :value="isLoadRequest" />
    <div class="d-flex flex-wrap justify-center">
      <p class="flex-grow-1 text-start">
        {{ `Вы действительно хотите удалить упражнение ${shortName} ?` }}
      </p>
    </div>
  </modal-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Watch } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import ExerciseController, { TExercise } from '@/controllers/ExerciseController';
import Loader from '@/components/Loader.vue';
import ModalDialog, { TModalView } from '@/components/ModalDialog.vue';

@Component({
  components: {
  Loader,
  ModalDialog
  }})

export default class ExerciseDelete extends Global {
  @PropSync('exerciseDeleteState', {
    type: Boolean,
    default: false
  }) state!: boolean | null;

  @Prop({
    type: Object,
    default: null
  }) readonly request!: TExercise | null;

  exerciseModalView: TModalView = {
    title: `Внимание!`,
    actions: [
      {
        label: 'Удалить',
        onClick: () => this.onOk()
      },
      {
        label: 'Отмена',
        onClick: () => this.onCancel()
      }
    ]
  };

  isLoadRequest = false;

  get localExercise(): TExercise | null | undefined {
    return this.request;
  }

  get shortName():string {
    return this.localExercise?.shortName ??
      this.localExercise?.name ??
      '';
  }

  async deleteExercise(): Promise<boolean> {
    try {
      this.isLoadRequest = true;

      if (this.localExercise) await ExerciseController.ArchiveExercise(this.localExercise?.id, true);
      else throw new Error('Ошибка, запрос не был выбран.');

      this.showSuccess(`Упражнение с id ${this.localExercise?.id} было успешно удалено!`);
      return true;
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
      return false;
    } finally {
      this.isLoadRequest = false;
    }
  }

  private goToExercise() {
    this.state = false;
  }

  async onOk() {
    if (await this.deleteExercise()) {
      this.$emit('refresh');
      this.goToExercise();
    }
  }

  onCancel() {
    this.goToExercise();
  }
}

</script>
