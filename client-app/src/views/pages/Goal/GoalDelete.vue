<template>
  <modal-dialog
    :modal-data="SizeModalView"
    :is-open="state"
    @close="onCancel"
  >
    <Loader :value="isLoadRequest" />
    <div class="d-flex flex-wrap justify-center">
      <p class="flex-grow-1 text-start">
        {{ `Вы действительно хотите удалить цель от ${date} ?` }}
      </p>
    </div>
  </modal-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Watch, } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Global from '@/mixins/GlobalMixin';
import Helper from '@/mixins/Helper';
import GoalController, { TGoal } from '@/controllers/GoalController';
import Loader from '@/components/Loader.vue';
import ModalDialog, { TModalView } from '@/components/ModalDialog.vue';

@Component({
  components: {
  Loader,
  ModalDialog
  }})

export default class GoalDelete extends mixins(Global, Helper) {
  @PropSync('goalDeleteState', {
    type: Boolean,
    default: false
  }) state!: boolean | null;

  @Prop({
    type: Object,
    default: null
  }) readonly request!: TGoal | null;

  SizeModalView: TModalView = {
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

  get localSize(): TGoal | null | undefined {
    return this.request;
  }

  get date():string {
    return this.localeDateFormat(this.localSize?.createdDate ?? '', false);
  }

  async deleteGoal(): Promise<boolean> {
    try {
      this.isLoadRequest = true;

      if (this.localSize) await GoalController.ArchiveGoal(this.localSize?.id, true);
      else throw new Error('Ошибка, Цель не была выбран.');

      this.showSuccess(`Цель с id ${this.localSize?.id} был успешно удалено!`);
      return true;
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
      return false;
    } finally {
      this.isLoadRequest = false;
    }
  }

  private goToGoals() {
    this.state = false;
  }

  async onOk() {
    if (await this.deleteGoal()) {
      this.$emit('refresh');
      this.goToGoals();
    }
  }

  onCancel() {
    this.goToGoals();
  }
}
</script>
