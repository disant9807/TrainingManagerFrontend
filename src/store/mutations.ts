import { MutationTree } from 'vuex';
import State from './state';
import { TUser, getGroups } from '@/controllers/models/User';
import { TSnackBarStatuses } from '@/components/snackbar/SnackBar';

const mutations: MutationTree<State> = {
  setCurrentUser(state: State, newState: TUser) {
    state.user = newState;
    state.userGroups = getGroups(newState.roles);
  },

  setDrawerstate(state: State, newState: boolean) {
    state.isDrawerMini = newState;
  },

  setLoading(state: State) {
    // state.loading[options.category][options.name] = options.value
  },

  setSnackbarShow(state: State, newState: boolean) {
    state.snackBar.show = newState;
  },

  setSnackbarStatus(state: State, newState: TSnackBarStatuses) {
    state.snackBar.status = newState;
  },

  setSnackbarMessage(state: State, newState: string) {
    state.snackBar.message = newState;
  },

  setSnackbarTimeout(state: State, newState: number) {
    state.snackBar.timeout = newState;
  },

  setSnackbarHtml(state: State, newState: boolean) {
    state.snackBar.isHtml = newState;
  },

  setFilters(state: State, options: { status: string, value: string, name: string }) {
    if (options.status) {
      state.filters[options.name][options.status] = options.value;
    } else {
      state.filters[options.name] = options.value;
    }
  }
};

export default mutations;
