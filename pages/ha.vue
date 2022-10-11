<template>
  <div>
    <game-manager />
    <snackbar-message />
  </div>
</template>

<script>
import GameManager from '~/components/GameManager.vue'
import SnackbarMessage from '~/components/SnackbarMessage.vue'
export default {
  components: { GameManager, SnackbarMessage },
}
</script>

<style></style>
