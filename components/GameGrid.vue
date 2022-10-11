<template>
  <div>
    <div v-if="gameLoaded" :key="gridKey" class="game-grid">
      <v-row
        v-for="(row, x) in cells"
        :key="x"
        no-gutters
        class="fill-height grid-row"
      >
        <v-col v-for="(cell, y) in row" :key="y" class="fill-height">
          <v-hover v-slot="{ hover }">
            <grid-cell
              :x="x"
              :y="y"
              :focused="hover"
              :show-bomb="showBombs"
              @reveal="handleClick(0, x, y)"
              @flagged="handleClick(1, x, y)"
            />
          </v-hover>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-container class="text-centre"> Loading grid </v-container>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GridCell from './GridCell.vue'
export default {
  components: { GridCell },
  props: {
    disabled: { type: Boolean, default: false },
    showBombs: { type: Boolean, default: false },
    gameLoaded: { type: Boolean, default: false },
  },
  data() {
    return {
      gridKey: 0,
    }
  },
  computed: {
    ...mapState('grid', ['cells']),
  },
  created() {},
  methods: {
    ...mapActions('grid', ['revealSection', 'toggleFlag']),
    ...mapActions(['showSnackbar']),
    handleClick(action, x, y) {
      if (this.disabled) {
        this.showSnackbar('Grid Disabled')
        return
      }

      if (action === 0) {
        this.$nextTick(() => {
          this.revealSection({ x, y }).then((r) => {
            if (r === 0) {
              this.$emit('hitBomb')
              this.gridKey++
            } else {
              this.gridKey++
              this.$emit('gridClicked')
            }
          })
        })
      } else if (action === 1) {
        this.toggleFlag({ x, y }).then(() => {
          this.gridKey++
          this.$emit('gridClicked')
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.game-grid {
  border: 1px solid black;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 400px;
  min-width: 480px;
}
.grid-row {
  display: flex;
  height: 100%;
}
</style>
