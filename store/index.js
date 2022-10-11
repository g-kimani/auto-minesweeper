export const state = () => ({
  snackbarActive: false,
  snackbarMessage: '',
  snackbarTimeout: null,
})

export const actions = {
  showSnackbar({ commit }, payload) {
    commit('SET_SNACKBAR_ACTIVE', true)
    commit('SET_SNACKBAR_MESSAGE', payload)
    commit('SET_SNACKBAR_TIMEOUT', calculateStringTimeout(payload))
  },
}

export const mutations = {
  SET_SNACKBAR_ACTIVE(state, payload) {
    state.snackbarActive = payload
  },
  SET_SNACKBAR_MESSAGE(state, payload) {
    state.snackbarMessage = payload
  },
  SET_SNACKBAR_TIMEOUT(state, payload) {
    state.snackbarTimeout = payload
  },
}

function calculateStringTimeout(text) {
  const count = text.match(/\s/g)?.length
  const timeout = count * 500 + 3000 / 2
  console.log('timeout set for ', timeout)
  return timeout
}
