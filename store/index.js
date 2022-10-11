export const state = () => ({
  snackbarActive: false,
  snackbarMessage: '',
  snackbarTimeout: null,
})

export const actions = {
  showSnackbar({ commit }, payload) {
    commit('SET_SNACKBAR_ACTIVE', true)
    commit('SET_SNACKBAR_MESSAGE', payload)
    commit('SET_SNACKBAR_TIMEOUT', calculateReadingSeconds(payload))
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

// inspired by
// https://infusion.media/content-marketing/how-to-calculate-reading-time/
function calculateReadingSeconds(text) {
  console.log(text)
  const time = (text.split(' ').length / 200).toString()
  const [min, sec] = time.split('.')
  let secCalc = parseFloat(sec) * 0.6
  if (secCalc > 30) {
    secCalc = 60
  }
  return (min * 60 + secCalc) * 1000
}
