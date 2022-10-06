<template>
  <div>
    <v-card>
      <v-card class="red">ha <game-timer ref="timer" /></v-card>
      <game-grid ref="grid" :size="10" :bomb-count="5" @gridClicked="showRef" />
      <v-btn @click="showRef">ha</v-btn>
    </v-card>
  </div>
</template>

<script>
import GameGrid from './GameGrid.vue'
import GameTimer from './GameTimer.vue'
export default {
  components: { GameGrid, GameTimer },
  data() {
    return {
      gameStarted: false,
      gameOver: false,
    }
  },
  methods: {
    showRef() {
      this.$refs.timer.start()
      console.log(this.$refs.grid.hiddenCellBorder())
    },
  },
}
</script>

<style lang="scss" scoped></style>
