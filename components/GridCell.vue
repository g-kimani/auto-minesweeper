<template>
  <div class="fill-height">
    <!-- <v-card
      :class="classList"
      flat
      tile
      ripple
      height="100"
      @click="$emit('click')"
    >
      {{ cell.value === 0 ? '0' : '1' }}
    </v-card> -->
    <v-card
      flat
      tile
      ripple
      height="100%"
      col
      :class="classList"
      @click.left="$emit('reveal')"
      @click.right.stop="flagged"
    >
      <v-icon v-if="cell.isFlagged" :color="focused ? 'black' : ''">
        mdi-flag
      </v-icon>
      <v-icon v-else-if="cell.isBomb" v-show="showBomb">mdi-bomb</v-icon>
      <span v-else>{{ cell.data }}</span>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    focused: { type: Boolean, default: false },
    showBomb: { type: Boolean, default: false },
  },
  computed: {
    cell() {
      return this.$store.state.grid.cells[this.x][this.y]
    },
    classList() {
      const classes = []
      classes.push('grid-cell')
      if (this.cell.isFlagged) classes.push('flagged')
      if (this.cell.data) classes.push(`cell-value-${this.cell.data}`)
      if (this.focused) classes.push('focused')
      return classes
    },
  },
  methods: {
    flagged(event) {
      event.preventDefault()
      this.$emit('flagged')
    },
  },
}
</script>

<style lang="scss" scoped>
.grid-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
  width: 100%;
  height: 100%;
  border: 1px solid black;
  font-weight: 700;
  // background-color: green;
}
.flagged {
  background-color: aquamarine;
}
.focused {
  background-color: beige;
  color: black;
}
.cell-value-1 {
  color: rgb(36, 149, 214);
}
.cell-value-2 {
  color: rgb(35, 236, 172);
}
.cell-value-3 {
  color: rgb(235, 186, 65);
}
.cell-value-4 {
  color: rgb(218, 93, 93);
}
.cell-value-5 {
  color: rgb(199, 54, 52);
}
.cell-value-6 {
  color: rgb(153, 42, 41);
}
.cell-value-7 {
  color: rgb(105, 27, 26);
}
.cell-value-8 {
  color: rgb(59, 12, 11);
}
.hidden {
  background-color: aquamarine;
  cursor: pointer;
}
.hidden:hover {
  background-color: whitesmoke !important;
  /* color: whitesmoke; */
}
</style>
