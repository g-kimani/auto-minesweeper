<template>
  <game-grid :size="10" :bomb-count="10" />
</template>

<script>
import GameGrid from '~/components/GameGrid.vue'
export default {
  components: { GameGrid },
}
</script>

<style></style>
