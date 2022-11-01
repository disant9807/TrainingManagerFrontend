<template>
  <modal-dialog
    :modal-data="trainingProgramModalView"
    :is-open="state"
    @close="onCancel"
  >
    <Loader :value="isLoadRequest" />
    <div class="d-flex flex-wrap justify-center">
      <p class="flex-grow-1 text-start">
        {{ `Вы действительно хотите удалить тренировочную программу ${shortName} ?` }}
      </p>
    </div>
  </modal-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Watch } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import TrainingProgramController, { TTrainingProgram } from '@/controllers/TrainingProgramController';
import Loader from '@/components/Loader.vue';
import ModalDialog, { TModalView } from '@/components/ModalDialog.vue';

@Component({
  components: {
  Loader,
  ModalDialog
  }})

export default class TrainingProgramDelete extends Global {
  @PropSync('trainingProgramDeleteState', {
    type: Boolean,
    default: false
  }) state!: boolean | null;

  @Prop({
    type: Object,
    default: null
  }) readonly request!: TTrainingProgram | null;

  trainingProgramModalView: TModalView = {
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

  get localTrainingProgram(): TTrainingProgram | null | undefined {
    return this.request;
  }

  get shortName():string {
    return this.localTrainingProgram?.shortName ??
      this.localTrainingProgram?.name ??
      '';
  }

  async deleteTrainingProgram(): Promise<boolean> {
    try {
      this.isLoadRequest = true;

      if (this.localTrainingProgram) await TrainingProgramController.ArchiveTrainingProgram(this.localTrainingProgram?.id, true);
      else throw new Error('Ошибка, запрос не был выбран.');

      this.showSuccess(`Тренировочная программа с id ${this.localTrainingProgram?.id} было успешно удалено!`);
      return true;
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
      return false;
    } finally {
      this.isLoadRequest = false;
    }
  }

  private goToTrainingProgram() {
    this.state = false;
  }

  async onOk() {
    if (await this.deleteTrainingProgram()) {
      this.$emit('refresh');
      this.goToTrainingProgram();
    }
  }

  onCancel() {
    this.goToTrainingProgram();
  }
}
</script>
