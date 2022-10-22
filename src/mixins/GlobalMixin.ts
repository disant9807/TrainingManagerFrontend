import SnackBarController from '@/components/snackbar/SnackBar';
import { Mutation, State } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
// import { isAdmin } from '@/controllers/UserController';
import { validation } from './Validation';

@Component
export default class Global extends Vue {
  @State readonly isCommonModal!: boolean;
  @Mutation('setCommonModalState') setModalState!: (newState: boolean) => void;
  readonly validation = validation;
  get rules() { return this.validation.rules; }

  showInfo(msg: string, timeout?: number, isHtml?: boolean): void {
    SnackBarController.showInfo(msg, timeout, isHtml);
  }

  showError(msg: string, timeout?: number, isHtml?: boolean): void {
    SnackBarController.showError(msg, timeout, isHtml);
  }

  showSuccess(msg: string, timeout?: number, isHtml?: boolean): void {
    SnackBarController.showSuccess(msg, timeout, isHtml);
  }

  get modalState(): boolean {
    return this.isCommonModal;
  }

  set modalState(value: boolean) {
    this.setModalState(value);
  }

  openModal(): void {
    this.setModalState(true);
  }

  closeModal(): void {
    this.setModalState(false);
  }

  isAny(value: any): boolean {
    return value != null ? value.length > 0 : false;
  }

  toFileUrlFormat(id: string): string {
    const url = process.env.VUE_APP_API_GATEWAY;
    const urlImage = process.env.VUE_IMAGE_GET;
    return `${url}${urlImage}${id}`;
  }

  // get isAdmin(): boolean { return isAdmin(); }
}
