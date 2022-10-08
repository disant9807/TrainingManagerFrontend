import { MutationTree } from 'vuex'
import State from './state'
import { TUser, getGroups } from '@/controllers/models/User'

const mutations: MutationTree<State> = {
  setCurrentUser (state: State, newState: TUser) {
    state.user = newState
    state.userGroups = getGroups(newState.roles)
  },

  setDrawerstate (state: State, newState: boolean) {
    state.isDrawerMini = newState
  },

  setLoading (state: State, options: {
    category: 'incoming' | 'outgoing' | 'fgisdo' | 'gisgmp' | 'settings'
    name: string,
    value: boolean,
  }) {
    // @ts-ignore
    state.loading[options.category][options.name] = options.value
  },

  setFilters (state: State, options: { status: string, value: string, name: string }) {
    if (options.status) {
      state.filters[options.name][options.status] = options.value
    } else {
      state.filters[options.name] = options.value
    }
  }
}

export default mutations
