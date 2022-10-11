<template>
  <div>
    <v-snackbar v-model="snack" :timeout="snackbarTimeout" absolute bottom>
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['snackbarMessage', 'snackbarTimeout']),
    snack: {
      get() {
        return this.$store.state.snackbarActive
      },
      set(value) {
        this.$store.commit('SET_SNACKBAR_ACTIVE', value)
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
