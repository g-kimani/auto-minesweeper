<template>
  <div>
    <v-card>
      <v-card class="d-flex justify-space-around" tile>
        <div class="header-item">
          <v-icon>mdi-flag</v-icon>{{ flagsRemaining }}
        </div>
        <div class="header-item head-man">
          <v-btn :disabled="!gameOver" @click="resetGame">
            <img :src="avatar" height="100%" class="avatar" />
          </v-btn>
        </div>
        <game-timer ref="timer" class="header-item" />
      </v-card>
      <game-grid
        ref="grid"
        :game-loaded="loaded"
        :disabled="gameStarted && gameOver"
        :show-bombs="showBombs"
        @gridClicked="runChecks"
        @hitBomb="endGame"
      />
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import GameGrid from './GameGrid.vue'
import GameTimer from './GameTimer.vue'
export default {
  components: { GameGrid, GameTimer },
  data() {
    return {
      loaded: false,
      gameStarted: false,
      gameOver: false,
      avatar: require('assets/smile.png'),
      showBombs: false,
    }
  },
  computed: {
    ...mapState('grid', ['bombCount', 'flaggedCells']),
    ...mapGetters('grid', ['flagCount']),
    flagsRemaining() {
      return this.bombCount - this.flagCount
    },
  },
  mounted() {
    this.resetGame()
  },
  methods: {
    ...mapActions('grid', ['buildGrid', 'placeBombs', 'resetGrid']),
    resetGame() {
      this.changeAvatar(0)
      this.$refs.timer.stop()
      this.$refs.timer.reset()
      this.gameOver = false
      this.gameStarted = false
      this.resetGrid()
      this.buildGrid().then((r) => {
        this.placeBombs().then(() => {
          this.loaded = true
          this.showBombs = false
          this.initialiseInput()
        })
      })
    },
    runChecks() {
      if (!this.gameStarted) {
        this.$refs.timer.start()
        this.gameStarted = true
      }
      this.checkWin()
      // this.$refs.timer.start()
    },
    initialiseInput() {
      this.$refs.grid.$el.addEventListener('mouseover', this.avatarSurprised)
      this.$refs.grid.$el.addEventListener('mouseleave', this.avatarSmiling)
    },
    destroyInput() {
      this.$refs.grid.$el.removeEventListener('mouseover', this.avatarSurprised)
      this.$refs.grid.$el.removeEventListener('mouseleave', this.avatarSmiling)
    },
    avatarSurprised(event) {
      event.stopPropagation()
      if (this.gameStarted && !this.gameOver) {
        this.changeAvatar(1)
      }
    },
    avatarSmiling(event) {
      event.stopPropagation()
      if (!this.gameOver) {
        this.changeAvatar(0)
      }
    },
    changeAvatar(icon) {
      // console.log("ha", ha);
      switch (icon) {
        case 0:
          this.avatar = require('assets/smile.png')
          break
        case 1:
          // console.log("ja");
          this.avatar = require('assets/surprised.png')
          break
        case 2:
          this.avatar = require('assets/dead.png')
          break
        case 3:
          this.avatar = require('assets/win.png')
          break
        default:
          this.avatar = require('assets/smile.png')
      }
    },
    checkWin() {
      console.log(this.flagCount, this.bombCount)
      console.log(this.flaggedCells)
      // console.log(this.bombCount);
      if (this.flagCount === this.bombCount) {
        console.log('nearly all flags placed')
        if (this.flaggedCells.every((fc) => fc.isBomb)) {
          this.changeAvatar(3)
          this.destroyInput()
          this.gameOver = true
          // this.gridDisplay.style.pointerEvents = 'none'
          console.log('happy win you found all the bombs')
        }
      }
    },
    endGame() {
      this.changeAvatar(2)
      this.gameOver = true
      this.showBombs = true
    },
  },
}
</script>

<style lang="scss" scoped>
.header-item {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar {
  height: 100%;
}
::v-deep .head-man {
  .v-btn__content {
    height: 100%;
  }
}
</style>
