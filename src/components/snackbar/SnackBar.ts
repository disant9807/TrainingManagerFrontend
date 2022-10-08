import store from '@/store'

export interface Messages {
  success?: string;
  error?: string;
  info?: string;
}

export type TSnackBarStatuses = keyof Messages;
export type TSnackBar = {
  show: boolean,
  status: TSnackBarStatuses,
  message: string,
  isHtml: boolean,
  timeout: number,
}

class SnackBarModel {
  defaultTimeout = 6000

  icons: Record<TSnackBarStatuses, string> = {
    success: 'mdi-check-circle',
    error: 'mdi-alert',
    info: 'mdi-information'
  }

  defaultMessages: Record<TSnackBarStatuses, string> = {
    success: 'Успешно!',
    error: 'Ошибка!',
    info: 'Внимание!'
  }

  showInfo (msg = this.defaultMessages.info, timeout = this.defaultTimeout, isHtml = false) {
    store.commit('setSnackbarStatus', 'info')
    store.commit('setSnackbarMessage', msg)
    store.commit('setSnackbarTimeout', timeout)
    store.commit('setSnackbarHtml', isHtml)
    store.commit('setSnackbarShow', true)
  }

  showSuccess (msg = this.defaultMessages.success, timeout = this.defaultTimeout, isHtml = false) {
    store.commit('setSnackbarStatus', 'success')
    store.commit('setSnackbarMessage', msg)
    store.commit('setSnackbarTimeout', timeout)
    store.commit('setSnackbarHtml', isHtml)
    store.commit('setSnackbarShow', true)
  }

  showError (msg = this.defaultMessages.error, timeout = this.defaultTimeout, isHtml = false) {
    store.commit('setSnackbarStatus', 'error')
    store.commit('setSnackbarMessage', msg)
    store.commit('setSnackbarTimeout', timeout)
    store.commit('setSnackbarHtml', isHtml)
    store.commit('setSnackbarShow', true)
  }
}

const SnackBarController = new SnackBarModel()

export type TSnackbarIcons = typeof SnackBarController.icons[keyof typeof SnackBarController.icons]

export default SnackBarController
